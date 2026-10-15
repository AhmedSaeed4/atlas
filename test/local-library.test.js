import test from "node:test";
import assert from "node:assert/strict";
import { normalizeGraph } from "../public/src/schema.js";
import { LIBRARY_STORAGE_KEY, readLibrary, writeLibrary } from "../public/src/storage.js";
import { createLibraryLock, createLocalLibrary, reconcileLocalLibrary } from "../public/src/local-library.js";

const record = (id, name = id) => ({ id, updatedAt: 1, graph: normalizeGraph({ project: { name }, nodes: [{ id: "n", label: name }], edges: [] }) });
function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}
function serialLock() {
  let queue = Promise.resolve();
  return operation => { const result = queue.then(operation); queue = result.then(() => undefined, () => undefined); return result; };
}
function sessions() {
  const storage = memoryStorage(), withLock = serialLock();
  writeLibrary([record("alpha")], "alpha", { storage });
  const open = options => createLocalLibrary({ normalizeGraph, storage, withLock, ...options });
  return { storage, open, first: open(), second: open(), read: () => readLibrary(normalizeGraph, { storage }) };
}

test("a stale tab cannot remove a newer map by selecting an existing map", async () => {
  const {first, second, read} = sessions();
  assert.equal((await first.save([record("beta"), ...first.initial.projects], "beta")).ok, true);
  assert.equal((await second.save(second.initial.projects, "alpha")).code, "local-conflict");
  assert.deepEqual(read().projects.map(p => p.id), ["beta", "alpha"]);
  assert.equal(second.checkForChanges(), true);
  assert.match(second.state().error, /another tab/);
});

test("stale edits remain available in memory and cannot replace another tab's newer edits", async () => {
  const {first, second, read} = sessions();
  const local = second.initial.projects;
  local[0].graph.nodes[0].label = "Unsaved second-tab edit";
  assert.equal((await first.save([record("alpha", "First tab saved")], "alpha")).ok, true);
  assert.equal((await second.save(local, "alpha")).ok, false);
  assert.equal((await second.save(local, "alpha")).ok, false);
  assert.equal(read().projects[0].graph.nodes[0].label, "First tab saved");
  assert.equal(local[0].graph.nodes[0].label, "Unsaved second-tab edit");
  assert.equal(second.hasUnsaved(local), true);
});

test("a stale tab cannot resurrect another tab's deleted map or clear its new maps", async () => {
  const {first, second, read, open} = sessions();
  assert.equal((await first.save([], "")).ok, true);
  assert.equal((await second.save(second.initial.projects, "alpha")).ok, false);
  assert.deepEqual(read().projects, []);
  const current = open();
  assert.equal((await current.save([record("new")], "new")).ok, true);
  assert.equal((await second.clear()).code, "local-conflict");
  assert.deepEqual(read().projects.map(p => p.id), ["new"]);
});

test("two concurrent writers serialize the check and commit so exactly one stale snapshot wins", async () => {
  const {first, second, read} = sessions();
  const results = await Promise.all([
    first.save([record("one"), ...first.initial.projects], "one"),
    second.save([record("two"), ...second.initial.projects], "two"),
  ]);
  assert.deepEqual(results.map(r => r.ok), [true, false]);
  assert.equal(results[1].code, "local-conflict");
  assert.deepEqual(read().projects.map(p => p.id), ["one", "alpha"]);
});

test("queued saves capture their own graph before yielding and finish in intent order", async () => {
  const storage = memoryStorage();
  let release;
  const delayed = new Promise(resolve => { release = resolve; });
  const session = createLocalLibrary({ normalizeGraph, storage, withLock: async operation => { await delayed; return operation(); } });
  const projects = [record("map", "First")];
  const first = session.save(projects, "map");
  projects[0].graph.project.name = "Second";
  const second = session.save(projects, "map");
  projects[0].graph.project.name = "Not submitted";
  release();
  assert.equal((await first).ok, true);
  assert.equal((await second).ok, true);
  assert.equal(readLibrary(normalizeGraph, { storage }).projects[0].graph.project.name, "Second");
  assert.equal(session.state().pending, 0);
  assert.equal(session.hasUnsaved(projects), true);
});

test("storage failures do not advance the baseline and a later safe retry can succeed", async () => {
  const {storage, open, read} = sessions();
  const nativeSet = storage.setItem;
  let fail = true;
  storage.setItem = (...args) => { if (fail) throw Object.assign(new Error("full"), { name: "QuotaExceededError" }); return nativeSet(...args); };
  const session = open();
  const projects = [record("retry")];
  assert.equal((await session.save(projects, "retry")).ok, false);
  assert.match(session.state().error, /storage is full/i);
  assert.deepEqual(read().projects.map(p => p.id), ["alpha"]);
  fail = false;
  assert.equal((await session.save(projects, "retry")).ok, true);
  assert.equal(session.state().error, "");
  assert.equal(session.hasUnsaved(projects), false);
});

test("clearing is serialized, blocks later saves, and changes no unrelated browser keys", async () => {
  const {storage, first, read} = sessions();
  storage.setItem("unrelated", "keep");
  const clear = first.clear();
  assert.equal(first.state().clearing, true);
  assert.equal((await first.save([record("late")], "late")).code, "clearing");
  assert.equal((await clear).ok, true);
  assert.deepEqual(read().projects, []);
  assert.equal(storage.getItem("unrelated"), "keep");
  assert.equal(first.state().clearing, false);
  assert.equal((await first.save([record("fresh")], "fresh")).ok, true);
});

test("corrupt v1 data is preserved until an explicit guarded recovery clear", async () => {
  const storage = memoryStorage(), raw = "{broken owner bytes";
  storage.setItem(LIBRARY_STORAGE_KEY, raw);
  const session = createLocalLibrary({normalizeGraph, storage, withLock: serialLock()});
  assert.equal(session.initial.rawBackup, raw);
  assert.equal((await session.save([record("replacement")], "replacement")).code, "recovery");
  assert.equal(storage.getItem(LIBRARY_STORAGE_KEY), raw);
  assert.equal((await session.clear()).ok, true);
  assert.equal((await session.save([record("new")], "new")).ok, true);
});

test("an external browser clear cannot be undone by a stale tab save", async () => {
  const {storage, second, read} = sessions();
  storage.removeItem(LIBRARY_STORAGE_KEY);
  assert.equal(second.checkForChanges(), true);
  assert.equal((await second.save(second.initial.projects, "alpha")).code, "local-conflict");
  assert.deepEqual(read().projects, []);
});

test("Web Locks encloses the operation and lack of safe coordination fails without writing", async () => {
  const calls = [];
  const lock = createLibraryLock({ locks: { request: async (name, options, operation) => { calls.push([name, options.mode]); return operation(); } } });
  assert.equal(await lock(() => 42), 42);
  assert.deepEqual(calls, [["atlas-local-library-v1", "exclusive"]]);
  const storage = memoryStorage();
  const session = createLocalLibrary({ normalizeGraph, storage, withLock: createLibraryLock({locks: null, database: null}) });
  assert.equal((await session.save([record("map")], "map")).ok, false);
  assert.equal(storage.getItem(LIBRARY_STORAGE_KEY), null);
  assert.match(session.state().error, /Safe local saving is unavailable/);
});

test("clean tabs receive new maps and can continue saving without losing the newer library", async () => {
  const { first, second, read } = sessions();
  await first.save([record("beta"), ...first.initial.projects], "beta");
  const received = second.synchronize(second.initial.projects);
  assert.equal(received.status, "updated");
  const view = reconcileLocalLibrary(second.initial.projects, "alpha", received.library);
  assert.equal(view.activeId, "alpha");
  assert.deepEqual(view.projects.map(project => project.id), ["beta", "alpha"]);
  assert.equal(second.state().error, "");
  assert.equal(second.hasUnsaved(view.projects), false);
  view.projects[1].graph.nodes[0].label = "Edited after automatic update";
  assert.equal((await second.save(view.projects, view.activeId)).ok, true);
  assert.deepEqual(read().projects.map(project => project.id), ["beta", "alpha"]);
  assert.equal(read().projects[1].graph.nodes[0].label, "Edited after automatic update");
});

test("receiving another tab's selection neither changes this tab's map nor echoes a write", async () => {
  const { storage, first, second } = sessions();
  await first.save(first.initial.projects, "another-tab-navigation-only");
  const saved = storage.getItem(LIBRARY_STORAGE_KEY);
  let writes = 0;
  const set = storage.setItem;
  storage.setItem = (...args) => { writes++; return set(...args); };
  const received = second.synchronize(second.initial.projects);
  const view = reconcileLocalLibrary(second.initial.projects, "alpha", received.library);
  assert.equal(view.activeId, "alpha");
  assert.equal(view.projects[0], second.initial.projects[0]);
  assert.equal(view.libraryChanged, false);
  assert.equal(view.activeChanged, false);
  assert.equal(writes, 0);
  assert.equal(storage.getItem(LIBRARY_STORAGE_KEY), saved);
  assert.equal(second.synchronize(view.projects).status, "unchanged");
});

test("saved graph edits, metadata and node removals arrive together with a fresh history graph", async () => {
  const { first, second } = sessions();
  const edited = record("alpha", "Updated project");
  edited.graph.nodes = [{ id: "new-node", label: "Replacement", type: "Service", description: "", source: "", group: "" }];
  await first.save([edited], "alpha");
  const received = second.synchronize(second.initial.projects);
  const view = reconcileLocalLibrary(second.initial.projects, "alpha", received.library);
  assert.equal(view.activeId, "alpha");
  assert.equal(view.activeChanged, true);
  assert.notEqual(view.projects[0].graph, second.initial.projects[0].graph);
  assert.equal(view.projects[0].graph.project.name, "Updated project");
  assert.deepEqual(view.projects[0].graph.nodes.map(node => node.id), ["new-node"]);
});

test("remote deletion and clearing update clean tabs without resurrecting deleted maps", async () => {
  const { storage, first, second, read } = sessions();
  await first.save([record("beta")], "beta");
  const replacement = second.synchronize(second.initial.projects);
  const view = reconcileLocalLibrary(second.initial.projects, "alpha", replacement.library);
  assert.equal(view.activeId, "beta");
  assert.equal(view.activeChanged, true);
  storage.removeItem(LIBRARY_STORAGE_KEY);
  const cleared = second.synchronize(view.projects);
  const empty = reconcileLocalLibrary(view.projects, view.activeId, cleared.library);
  assert.equal(cleared.status, "updated");
  assert.equal(empty.activeId, "");
  assert.deepEqual(empty.projects, []);
  assert.equal(second.hasUnsaved(empty.projects), false);
  assert.equal((await second.save([record("fresh")], "fresh")).ok, true);
  assert.deepEqual(read().projects.map(project => project.id), ["fresh"]);
});

test("open interactions defer automatic updates until safe, retaining typed edits on a conflict", async () => {
  const { first, second, read } = sessions();
  await first.save([record("alpha", "Saved in tab A")], "alpha");
  assert.equal(second.synchronize(second.initial.projects, { defer: true }).status, "deferred");
  assert.equal(second.state().error, "");
  assert.equal(second.initial.projects[0].graph.project.name, "alpha");
  const received = second.synchronize(second.initial.projects);
  assert.equal(received.status, "updated");
  const local = received.library.projects;
  local[0].graph.nodes[0].label = "Tab B unsaved edit";
  // The existing first writer still owns its baseline and can save another edit.
  await first.save([record("alpha", "Second edit in A")], "alpha");
  assert.equal(second.synchronize(local).status, "conflict");
  assert.equal((await second.save(local, "alpha")).code, "local-conflict");
  assert.equal(local[0].graph.nodes[0].label, "Tab B unsaved edit");
  assert.equal(read().projects[0].graph.project.name, "Second edit in A");
});

test("pending local saves do not have their baseline silently replaced by automatic synchronization", async () => {
  const storage = memoryStorage();
  writeLibrary([record("alpha")], "alpha", { storage });
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const session = createLocalLibrary({ normalizeGraph, storage, withLock: async operation => { await gate; return operation(); } });
  const local = [record("alpha", "Local in-flight edit")];
  const pendingSave = session.save(local, "alpha");
  writeLibrary([record("remote")], "remote", { storage });
  assert.equal(session.synchronize(local).status, "deferred");
  release();
  assert.equal((await pendingSave).code, "local-conflict");
  assert.equal(session.synchronize(local).status, "conflict");
  assert.deepEqual(readLibrary(normalizeGraph, { storage }).projects.map(project => project.id), ["remote"]);
  assert.equal(local[0].graph.project.name, "Local in-flight edit");
});

test("unreadable incoming libraries preserve open data and can recover when valid data arrives", async () => {
  const { storage, second } = sessions();
  const local = second.initial.projects;
  storage.setItem(LIBRARY_STORAGE_KEY, "{broken incoming library");
  assert.equal(second.synchronize(local).status, "invalid");
  assert.equal(local[0].id, "alpha");
  assert.match(second.state().error, /could not be read/);
  assert.equal(storage.getItem(LIBRARY_STORAGE_KEY), "{broken incoming library");
  writeLibrary([record("valid")], "valid", { storage });
  const recovered = second.synchronize(local);
  assert.equal(recovered.status, "updated");
  assert.equal(recovered.library.projects[0].id, "valid");
  assert.equal(second.state().error, "");
  const originalGet = storage.getItem;
  storage.getItem = () => { throw new Error("blocked"); };
  assert.equal(second.synchronize(recovered.library.projects).status, "unavailable");
  storage.getItem = originalGet;
});

test("startup recovery cannot be silently abandoned by an external update", () => {
  const storage = memoryStorage();
  storage.setItem(LIBRARY_STORAGE_KEY, "{original damaged library");
  const session = createLocalLibrary({ normalizeGraph, storage, withLock: serialLock() });
  writeLibrary([record("other")], "other", { storage });
  assert.equal(session.synchronize([]).status, "recovery");
  assert.equal(session.initial.rawBackup, "{original damaged library");
});

test("unrelated map changes preserve this tab's active graph and metadata-only updates preserve its identity", () => {
  const alpha = record("alpha"), beta = record("beta");
  const reordered = reconcileLocalLibrary([alpha, beta], "alpha", { activeId: "beta", projects: [record("beta", "Updated Beta"), { ...alpha, updatedAt: 2 }] });
  assert.equal(reordered.activeId, "alpha");
  assert.equal(reordered.activeChanged, false);
  assert.equal(reordered.libraryChanged, true);
  assert.equal(reordered.projects[1].graph, alpha.graph);
  assert.equal(reordered.projects[1].updatedAt, 2);
  assert.equal(reordered.projects[0].graph.project.name, "Updated Beta");
});
