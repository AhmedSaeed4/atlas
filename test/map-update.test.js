import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEditableGraph } from "../public/src/schema.js";
import {
  compareGraphVersions,
  prepareMapUpdate,
  sameMapContext,
} from "../public/src/map-update.js";
const graph = () =>
  normalizeEditableGraph({
    project: { name: "Fictional" },
    nodes: [
      { id: "a", label: "A", type: "Service", position: { x: 12, y: 20 } },
      { id: "b", label: "B", type: "Database" },
    ],
    edges: [{ id: "ab", source: "a", target: "b", label: "reads" }],
  });
test("comparison reports additions/removals/changes by stable IDs, including relationships and metadata", () => {
  const before = graph(),
    after = graph();
  after.project.name = "Renamed";
  after.nodes[0].description = "Changed";
  after.nodes[1].id = "new-id";
  after.edges = [
    { id: "other", source: "a", target: "new-id", label: "writes" },
  ];
  const diff = compareGraphVersions(before, after);
  assert.equal(diff.projectChanged, true);
  assert.deepEqual(
    diff.nodes.added.map((node) => node.id),
    ["new-id"],
  );
  assert.deepEqual(
    diff.nodes.removed.map((node) => node.id),
    ["b"],
  );
  assert.deepEqual(
    diff.nodes.changed.map((node) => node.id),
    ["a"],
  );
  assert.equal(diff.edges.added.length, 1);
  assert.equal(diff.edges.removed.length, 1);
});
test("updated maps preserve stable manual/computed positions only when explicitly requested", () => {
  const before = graph(),
    after = graph();
  after.nodes[0].position = { x: 999, y: 999 };
  after.nodes[0].description = "New description";
  const { graph: kept } = prepareMapUpdate(before, after, {
    positions: new Map([["b", { x: 400, y: 100 }]]),
  });
  assert.deepEqual(kept.nodes[0].position, { x: 12, y: 20 });
  assert.deepEqual(kept.nodes[1].position, { x: 400, y: 100 });
  assert.equal(kept.nodes[0].description, "New description");
  assert.deepEqual(
    prepareMapUpdate(before, after, { preservePositions: false }).graph.nodes[0]
      .position,
    { x: 999, y: 999 },
  );
  assert.deepEqual(before.nodes[0].position, { x: 12, y: 20 });
});
test("position-only updates are a no-op when keeping existing positions", () => {
  const before = graph(),
    after = graph();
  after.nodes[0].position = { x: 999, y: 999 };
  assert.equal(compareGraphVersions(before, after).hasContentChanges, false);
  assert.deepEqual(prepareMapUpdate(before, after).graph, before);
  assert.equal(
    prepareMapUpdate(before, after, { preservePositions: false }).comparison
      .moved.length,
    1,
  );
});
test("stale previews and account/viewer changes cannot authorize an update to another map", () => {
  const context = {
    key: "cloud:owner:a",
    ownerUid: "owner",
    graph: graph(),
    canEdit: true,
  };
  assert.equal(sameMapContext(context, context), true);
  for (const changed of [
    { key: "cloud:owner:b" },
    { ownerUid: "different" },
    { graph: graph() },
    { canEdit: false },
  ])
    assert.equal(sameMapContext(context, { ...context, ...changed }), false);
  assert.throws(
    () =>
      prepareMapUpdate(context.graph, {
        nodes: [{ id: "a", label: "A" }],
        edges: [{ source: "a", target: "missing" }],
      }),
    /missing|unknown|exist/i,
  );
});
