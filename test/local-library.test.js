import test from "node:test";
import assert from "node:assert/strict";
import { normalizeGraph } from "../public/src/schema.js";
import { readLibraryBackup } from "../public/src/library-backup.js";
import {
  LIBRARY_STORAGE_KEY,
  readLibrary,
  writeLibrary,
} from "../public/src/storage.js";
import {
  createLibraryLock,
  createLocalLibrary,
  reconcileLocalLibrary,
} from "../public/src/local-library.js";

const record = (id, name = id) => ({
  id,
  updatedAt: 1,
  graph: normalizeGraph({
    project: { name },
    nodes: [{ id: "n", label: name }],
    edges: [],
  }),
});
function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}
function serialLock() {
  let queue = Promise.resolve();
  return (operation) => {
    const result = queue.then(operation);
    queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  };
}
function sessions() {
  const storage = memoryStorage(),
    withLock = serialLock();
  writeLibrary([record("alpha")], "alpha", { storage });
  const open = (options) =>
    createLocalLibrary({ normalizeGraph, storage, withLock, ...options });
  return {
    storage,
    open,
    first: open(),
    second: open(),
    read: () => readLibrary(normalizeGraph, { storage }),
  };
}

test("a stale tab cannot remove a newer map by selecting an existing map", async () => {
  const { first, second, read } = sessions();
  assert.equal(
    (await first.save([record("beta"), ...first.initial.projects], "beta")).ok,
    true,
  );
  assert.equal(
    (await second.save(second.initial.projects, "alpha")).code,
    "local-conflict",
  );
  assert.deepEqual(
    read().projects.map((p) => p.id),
    ["beta", "alpha"],
  );
  assert.equal(second.checkForChanges(), true);
  assert.match(second.state().error, /another tab/);
});

test("stale edits remain available in memory and cannot replace another tab's newer edits", async () => {
  const { first, second, read } = sessions();
  const local = second.initial.projects;
  local[0].graph.nodes[0].label = "Unsaved second-tab edit";
  assert.equal(
    (await first.save([record("alpha", "First tab saved")], "alpha")).ok,
    true,
  );
  assert.equal((await second.save(local, "alpha")).ok, false);
  assert.equal((await second.save(local, "alpha")).ok, false);
  assert.equal(read().projects[0].graph.nodes[0].label, "First tab saved");
  assert.equal(local[0].graph.nodes[0].label, "Unsaved second-tab edit");
  assert.equal(second.hasUnsaved(local), true);
});

test("a stale tab cannot resurrect another tab's deleted map or clear its new maps", async () => {
  const { first, second, read, open } = sessions();
  assert.equal((await first.save([], "")).ok, true);
  assert.equal((await second.save(second.initial.projects, "alpha")).ok, false);
  assert.deepEqual(read().projects, []);
  const current = open();
  assert.equal((await current.save([record("new")], "new")).ok, true);
  assert.equal((await second.clear()).code, "local-conflict");
  assert.deepEqual(
    read().projects.map((p) => p.id),
    ["new"],
  );
});

test("two concurrent writers serialize the check and commit so exactly one stale snapshot wins", async () => {
  const { first, second, read } = sessions();
  const results = await Promise.all([
    first.save([record("one"), ...first.initial.projects], "one"),
    second.save([record("two"), ...second.initial.projects], "two"),
  ]);
  assert.deepEqual(
    results.map((r) => r.ok),
    [true, false],
  );
  assert.equal(results[1].code, "local-conflict");
  assert.deepEqual(
    read().projects.map((p) => p.id),
    ["one", "alpha"],
  );
});

test("queued saves capture their own graph before yielding and finish in intent order", async () => {
  const storage = memoryStorage();
  let release;
  const delayed = new Promise((resolve) => {
    release = resolve;
  });
  const session = createLocalLibrary({
    normalizeGraph,
    storage,
    withLock: async (operation) => {
      await delayed;
      return operation();
    },
  });
  const projects = [record("map", "First")];
  const first = session.save(projects, "map");
  projects[0].graph.project.name = "Second";
  const second = session.save(projects, "map");
  projects[0].graph.project.name = "Not submitted";
  release();
  assert.equal((await first).ok, true);
  assert.equal((await second).ok, true);
  assert.equal(
    readLibrary(normalizeGraph, { storage }).projects[0].graph.project.name,
    "Second",
  );
  assert.equal(session.state().pending, 0);
  assert.equal(session.hasUnsaved(projects), true);
});

test("storage failures do not advance the baseline and a later safe retry can succeed", async () => {
  const { storage, open, read } = sessions();
  const nativeSet = storage.setItem;
  let fail = true;
  storage.setItem = (...args) => {
    if (fail)
      throw Object.assign(new Error("full"), { name: "QuotaExceededError" });
    return nativeSet(...args);
  };
  const session = open();
  const projects = [record("retry")];
  assert.equal((await session.save(projects, "retry")).ok, false);
  assert.match(session.state().error, /storage is full/i);
  assert.deepEqual(
    read().projects.map((p) => p.id),
    ["alpha"],
  );
  fail = false;
  assert.equal((await session.save(projects, "retry")).ok, true);
  assert.equal(session.state().error, "");
  assert.equal(session.hasUnsaved(projects), false);
});

test("clearing is serialized, blocks later saves, and changes no unrelated browser keys", async () => {
  const { storage, first, read } = sessions();
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
  const storage = memoryStorage(),
    raw = "{broken owner bytes";
  storage.setItem(LIBRARY_STORAGE_KEY, raw);
  const session = createLocalLibrary({
    normalizeGraph,
    storage,
    withLock: serialLock(),
  });
  assert.equal(session.initial.rawBackup, raw);
  assert.equal(
    (await session.save([record("replacement")], "replacement")).code,
    "recovery",
  );
  assert.equal(storage.getItem(LIBRARY_STORAGE_KEY), raw);
  assert.equal((await session.clear()).ok, true);
  assert.equal((await session.save([record("new")], "new")).ok, true);
});

test("an external browser clear cannot be undone by a stale tab save", async () => {
  const { storage, second, read } = sessions();
  storage.removeItem(LIBRARY_STORAGE_KEY);
  assert.equal(second.checkForChanges(), true);
  assert.equal(
    (await second.save(second.initial.projects, "alpha")).code,
    "local-conflict",
  );
  assert.deepEqual(read().projects, []);
});

test("Web Locks encloses the operation and lack of safe coordination fails without writing", async () => {
  const calls = [];
  const lock = createLibraryLock({
    locks: {
      request: async (name, options, operation) => {
        calls.push([name, options.mode]);
        return operation();
      },
    },
  });
  assert.equal(await lock(() => 42), 42);
  assert.deepEqual(calls, [["atlas-local-library-v1", "exclusive"]]);
  const storage = memoryStorage();
  const session = createLocalLibrary({
    normalizeGraph,
    storage,
    withLock: createLibraryLock({ locks: null, database: null }),
  });
  assert.equal((await session.save([record("map")], "map")).ok, false);
  assert.equal(storage.getItem(LIBRARY_STORAGE_KEY), null);
  assert.match(session.state().error, /Safe local saving is unavailable/);
});

test("clean tabs receive new maps and can continue saving without losing the newer library", async () => {
  const { first, second, read } = sessions();
  await first.save([record("beta"), ...first.initial.projects], "beta");
  const received = second.synchronize(second.initial.projects);
  assert.equal(received.status, "updated");
  const view = reconcileLocalLibrary(
    second.initial.projects,
    "alpha",
    received.library,
  );
  assert.equal(view.activeId, "alpha");
  assert.deepEqual(
    view.projects.map((project) => project.id),
    ["beta", "alpha"],
  );
  assert.equal(second.state().error, "");
  assert.equal(second.hasUnsaved(view.projects), false);
  view.projects[1].graph.nodes[0].label = "Edited after automatic update";
  assert.equal((await second.save(view.projects, view.activeId)).ok, true);
  assert.deepEqual(
    read().projects.map((project) => project.id),
    ["beta", "alpha"],
  );
  assert.equal(
    read().projects[1].graph.nodes[0].label,
    "Edited after automatic update",
  );
});

test("clean navigation needs no graph write or cross-tab graph update", async () => {
  const { storage, first, second } = sessions();
  const before = storage.getItem(LIBRARY_STORAGE_KEY);
  let writes = 0;
  const original = storage.setItem;
  storage.setItem = (...args) => {
    writes++;
    return original(...args);
  };
  assert.equal(
    (await first.save(first.initial.projects, "another-tab-navigation-only"))
      .ok,
    true,
  );
  assert.equal(writes, 0);
  assert.equal(storage.getItem(LIBRARY_STORAGE_KEY), before);
  assert.equal(second.synchronize(second.initial.projects).status, "unchanged");
  assert.equal(second.initial.activeId, "alpha");
});

test("saved graph edits, metadata and node removals arrive together with a fresh history graph", async () => {
  const { first, second } = sessions();
  const edited = record("alpha", "Updated project");
  edited.graph.nodes = [
    {
      id: "new-node",
      label: "Replacement",
      type: "Service",
      description: "",
      source: "",
      group: "",
    },
  ];
  await first.save([edited], "alpha");
  const received = second.synchronize(second.initial.projects);
  const view = reconcileLocalLibrary(
    second.initial.projects,
    "alpha",
    received.library,
  );
  assert.equal(view.activeId, "alpha");
  assert.equal(view.activeChanged, true);
  assert.notEqual(view.projects[0].graph, second.initial.projects[0].graph);
  assert.equal(view.projects[0].graph.project.name, "Updated project");
  assert.deepEqual(
    view.projects[0].graph.nodes.map((node) => node.id),
    ["new-node"],
  );
});

test("remote deletion and clearing update clean tabs without resurrecting deleted maps", async () => {
  const { storage, first, second, read } = sessions();
  await first.save([record("beta")], "beta");
  const replacement = second.synchronize(second.initial.projects);
  const view = reconcileLocalLibrary(
    second.initial.projects,
    "alpha",
    replacement.library,
  );
  assert.equal(view.activeId, "beta");
  assert.equal(view.activeChanged, true);
  storage.removeItem(LIBRARY_STORAGE_KEY);
  const cleared = second.synchronize(view.projects);
  const empty = reconcileLocalLibrary(
    view.projects,
    view.activeId,
    cleared.library,
  );
  assert.equal(cleared.status, "updated");
  assert.equal(empty.activeId, "");
  assert.deepEqual(empty.projects, []);
  assert.equal(second.hasUnsaved(empty.projects), false);
  assert.equal((await second.save([record("fresh")], "fresh")).ok, true);
  assert.deepEqual(
    read().projects.map((project) => project.id),
    ["fresh"],
  );
});

test("open interactions defer automatic updates until safe, retaining typed edits on a conflict", async () => {
  const { first, second, read } = sessions();
  await first.save([record("alpha", "Saved in tab A")], "alpha");
  assert.equal(
    second.synchronize(second.initial.projects, { defer: true }).status,
    "deferred",
  );
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
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const session = createLocalLibrary({
    normalizeGraph,
    storage,
    withLock: async (operation) => {
      await gate;
      return operation();
    },
  });
  const local = [record("alpha", "Local in-flight edit")];
  const pendingSave = session.save(local, "alpha");
  writeLibrary([record("remote")], "remote", { storage });
  assert.equal(session.synchronize(local).status, "deferred");
  release();
  assert.equal((await pendingSave).code, "local-conflict");
  assert.equal(session.synchronize(local).status, "conflict");
  assert.deepEqual(
    readLibrary(normalizeGraph, { storage }).projects.map(
      (project) => project.id,
    ),
    ["remote"],
  );
  assert.equal(local[0].graph.project.name, "Local in-flight edit");
});

test("unreadable incoming libraries preserve open data and can recover when valid data arrives", async () => {
  const { storage, second } = sessions();
  const local = second.initial.projects;
  storage.setItem(LIBRARY_STORAGE_KEY, "{broken incoming library");
  assert.equal(second.synchronize(local).status, "invalid");
  assert.equal(local[0].id, "alpha");
  assert.match(second.state().error, /could not be read/);
  assert.equal(
    storage.getItem(LIBRARY_STORAGE_KEY),
    "{broken incoming library",
  );
  writeLibrary([record("valid")], "valid", { storage });
  const recovered = second.synchronize(local);
  assert.equal(recovered.status, "updated");
  assert.equal(recovered.library.projects[0].id, "valid");
  assert.equal(second.state().error, "");
  const originalGet = storage.getItem;
  storage.getItem = () => {
    throw new Error("blocked");
  };
  assert.equal(
    second.synchronize(recovered.library.projects).status,
    "unavailable",
  );
  storage.getItem = originalGet;
});

test("startup recovery cannot be silently abandoned by an external update", () => {
  const storage = memoryStorage();
  storage.setItem(LIBRARY_STORAGE_KEY, "{original damaged library");
  const session = createLocalLibrary({
    normalizeGraph,
    storage,
    withLock: serialLock(),
  });
  writeLibrary([record("other")], "other", { storage });
  assert.equal(session.synchronize([]).status, "recovery");
  assert.equal(session.initial.rawBackup, "{original damaged library");
});

test("unrelated map changes preserve this tab's active graph and metadata-only updates preserve its identity", () => {
  const alpha = record("alpha"),
    beta = record("beta");
  const reordered = reconcileLocalLibrary([alpha, beta], "alpha", {
    activeId: "beta",
    projects: [record("beta", "Updated Beta"), { ...alpha, updatedAt: 2 }],
  });
  assert.equal(reordered.activeId, "alpha");
  assert.equal(reordered.activeChanged, false);
  assert.equal(reordered.libraryChanged, true);
  assert.equal(reordered.projects[1].graph, alpha.graph);
  assert.equal(reordered.projects[1].updatedAt, 2);
  assert.equal(reordered.projects[0].graph.project.name, "Updated Beta");
});

test("explicit recovery replaces only the captured unreadable library and remains guarded", async () => {
  const storage = memoryStorage();
  storage.setItem(LIBRARY_STORAGE_KEY, "original unreadable bytes");
  const library = createLocalLibrary({
    normalizeGraph,
    storage,
    withLock: (operation) => operation(),
  });
  assert.equal(
    (await library.save([record("restore")], "restore")).code,
    "recovery",
  );
  assert.equal(
    storage.getItem(LIBRARY_STORAGE_KEY),
    "original unreadable bytes",
  );
  assert.equal(
    (await library.save([record("restore")], "restore", { recover: true })).ok,
    true,
  );
  assert.equal(
    readLibrary(normalizeGraph, { storage }).projects[0].id,
    "restore",
  );
  storage.setItem(LIBRARY_STORAGE_KEY, "a newer unreadable value");
  assert.equal(
    (await library.save([record("other")], "other", { recover: true })).code,
    "local-conflict",
  );
  assert.equal(
    storage.getItem(LIBRARY_STORAGE_KEY),
    "a newer unreadable value",
  );
});
test("recovery captures only changed maps and leaves authoritative records untouched", () => {
  const { second } = sessions();
  const maps = structuredClone(second.initial.projects);
  maps.push(record("new"));
  assert.deepEqual(
    second.unsavedProjects(maps).map((item) => item.id),
    ["new"],
  );
  maps[0].graph.nodes[0].label = "Unsaved";
  assert.deepEqual(
    second.unsavedProjects(maps).map((item) => item.id),
    ["alpha", "new"],
  );
});
test("restoring copies merges against the latest committed library while retaining another tab changes", async () => {
  const { first, second, read } = sessions();
  await first.save(
    [record("alpha", "Newer authoritative version"), record("beta")],
    "alpha",
  );
  const restored = await second.mergeBackup(
    readLibraryBackup({
      version: 1,
      activeId: "recovery",
      projects: [record("recovery", "Recovered draft")],
    }),
  );
  assert.equal(restored.ok, true);
  assert.equal(restored.projects.length, 3);
  assert.equal(
    read().projects.find((project) => project.id === "alpha").graph.project
      .name,
    "Newer authoritative version",
  );
  assert.ok(read().projects.some((project) => project.id === "beta"));
  assert.notEqual(restored.activeId, "recovery");
});
test("restoring is a serialized append barrier and malformed latest data remains untouched", async () => {
  const storage = memoryStorage();
  let release;
  const waiting = new Promise((resolve) => (release = resolve));
  const library = createLocalLibrary({
    normalizeGraph,
    storage,
    withLock: async (operation) => {
      await waiting;
      return operation();
    },
  });
  const restore = library.mergeBackup({ version: 1, projects: [record("a")] });
  assert.equal((await library.save([record("old")], "old")).code, "restoring");
  assert.equal((await library.clear()).code, "restoring");
  release();
  assert.equal((await restore).ok, true);
  storage.setItem(LIBRARY_STORAGE_KEY, "new unreadable bytes");
  assert.equal(
    (await library.mergeBackup({ version: 1, projects: [record("b")] })).ok,
    false,
  );
  assert.equal(storage.getItem(LIBRARY_STORAGE_KEY), "new unreadable bytes");
});

test("burst saves waiting for the same lock persist only the latest immutable snapshot", async () => {
  const storage = memoryStorage();
  let release;
  const waiting = new Promise((resolve) => (release = resolve));
  let writes = 0;
  const original = storage.setItem;
  storage.setItem = (...args) => {
    writes++;
    return original(...args);
  };
  const library = createLocalLibrary({
    normalizeGraph,
    storage,
    withLock: async (operation) => {
      await waiting;
      return operation();
    },
  });
  const maps = [record("a", "First")];
  const first = library.save(maps, "a");
  maps[0].graph.project.name = "Second";
  const second = library.save(maps, "a");
  maps[0].graph.project.name = "Not submitted";
  release();
  assert.equal((await first).ok, true);
  assert.equal((await second).ok, true);
  assert.equal(writes, 1);
  assert.equal(
    readLibrary(normalizeGraph, { storage }).projects[0].graph.project.name,
    "Second",
  );
  assert.equal(library.hasUnsaved(maps), true);
});
