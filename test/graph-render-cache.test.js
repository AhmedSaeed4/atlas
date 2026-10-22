import test from "node:test";
import assert from "node:assert/strict";
import {
  createGraphGeometryCache,
  createFrameBatch,
} from "../public/src/graph-render-cache.js";
import { layoutGraph } from "../public/src/layout.js";
import { edgeGeometry } from "../public/src/geometry.js";
const graph = () => ({
  nodes: [
    { id: "a", label: "A", type: "Service" },
    { id: "b", label: "B", type: "Service" },
    { id: "c", label: "C", type: "Service" },
  ],
  edges: [
    { id: "ab", source: "a", target: "b", label: "calls" },
    { id: "bc", source: "b", target: "c" },
    { id: "self", source: "a", target: "a" },
  ],
});
test("layout and routes are reused through search, selection and text-only graph metadata changes", () => {
  const model = graph();
  let layouts = 0,
    routes = 0;
  const cache = createGraphGeometryCache({
    layout: (graph) => {
      layouts++;
      return layoutGraph(graph);
    },
    route: (...args) => {
      routes++;
      return edgeGeometry(...args);
    },
  });
  const initial = cache.get(model),
    route = cache.edge(model, 0);
  model.nodes[0].description = "Only details changed";
  model.nodes[0].label = "A renamed";
  assert.equal(cache.get(model), initial);
  assert.equal(cache.edge(model, 0), route);
  assert.equal(layouts, 1);
  assert.equal(routes, 1);
});
test("moving a node changes only its position and incident forward/self routes", () => {
  const model = graph(),
    cache = createGraphGeometryCache(),
    entry = cache.get(model);
  const first = cache.edge(model, 0),
    other = cache.edge(model, 1),
    loop = cache.edge(model, 2),
    stationary = { ...entry.layout.positions.get("b") };
  model.nodes[0].position = { x: 95, y: 130 };
  const update = cache.move(model, "a", model.nodes[0].position);
  assert.deepEqual([...update.affected], [0, 2]);
  assert.equal(cache.get(model), entry);
  assert.equal(cache.edge(model, 1), other);
  assert.notEqual(cache.edge(model, 0).path, first.path);
  assert.notEqual(cache.edge(model, 2).path, loop.path);
  assert.deepEqual(entry.layout.positions.get("b"), stationary);
  assert.equal(cache.move(model, "a", { x: NaN, y: 0 }), null);
});
test("topology, chart dimensions and external position changes invalidate cached geometry", () => {
  const model = graph(),
    cache = createGraphGeometryCache();
  let entry = cache.get(model);
  model.edges.push({ id: "reverse", source: "c", target: "a" });
  assert.notEqual(cache.get(model), entry);
  entry = cache.get(model);
  model.nodes[0].chart = { categories: ["one", "two"], values: [1, 2] };
  assert.notEqual(cache.get(model), entry);
  entry = cache.get(model);
  model.nodes[0].position = { x: 30, y: 80 };
  assert.notEqual(cache.get(model), entry);
  assert.ok(cache.bounds(model).width > 0);
});

test('bulk movement updates all members in one cache entry and rejects partial invalid updates', () => {
  const model = graph(), cache = createGraphGeometryCache(), entry = cache.get(model);
  const other = { ...entry.layout.positions.get('c') };
  const positions = new Map(['a', 'b'].map(id => {
    const point = entry.layout.positions.get(id); return [id, { x: point.x + 80, y: point.y - 35 }];
  }));
  for (const node of model.nodes) if (positions.has(node.id)) node.position = positions.get(node.id);
  const update = cache.moveMany(model, positions);
  assert.equal(update.entry, entry);
  assert.equal(cache.get(model), entry);
  assert.deepEqual(update.affected, new Set([0, 1, 2]));
  for (const [id, point] of positions) assert.deepEqual(entry.layout.positions.get(id), point);
  assert.deepEqual(entry.layout.positions.get('c'), other);
  const before = [...entry.layout.positions];
  assert.equal(cache.moveMany(model, new Map([['a', { x: 20, y: 30 }], ['b', { x: NaN, y: 0 }]])), null);
  assert.deepEqual([...entry.layout.positions], before);
  assert.equal(cache.moveMany(model, new Map()), null);
});
test("animation-frame batching paints the latest input once and flushes before completion", () => {
  const callbacks = new Map(),
    painted = [];
  let next = 0;
  const batch = createFrameBatch((value) => painted.push(value), {
    request: (fn) => {
      callbacks.set(++next, fn);
      return next;
    },
    cancel: (id) => callbacks.delete(id),
  });
  batch.schedule(1);
  batch.schedule(2);
  assert.equal(callbacks.size, 1);
  callbacks.get(1)();
  callbacks.delete(1);
  assert.deepEqual(painted, [2]);
  batch.schedule(3);
  batch.flush();
  assert.deepEqual(painted, [2, 3]);
  assert.equal(callbacks.size, 0);
  batch.schedule(4);
  batch.cancel();
  assert.equal(callbacks.size, 0);
  batch.flush();
  assert.deepEqual(painted, [2, 3]);
});
