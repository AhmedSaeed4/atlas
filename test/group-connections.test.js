import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGroupConnections, groupConnectionPlan } from '../public/src/group-connections.js';
import { layoutGraph } from '../public/src/layout.js';
import { graphBounds } from '../public/src/geometry.js';
import { buildSvg } from '../public/src/exports.js';
import { createGraphGeometryCache } from '../public/src/graph-render-cache.js';
import { segmentCrossesRectangle } from '../public/src/category-routing.js';

const fixture = () => ({ project: { name: 'Fictional grouped service' }, nodes: [
  { id: 'web', label: 'Portal', type: 'Frontend', group: 'Experience' },
  { id: 'mobile', label: 'Mobile', type: 'Frontend', group: 'Experience' },
  { id: 'api', label: 'API', type: 'API', group: 'Processing' },
  { id: 'worker', label: 'Worker', type: 'Job', group: 'Processing' },
  { id: 'db', label: 'Store', type: 'Database', group: 'Storage' },
  { id: 'email', label: 'Email', type: 'External' },
  { id: 'other', label: 'Other', type: 'External' },
], edges: [
  { id: 'a', source: 'web', target: 'api', label: 'submits' },
  { id: 'b', source: 'mobile', target: 'api', label: 'sends' },
  { id: 'c', source: 'api', target: 'worker', label: 'dispatches' },
  { id: 'd', source: 'worker', target: 'db', label: 'stores' },
  { id: 'e', source: 'worker', target: 'email', label: 'notifies' },
  { id: 'f', source: 'email', target: 'other', label: 'routes' },
] });

test('multiple original relationships share one boundary trunk and deduplicated internal branches', () => {
  const graph = fixture(), before = JSON.stringify(graph), layout = layoutGraph(graph, { categoryFrames: true });
  const plan = buildGroupConnections(graph, layout);
  const trunk = plan.wires.find(wire => wire.kind === 'trunk' && wire.source.group === 'Experience');
  assert.deepEqual(trunk.edgeIndexes, [0, 1]);
  assert.equal(plan.wires.filter(wire => wire.kind === 'trunk').length, 3);
  assert.equal(plan.wires.filter(wire => wire.nodeId === 'api' && wire.direction === 'in').length, 1);
  assert.deepEqual(plan.wires.find(wire => wire.nodeId === 'api' && wire.direction === 'in').edgeIndexes, [0, 1]);
  assert.deepEqual(plan.crossEdges, new Set([0, 1, 3, 4]));
  assert.deepEqual(trunk.geometry.points[0], { x: trunk.start.x, y: trunk.start.y });
  assert.deepEqual(trunk.geometry.points.at(-1), { x: trunk.end.x, y: trunk.end.y });
  assert.equal(JSON.stringify(graph), before);
});

test('singleton boundary input fans to its real node; ungrouped relationships stay ordinary', () => {
  const graph = fixture(), layout = layoutGraph(graph, { categoryFrames: true }), plan = buildGroupConnections(graph, layout);
  const input = plan.ports.find(port => port.group === 'Storage');
  const branch = plan.wires.find(wire => wire.nodeId === 'db');
  assert.deepEqual(branch.start, input);
  const point = layout.positions.get('db'), size = layout.dimensions.get('db');
  assert.deepEqual(branch.end, { x: point.x, y: point.y + size.height / 2 });
  assert.equal(plan.crossEdges.has(5), false);
  assert.equal(plan.ports.some(port => port.group === 'email'), false);
});

test('filtering rebuilds only surviving relationships and never leaves hidden-category trunks', () => {
  const graph = fixture(), layout = layoutGraph(graph, { categoryFrames: true });
  const plan = buildGroupConnections(graph, layout, new Set(['Frontend', 'Database']));
  assert.equal(plan.wires.filter(wire => wire.kind === 'trunk').length, 1);
  assert.equal(plan.ports.some(port => ['Experience', 'Storage'].includes(port.group)), false);
  assert.deepEqual(plan.crossEdges, new Set([0, 1, 3, 4]));
});

test('both directions have separate trunks, all member relationships are inspectable, exports and bounds match', () => {
  const graph = fixture(); graph.edges.push({ id: 'back', source: 'api', target: 'web', label: '<response>' });
  const layout = layoutGraph(graph, { categoryFrames: true }), plan = buildGroupConnections(graph, layout);
  assert.equal(plan.wires.filter(wire => wire.kind === 'trunk').length, 4);
  const bounds = graphBounds(graph, layout.positions, layout.dimensions, undefined, { categoryFrames: true });
  for (const wire of plan.wires) for (const point of wire.geometry.points) {
    assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
    assert.ok(point.x >= bounds.x && point.x <= bounds.x + bounds.width);
    assert.ok(point.y >= bounds.y && point.y <= bounds.y + bounds.height);
  }
  for (const theme of ['dark', 'light']) {
    const svg = buildSvg(graph, theme, { categoryFrames: true });
    assert.equal((svg.match(/data-kind="trunk"/g) || []).length, 4);
    for (const wire of plan.wires) assert.ok(svg.includes(wire.geometry.path));
    assert.ok(svg.includes('&lt;response&gt;'));
  }
  assert.ok(!buildSvg(graph).includes('group-wire'));
});

test('drag invalidates shared ports and trunks while preserving mounted structural cache', () => {
  const graph = fixture(), cache = createGraphGeometryCache({ categoryFrames: true }), entry = cache.get(graph);
  const before = groupConnectionPlan(graph, entry), path = before.wires.find(wire => wire.kind === 'trunk').geometry.path;
  const point = entry.layout.positions.get('mobile');
  graph.nodes[1].framePosition = { x: point.x, y: point.y + 170 };
  cache.move(graph, 'mobile', graph.nodes[1].framePosition);
  const next = groupConnectionPlan(graph, entry);
  assert.notEqual(next, before);
  assert.notEqual(next.wires.find(wire => wire.kind === 'trunk').geometry.path, path);
  assert.equal(cache.get(graph), entry);
});

test('external trunk avoids an unrelated frame and both endpoint frame interiors', () => {
  const graph = { project: { name: 'Fictional corridor' }, nodes: [
    { id: 'a', label: 'A', type: 'API', group: 'A', framePosition: { x: 0, y: 100 } },
    { id: 'b', label: 'B', type: 'API', group: 'B', framePosition: { x: 450, y: 100 } },
    { id: 'c', label: 'C', type: 'API', group: 'C', framePosition: { x: 900, y: 100 } },
  ], edges: [{ id: 'ac', source: 'a', target: 'c' }] };
  const plan = buildGroupConnections(graph, layoutGraph(graph, { categoryFrames: true }));
  const trunk = plan.wires.find(wire => wire.kind === 'trunk');
  assert.ok(trunk.geometry.path.includes(' Q '));
  for (let i = 1; i < trunk.geometry.points.length; i++) assert.equal(segmentCrossesRectangle(trunk.geometry.points[i - 1], trunk.geometry.points[i], { left: 386, right: 718, top: 36, bottom: 272 }), false);
});

test('different counterpart categories have distinct terminals and preserve exact member-to-member relationships', () => {
  const graph = fixture();
  graph.edges.push({ id: 'direct', source: 'mobile', target: 'db', label: 'reads' });
  const before = JSON.stringify(graph), plan = buildGroupConnections(graph, layoutGraph(graph, { categoryFrames: true }));
  const processingPorts = plan.ports.filter(port => port.group === 'Processing' && port.direction === 'out');
  assert.equal(processingPorts.length, 2);
  assert.notEqual(processingPorts[0].y, processingPorts[1].y);
  assert.notEqual(processingPorts[0].wireId, processingPorts[1].wireId);
  const storeInput = plan.ports.filter(port => port.group === 'Storage' && port.direction === 'in');
  assert.equal(storeInput.length, 2);
  const branches = plan.wires.filter(wire => wire.nodeId === 'db');
  assert.equal(branches.length, 2);
  assert.deepEqual(branches.map(wire => wire.edgeIndexes).flat().sort(), [3, 6]);
  for (const wire of plan.wires) {
    assert.equal(wire.geometry.arrowPoints[1].x, wire.end.x);
    assert.equal(wire.geometry.arrowPoints[1].y, wire.end.y);
    assert.ok(wire.geometry.arrowPoints.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
  }
  const svg = buildSvg(graph, 'light', { categoryFrames: true });
  for (const wire of plan.wires) assert.ok(svg.includes(wire.geometry.arrowPath));
  assert.ok(svg.includes('class="wire-casing"'));
  assert.equal(JSON.stringify(graph), before);
});

test('a high-degree singleton reserves enough frame space for separately readable terminals', () => {
  const graph = { nodes: Array.from({ length: 13 }, (_, index) => ({ id: 'n' + index, label: 'Service ' + index, type: 'Service', group: 'Group ' + index })),
    edges: Array.from({ length: 12 }, (_, index) => ({ source: 'n0', target: 'n' + (index + 1) })) };
  const before = JSON.stringify(graph), layout = layoutGraph(graph, { categoryFrames: true }), plan = buildGroupConnections(graph, layout);
  const ports = plan.ports.filter(port => port.group === 'Group 0').sort((a, b) => a.y - b.y);
  assert.equal(ports.length, 12);
  for (let i = 1; i < ports.length; i++) assert.ok(ports[i].y - ports[i - 1].y >= 28);
  assert.equal(JSON.stringify(graph), before);
});
