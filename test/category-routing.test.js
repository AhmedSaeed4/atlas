import test from 'node:test';
import assert from 'node:assert/strict';
import { createCategoryRouting, segmentCrossesRectangle, routeObstacleCurve } from '../public/src/category-routing.js';
import { categoryBounds } from '../public/src/map-categories.js';
import { layoutGraph } from '../public/src/layout.js';
import { edgeGeometry, graphBounds } from '../public/src/geometry.js';
import { createGraphGeometryCache } from '../public/src/graph-render-cache.js';
import { buildSvg } from '../public/src/exports.js';
import { buildGroupConnections } from '../public/src/group-connections.js';

const fixture = () => ({ project: { name: 'Routing check' }, nodes: [
  { id: 'a', label: 'Source', type: 'API', group: 'Interface', framePosition: { x: 0, y: 100 } },
  { id: 'b', label: 'Unrelated worker', type: 'Job', group: 'Other category', framePosition: { x: 450, y: 100 } },
  { id: 'c', label: 'Destination', type: 'Database', group: 'Storage', framePosition: { x: 900, y: 100 } },
], edges: [{ id: 'ac', source: 'a', target: 'c', label: 'writes' }] });

test('a reserved outside corridor gives the next wire a separate lane beyond its port stubs', () => {
  const curve=[{x:0,y:0},{x:150,y:0},{x:350,y:0},{x:500,y:0}];
  const first=routeObstacleCurve(curve,[],false,{force:true});
  const next=routeObstacleCurve(curve,[],false,{force:true,occupied:[[{x:30,y:0},{x:470,y:0}]]});
  assert.notEqual(next.path,first.path);
  assert.ok(next.points.some(point=>Math.abs(point.y)>=16));
  assert.deepEqual(next.points[0],curve[0]); assert.deepEqual(next.points.at(-1),curve.at(-1));
});
function checkClear(points, box) {
  const rect = { left: box.x, right: box.x + box.width, top: box.y, bottom: box.y + box.height };
  for (let i = 1; i < points.length; i++) assert.equal(segmentCrossesRectangle(points[i - 1], points[i], rect), false);
}

test('blocked cross-category connections route around unrelated boundaries with rounded corners and matching image exports', () => {
  const graph = fixture(), layout = layoutGraph(graph, { categoryFrames: true }), routing = createCategoryRouting(graph, layout.positions, layout.dimensions);
  const plain = edgeGeometry(graph.edges[0], 0, layout.positions, layout.dimensions);
  const routed = edgeGeometry(graph.edges[0], 0, layout.positions, layout.dimensions, 0, routing);
  assert.notEqual(routed.path, plain.path);
  assert.match(routed.path, / Q /);
  const unrelated = categoryBounds(graph, layout.positions, layout.dimensions).find(box => box.name === 'Other category');
  checkClear(routed.points, unrelated);
  assert.deepEqual(routed.points[0], plain.points[0]);
  assert.deepEqual(routed.points.at(-1), plain.points.at(-1));
  const bounds = graphBounds(graph, layout.positions, layout.dimensions, undefined, { categoryFrames: true });
  const trunk = buildGroupConnections(graph, layout).wires.find(wire => wire.kind === 'trunk');
  for (const point of trunk.geometry.points) assert.ok(point.x >= bounds.x && point.x <= bounds.x + bounds.width && point.y >= bounds.y && point.y <= bounds.y + bounds.height);
  checkClear(trunk.geometry.points, unrelated);
  assert.ok(buildSvg(graph, "dark", { categoryFrames: true }).includes(trunk.geometry.path));
});

test('clear curves and maps without categories keep the original curve geometry', () => {
  const graph = fixture(); graph.nodes[1].framePosition.y = 600;
  const layout = layoutGraph(graph, { categoryFrames: true }), context = createCategoryRouting(graph, layout.positions, layout.dimensions);
  assert.deepEqual(edgeGeometry(graph.edges[0], 0, layout.positions, layout.dimensions, 0, context), edgeGeometry(graph.edges[0], 0, layout.positions, layout.dimensions));
  for (const node of graph.nodes) delete node.group;
  assert.equal(createCategoryRouting(graph, layout.positions, layout.dimensions), null);
});

test('parallel detours keep separate lanes and backward connections remain finite', () => {
  const graph = fixture(), layout = layoutGraph(graph, { categoryFrames: true }), context = createCategoryRouting(graph, layout.positions, layout.dimensions);
  const first = edgeGeometry(graph.edges[0], 0, layout.positions, layout.dimensions, -12, context);
  const second = edgeGeometry(graph.edges[0], 1, layout.positions, layout.dimensions, 12, context);
  assert.notEqual(first.path, second.path);
  const backwards = edgeGeometry({ source: 'c', target: 'a' }, 2, layout.positions, layout.dimensions, 0, context);
  assert.ok(backwards.points.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
  for (const route of [first, second, backwards]) checkClear(route.points, categoryBounds(graph, layout.positions, layout.dimensions).find(box => box.name === 'Other category'));
});

test('moving an unrelated category invalidates its obstructed route without moving the endpoints', () => {
  const graph = fixture(), cache = createGraphGeometryCache({ categoryFrames: true }), entry = cache.get(graph);
  const first = cache.edge(graph, 0), source = { ...entry.layout.positions.get('a') };
  graph.nodes[1].framePosition = { x: 450, y: 600 };
  const update = cache.move(graph, 'b', graph.nodes[1].framePosition);
  assert.ok(update.affected.has(0));
  assert.notEqual(cache.edge(graph, 0).path, first.path);
  assert.deepEqual(entry.layout.positions.get('a'), source);
});

test('a blocked port caused by overlapping manual categories falls back safely without hanging or modifying data', () => {
  const graph = fixture(); graph.nodes[1].framePosition.x = 200;
  const before = JSON.stringify(graph), cache = createGraphGeometryCache({ categoryFrames: true });
  assert.ok(cache.edge(graph, 0).path);
  assert.equal(JSON.stringify(graph), before);
});
