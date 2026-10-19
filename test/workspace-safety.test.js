import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEditableGraph } from "../public/src/schema.js";
import {
  makeLibraryBackup,
  readLibraryBackup,
  restoreLibraryCopies,
  MAX_BACKUP_BYTES,
} from "../public/src/library-backup.js";
import {
  createWorkspaceSafety,
  checkpointScope,
} from "../public/src/workspace-safety.js";
const graph = (name = "Example") =>
  normalizeEditableGraph({
    project: { name },
    nodes: [{ id: "n", label: name, type: "Service" }],
    edges: [],
  });
const project = (id = "a") => ({ id, graph: graph(id), updatedAt: 10 });
function adapter() {
  const records = new Map();
  let queue = Promise.resolve();
  return {
    records,
    async list(scope) {
      return structuredClone(
        [...records.values()].filter((item) => item.scope === scope),
      );
    },
    mutate(scope, change) {
      const run = queue.then(() => {
        const result = change(
          structuredClone(
            [...records.values()].filter((item) => item.scope === scope),
          ),
        );
        for (const key of result.remove || []) records.delete(key);
        for (const item of result.put || [])
          records.set(item.key, structuredClone(item));
        return result.result;
      });
      queue = run.catch(() => {});
      return run;
    },
  };
}
function memory() {
  const records = new Map();
  return {
    getItem: (key) => records.get(key) || null,
    setItem: (key, value) => records.set(key, value),
    removeItem: (key) => records.delete(key),
  };
}
function safety(options = {}) {
  let id = 0,
    tick = 1;
  return createWorkspaceSafety({
    adapter: adapter(),
    newId: () => String(++id),
    now: () => ++tick,
    ...options,
  });
}

test("whole-library backup round trips empty and populated maps with their active selection", () => {
  const projects = [
    project("a"),
    {
      ...project("b"),
      graph: normalizeEditableGraph({
        project: { name: "Empty" },
        nodes: [],
        edges: [],
      }),
    },
  ];
  const restored = readLibraryBackup(makeLibraryBackup(projects, "b"));
  assert.deepEqual(restored.projects, projects);
  assert.equal(restored.activeId, "b");
  assert.equal(readLibraryBackup(makeLibraryBackup([], "")).projects.length, 0);
  assert.equal(readLibraryBackup(JSON.stringify(graph())).kind, "map");
});
test("validated backup previews remain valid restore inputs across the UI/coordinator boundary", () => {
  const input = {
    version: 1,
    activeId: "a",
    projects: [{ id: "a", graph: graph(), updatedAt: 1 }],
  };
  const preview = readLibraryBackup(input);
  assert.deepEqual(readLibraryBackup(preview), preview);
  const mapPreview = readLibraryBackup(graph());
  assert.deepEqual(readLibraryBackup(mapPreview).projects, mapPreview.projects);
});
test("restore plans separate validated copies without account associations or changing originals", () => {
  const current = [project("a")],
    before = JSON.stringify(current);
  const backup = readLibraryBackup({
    version: 1,
    activeId: "a",
    projects: [
      {
        ...project("a"),
        onlineWorkspaceId: "private",
        ownerUid: "owner",
        shareSourceHash: "#map=private",
      },
    ],
  });
  const result = restoreLibraryCopies(current, backup, {
    newId: () => "fresh",
    now: 50,
  });
  assert.equal(result.activeId, "fresh");
  assert.equal(result.projects.length, 2);
  assert.equal(result.copies[0].graph.project.name, "a (restored)");
  assert.deepEqual(Object.keys(result.copies[0]).sort(), [
    "graph",
    "id",
    "updatedAt",
  ]);
  assert.equal(JSON.stringify(current), before);
  result.copies[0].graph.nodes[0].label = "Edited copy";
  assert.equal(current[0].graph.nodes[0].label, "a");
});
test("invalid, duplicate, oversized and unsupported backups reject before producing a restore plan", () => {
  for (const value of [
    { version: 2, projects: [] },
    { version: 1, projects: [project("a"), project("a")] },
    { version: 1, projects: [{ id: "a", graph: { nodes: "wrong" } }] },
    { version: 1, projects: [{ ...project("a"), id: "bad\u0000id" }] },
  ])
    assert.throws(() => readLibraryBackup(value));
  assert.throws(
    () => readLibraryBackup("x".repeat(MAX_BACKUP_BYTES + 1)),
    /16 MiB/,
  );
  assert.throws(() => readLibraryBackup("{"), /valid JSON/);
  assert.throws(
    () =>
      restoreLibraryCopies(
        [project("a")],
        { projects: [project("a")], activeId: "a" },
        { newId: () => "a" },
      ),
    /unique map ID/,
  );
});
test("backup labels remain text data and no hidden credentials or unknown metadata are copied", () => {
  const input = project("a");
  input.graph.project.name = "<img src=x onerror=alert(1)>";
  input.secret = "never retain";
  const restored = readLibraryBackup({ version: 1, projects: [input] });
  assert.equal(
    restored.projects[0].graph.project.name,
    input.graph.project.name,
  );
  assert.equal(restored.projects[0].secret, undefined);
});
test("recovery drafts survive a fresh store instance and are scoped to one tab", async () => {
  const shared = adapter();
  const first = safety({ adapter: shared });
  const saved = await first.saveDraft("tab-a", {
    version: 1,
    projects: [project("a")],
    activeId: "a",
  });
  assert.equal(saved.ok, true);
  const reloaded = safety({ adapter: shared });
  assert.equal((await reloaded.readDraft("tab-a")).backup.projects[0].id, "a");
  assert.equal(await reloaded.readDraft("tab-b"), null);
  assert.equal(shared.records.size, 1);
});
test("late draft acknowledgements cannot remove a newer recovery snapshot", async () => {
  const store = safety();
  const first = await store.saveDraft("tab", {
    version: 1,
    projects: [project("old")],
  });
  const second = await store.saveDraft("tab", {
    version: 1,
    projects: [project("new")],
  });
  await store.clearDraft("tab", first.text);
  assert.equal((await store.readDraft("tab")).text, second.text);
  await store.clearDraft("tab", second.text);
  assert.equal(await store.readDraft("tab"), null);
});
test("cloned tab session IDs retain independent document recoveries without overwriting either version", async () => {
  const shared = adapter();
  const first = safety({
    adapter: shared,
    newId: () => "document-one",
    now: () => 1,
  });
  const second = safety({
    adapter: shared,
    newId: () => "document-two",
    now: () => 2,
  });
  const older = await first.saveDraft("cloned-session", {
    version: 1,
    projects: [project("one")],
  });
  const newer = await second.saveDraft("cloned-session", {
    version: 1,
    projects: [project("two")],
  });
  assert.equal(shared.records.size, 2);
  assert.equal((await second.readDraft("cloned-session")).text, newer.text);
  await second.clearDraft("cloned-session", newer.text);
  assert.equal((await first.readDraft("cloned-session")).text, older.text);
});
test("blocked recovery database falls back to refresh-safe tab storage and reports full storage honestly", async () => {
  const unavailable = {
    list: async () => {
      throw Error("blocked");
    },
    mutate: async () => {
      throw Error("blocked");
    },
  };
  const fallback = memory(),
    store = safety({ adapter: unavailable, fallback });
  assert.equal(
    (await store.saveDraft("tab", { version: 1, projects: [project("a")] }))
      .mode,
    "tab",
  );
  assert.equal(
    (await safety({ adapter: unavailable, fallback }).readDraft("tab")).backup
      .projects[0].id,
    "a",
  );
  const blocked = safety({
    adapter: unavailable,
    fallback: {
      setItem() {
        throw Error("full");
      },
    },
  });
  assert.equal(
    (await blocked.saveDraft("tab", { version: 1, projects: [project("a")] }))
      .ok,
    false,
  );
});
test("checkpoint scopes isolate local maps, cloud owners and read-only viewers", async () => {
  const store = safety(),
    first = checkpointScope({ ownerUid: "one", workspaceId: "map" }),
    second = checkpointScope({ ownerUid: "two", workspaceId: "map" });
  assert.notEqual(first, second);
  assert.equal(
    checkpointScope({ ownerUid: "one", workspaceId: "map", canEdit: false }),
    "",
  );
  await store.saveCheckpoint(first, "Before refactor", graph());
  assert.equal((await store.listCheckpoints(first)).length, 1);
  assert.deepEqual(await store.listCheckpoints(second), []);
  await assert.rejects(
    store.saveCheckpoint("", "Viewer", graph()),
    /editable map/,
  );
});
test("named checkpoints are immutable copies, renameable and explicitly removable", async () => {
  const store = safety(),
    scope = "local:a",
    input = graph();
  const saved = await store.saveCheckpoint(scope, "First version", input);
  input.nodes[0].label = "Changed";
  assert.equal(
    (await store.listCheckpoints(scope))[0].graph.nodes[0].label,
    "Example",
  );
  await store.renameCheckpoint(scope, saved.key, "Kept version");
  assert.equal((await store.listCheckpoints(scope))[0].name, "Kept version");
  await store.removeCheckpoint("local:b", saved.key);
  assert.equal((await store.listCheckpoints(scope)).length, 1);
  await store.removeCheckpoint(scope, saved.key);
  assert.equal((await store.listCheckpoints(scope)).length, 0);
});
test("checkpoint budgets reject new records without silently deleting a named checkpoint", async () => {
  const store = safety({ maxCheckpoints: 1 });
  await store.saveCheckpoint("local:a", "Keep me", graph());
  await assert.rejects(
    store.saveCheckpoint("local:a", "Too many", graph()),
    /full/,
  );
  assert.equal((await store.listCheckpoints("local:a"))[0].name, "Keep me");
  const tiny = safety({ maxCheckpointBytes: 1 });
  await assert.rejects(
    tiny.saveCheckpoint("local:a", "Large", graph()),
    /too large/,
  );
});
test("confirmed map deletion removes only that scope checkpoints, retaining other maps, owners and recovery drafts", async () => {
  const store = safety();
  await store.saveCheckpoint("local:a", "A", graph("A"));
  await store.saveCheckpoint("local:b", "B", graph("B"));
  await store.saveCheckpoint("cloud:owner-map", "Owner", graph("Cloud"));
  await store.saveDraft("tab", { version: 1, projects: [project("a")] });
  await store.removeCheckpointScope("local:a");
  assert.equal((await store.listCheckpoints("local:a")).length, 0);
  assert.equal((await store.listCheckpoints("local:b")).length, 1);
  assert.equal((await store.listCheckpoints("cloud:owner-map")).length, 1);
  assert.ok(await store.readDraft("tab"));
});
