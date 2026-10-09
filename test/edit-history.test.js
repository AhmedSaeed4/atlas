import test from "node:test";
import assert from "node:assert/strict";
import { createEditHistory, editHistoryShortcut } from "../public/src/edit-history.js";
const graph = (x = 0, label = "API") => ({ schemaVersion: 1, project: { name: "Test" }, nodes: [{ id: "api", label, type: "API", position: { x, y: 0 } }], edges: [] });

test("one completed move is one step, and returned snapshots cannot mutate history", () => {
  const history = createEditHistory(); const before = graph(); const after = graph(120);
  history.ensure("local:a", before); history.record("local:a", after);
  assert.equal(history.state("local:a").undoCount, 1);
  const undone = history.undo("local:a", after); assert.deepEqual(undone, before);
  history.record("local:a", undone); assert.equal(history.state("local:a").canRedo, true, "persisting an undo does not create a new edit");
  const redone = history.redo("local:a", undone); assert.deepEqual(redone, after);
  redone.nodes[0].label = "Mutated outside";
  assert.equal(history.undo("local:a", after).nodes[0].label, "API");
});

test("full graph edits restore nodes, connections, details, and removals together", () => {
  const history = createEditHistory(); const before = graph();
  const added = { ...graph(), project: { name: "Renamed" }, nodes: [...graph().nodes, { id: "db", type: "Database", label: "DB" }], edges: [{ id: "edge", source: "api", target: "db" }] };
  const removed = { ...added, nodes: [added.nodes[1]], edges: [] };
  history.ensure("local:a", before); history.record("local:a", added); history.record("local:a", removed);
  const first = history.undo("local:a", removed); assert.deepEqual(first, added);
  const second = history.undo("local:a", first); assert.deepEqual(second, before);
  const redo = history.redo("local:a", second); assert.deepEqual(redo, added);
  assert.deepEqual(history.redo("local:a", redo), removed);
});

test("a new edit after undo drops redo, while no-op saves preserve it", () => {
  const history = createEditHistory(); history.ensure("a", graph()); history.record("a", graph(1));
  const undone = history.undo("a", graph(1)); history.record("a", undone);
  assert.equal(history.state("a").canRedo, true);
  history.record("a", graph(0, "Changed label")); assert.equal(history.state("a").canRedo, false);
  assert.deepEqual(history.undo("a", graph(0, "Changed label")), graph());
});

test("local maps and different cloud owners have separate history across navigation", () => {
  const history = createEditHistory();
  for (const key of ["local:a", "local:b", "cloud:owner-a/map", "cloud:owner-b/map"]) history.ensure(key, graph());
  history.record("local:a", graph(1)); history.record("cloud:owner-a/map", graph(2));
  history.ensure("local:b", graph()); history.sync("local:a", graph(1));
  assert.deepEqual(history.undo("local:a", graph(1)), graph());
  assert.equal(history.state("local:b").canUndo, false); assert.equal(history.state("cloud:owner-b/map").canUndo, false);
  history.clear("cloud:"); assert.equal(history.state("cloud:owner-a/map").canUndo, false);
  assert.equal(history.state("local:a").canRedo, true);
});

test("matching save confirmations retain history and externally replaced graphs reset it", () => {
  const history = createEditHistory(); history.sync("cloud:a", graph()); history.record("cloud:a", graph(1));
  history.sync("cloud:a", graph(1)); assert.equal(history.state("cloud:a").canUndo, true);
  history.sync("cloud:a", graph(5, "Another session"));
  assert.equal(history.state("cloud:a").canUndo, false); assert.equal(history.state("cloud:a").canRedo, false);
  assert.equal(history.undo("cloud:a", graph(5, "Another session")), null);
  history.record("cloud:a", graph(6, "Another session"));
  assert.deepEqual(history.undo("cloud:a", graph(6, "Another session")), graph(5, "Another session"));
});

test("an unexpected unsynchronized graph is never overwritten by undo or redo", () => {
  const history = createEditHistory(); history.ensure("a", graph()); history.record("a", graph(1));
  assert.equal(history.undo("a", graph(9)), null); assert.equal(history.state("a").canUndo, false);
  history.record("a", graph(10)); assert.deepEqual(history.undo("a", graph(10)), graph(9));
});

test("step, memory and workspace limits retain the current graph without unbounded history", () => {
  const history = createEditHistory({ maxSteps: 2, maxWorkspaces: 2 }); history.ensure("a", graph());
  for (let i = 1; i <= 4; i++) history.record("a", graph(i));
  assert.equal(history.state("a").undoCount, 2);
  const first = history.undo("a", graph(4)); const second = history.undo("a", first);
  assert.equal(second.nodes[0].position.x, 2); assert.equal(history.undo("a", second), null);
  history.ensure("b", graph()); history.ensure("c", graph()); assert.equal(history.state("a").canRedo, false);
  const small = createEditHistory({ maxBytes: JSON.stringify(graph()).length * 2 + 2 });
  small.ensure("a", graph()); small.record("a", graph(1)); assert.equal(small.state("a").canUndo, false);
  assert.equal(small.undo("a", graph(1)), null);
});

test("shortcuts support Ctrl/Command undo and redo while preserving copy and native form undo", () => {
  const event = { key: "z", ctrlKey: true, target: { closest: () => null } };
  assert.equal(editHistoryShortcut(event), "undo");
  assert.equal(editHistoryShortcut({ ...event, shiftKey: true }), "redo");
  assert.equal(editHistoryShortcut({ ...event, key: "y" }), "redo");
  assert.equal(editHistoryShortcut({ ...event, ctrlKey: false, metaKey: true }), "undo");
  for (const change of [{ key: "c" }, { altKey: true }, { isComposing: true }, { defaultPrevented: true }, { ctrlKey: false }, { target: { closest: () => ({}) } }, { target: { isContentEditable: true } }]) assert.equal(editHistoryShortcut({ ...event, ...change }), null);
});
