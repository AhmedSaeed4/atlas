import test from 'node:test';
import assert from 'node:assert/strict';
import { layoutGraph } from '../public/src/layout.js';
import { categoryBounds, CATEGORY_HEADER, CATEGORY_PADDING, createCategoryFramePreferences } from '../public/src/map-categories.js';
import { graphBounds } from '../public/src/geometry.js';
import { createGraphGeometryCache } from '../public/src/graph-render-cache.js';
import { projectCollapsedGroups } from '../public/src/graph-exploration.js';
import { buildSvg } from '../public/src/exports.js';
import { normalizeGraph } from '../public/src/schema.js';

const fixture = () => ({ schemaVersion: 1, project: { name: 'Category test' }, nodes: [
  { id: 'web', label: 'Website', type: 'Frontend', group: 'Interface' },
  { id: 'mobile', label: 'Mobile app', type: 'Frontend', group: 'Interface' },
  { id: 'api', label: 'API', type: 'API', group: 'Backend' },
  { id: 'worker', label: 'Worker', type: 'Job', group: 'Backend', chart: { label: 'Tests', kind: 'bar', values: [3, 7], categories: ['Unit', 'Integration'], evidence: 'test scripts' } },
  { id: 'db', label: 'Database', type: 'Database', group: '' },
], edges: [
  { id: 'web-api', source: 'web', target: 'api', label: 'calls' },
  { id: 'api-worker', source: 'api', target: 'worker', label: 'dispatches' },
  { id: 'worker-db', source: 'worker', target: 'db', label: 'stores' },
] });
const overlap = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test('frames are opt-in: the default layout, cache and image exports keep the normal graph', () => {
  const graph = fixture(), before = JSON.stringify(graph);
  const normal = layoutGraph(graph), cache = createGraphGeometryCache();
  assert.equal(cache.get(graph).categoryFrames, false);
  assert.equal(cache.get(graph).routing, null);
  assert.deepEqual(cache.get(graph).layout.positions, normal.positions);
  assert.equal(normal.positions.get('api').x, 322);
  for (const theme of ['dark', 'light']) assert.ok(!buildSvg(graph, theme).includes('class="map-category"'));
  let enabled = false;
  const switching = createGraphGeometryCache({ categoryFrames: () => enabled });
  const original = switching.get(graph);
  enabled = true;
  assert.notEqual(switching.get(graph), original);
  assert.ok(switching.get(graph).routing);
  enabled = false;
  assert.deepEqual(switching.get(graph).layout.positions, original.layout.positions);
  assert.equal(switching.get(graph).routing, null);
  assert.equal(JSON.stringify(graph), before);
});

test('frame preferences default off, persist only scoped IDs and stay separate between maps and owners', () => {
  const saved = new Map(), storage = { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) };
  const preferences = createCategoryFramePreferences(storage);
  assert.equal(preferences.enabled('local:a'), false);
  preferences.set('local:a', true);
  preferences.set('cloud:owner-a:map', true);
  const restored = createCategoryFramePreferences(storage);
  assert.equal(restored.enabled('local:a'), true);
  assert.equal(restored.enabled('local:b'), false);
  assert.equal(restored.enabled('cloud:owner-b:map'), false);
  assert.deepEqual(JSON.parse(saved.get('atlas.category-frames.v1')), ['local:a', 'cloud:owner-a:map']);
  restored.set('local:a', false);
  assert.equal(createCategoryFramePreferences(storage).enabled('local:a'), false);
  const blocked = createCategoryFramePreferences({ getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } });
  assert.equal(blocked.set('local:test', true), false);
  assert.equal(blocked.enabled('local:test'), true);
  assert.equal(createCategoryFramePreferences({ getItem: () => '{bad' }).enabled('local:a'), false);
});

test('single-node frames retain the actual node and all original connection endpoints', () => {
  const graph = fixture(); graph.nodes[4].group = 'Storage';
  const before = JSON.stringify(graph), layout = layoutGraph(graph, { categoryFrames: true });
  const storage = categoryBounds(graph, layout.positions, layout.dimensions).find(box => box.name === 'Storage');
  assert.equal(storage.members.length, 1);
  assert.equal(storage.members[0].id, 'db');
  const route = createGraphGeometryCache({ categoryFrames: true }).edge(graph, 2);
  assert.equal(route.points.at(-1).x, layout.positions.get('db').x);
  assert.equal(route.points.at(-1).y, layout.positions.get('db').y + layout.dimensions.get('db').height / 2);
  assert.equal(JSON.stringify(graph), before);
});

test('category layout encloses members with header room, separates categories and leaves unassigned nodes outside', () => {
  const graph = fixture(), original = JSON.stringify(graph), layout = layoutGraph(graph, { categoryFrames: true });
  const boxes = categoryBounds(graph, layout.positions, layout.dimensions);
  assert.equal(boxes.length, 2);
  for (const box of boxes) for (const node of box.members) {
    assert.ok(node.x >= box.x + CATEGORY_PADDING);
    assert.ok(node.y >= box.y + CATEGORY_HEADER);
    assert.ok(node.x + node.width <= box.x + box.width - CATEGORY_PADDING);
    assert.ok(node.y + node.height <= box.y + box.height - CATEGORY_PADDING);
  }
  assert.equal(overlap(boxes[0], boxes[1]), false);
  const unassigned = { ...layout.positions.get('db'), ...layout.dimensions.get('db') };
  for (const box of boxes) assert.equal(overlap(box, unassigned), false);
  const bounds = graphBounds(graph, layout.positions, layout.dimensions, undefined, { categoryFrames: true });
  for (const box of boxes) {
    assert.ok(box.x >= bounds.x && box.y >= bounds.y);
    assert.ok(box.x + box.width <= bounds.x + bounds.width);
    assert.ok(box.y + box.height <= bounds.y + bounds.height);
  }
  assert.equal(JSON.stringify(graph), original);
});

test('disconnected and cyclic categories stay separate; large categories use at most three columns', () => {
  const graph = fixture();
  graph.edges.push({ source: 'db', target: 'web' });
  graph.nodes.push({ id: 'external', label: 'External', type: 'External' });
  const layout = layoutGraph(graph, { categoryFrames: true }), boxes = categoryBounds(graph, layout.positions, layout.dimensions);
  assert.equal(overlap(boxes[0], boxes[1]), false);
  const many = { nodes: Array.from({ length: 40 }, (_, i) => ({ id: String(i), label: String(i), type: 'Service', group: 'Processing' })), edges: Array.from({ length: 39 }, (_, i) => ({ source: String(i), target: String(i + 1) })) };
  const dense = layoutGraph(many, { categoryFrames: true });
  assert.ok(new Set([...dense.positions.values()].map(point => point.x)).size <= 3);
  const rectangles = many.nodes.map(node => ({ ...dense.positions.get(node.id), ...dense.dimensions.get(node.id) }));
  for (let i = 0; i < rectangles.length; i++) for (let j = i + 1; j < rectangles.length; j++) assert.equal(overlap(rectangles[i], rectangles[j]), false);
});

test('manual positions survive layout and category dragging rechecks routes without changing stationary node geometry', () => {
  const graph = fixture();
  graph.nodes[0].position = { x: -500, y: -300 };
  const cache = createGraphGeometryCache({ categoryFrames: true }), entry = cache.get(graph);
  assert.deepEqual(entry.layout.positions.get('web'), graph.nodes[0].position);
  const other = { ...entry.layout.positions.get('api') }, route = cache.edge(graph, 1);
  graph.nodes[0].position = { x: -700, y: -500 };
  cache.move(graph, 'web', graph.nodes[0].position);
  assert.deepEqual(entry.layout.positions.get('api'), other);
  assert.equal(cache.edge(graph, 1), route);
  const box = categoryBounds(graph, entry.layout.positions, entry.layout.dimensions).find(box => box.name === 'Interface');
  assert.equal(box.x, -700 - CATEGORY_PADDING);
  assert.ok(cache.bounds(graph).x <= box.x);
  graph.nodes[0].group = 'Backend';
  assert.notEqual(cache.get(graph), entry);
});

test('many cyclic category blocks wrap into balanced columns instead of one long stack', () => {
  const graph = { nodes: Array.from({ length: 36 }, (_, i) => ({ id: String(i), label: 'Component ' + i, type: 'Service', group: 'Category ' + Math.floor(i / 3) })), edges: Array.from({ length: 36 }, (_, i) => ({ source: String(i), target: String((i + 1) % 36) })) };
  const layout = layoutGraph(graph, { categoryFrames: true }), boxes = categoryBounds(graph, layout.positions, layout.dimensions);
  assert.ok(new Set(boxes.map(box => box.x)).size > 1);
  assert.ok(layout.bounds.height < 2000);
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) assert.equal(overlap(boxes[i], boxes[j]), false);
  const overview = projectCollapsedGroups(graph, new Set(graph.nodes.map(node => node.group)));
  const compact = layoutGraph(overview, { categoryFrames: true });
  assert.ok(new Set([...compact.positions.values()].map(point => point.x)).size > 1);
  assert.ok(compact.bounds.height < 1000);
});

test('a pair of sibling destinations shares a column so one destination does not sit on the other route', () => {
  const graph = fixture();
  graph.nodes.push({ id: 'email', label: 'Email', type: 'External' });
  graph.edges.push({ source: 'worker', target: 'email' });
  const layout = layoutGraph(graph, { categoryFrames: true });
  assert.equal(layout.positions.get('db').x, layout.positions.get('email').x);
  assert.notEqual(layout.positions.get('db').y, layout.positions.get('email').y);
});

test('filtering adjusts visible category counts and folding remains a non-mutating view projection', () => {
  const graph = fixture(), layout = layoutGraph(graph, { categoryFrames: true });
  const boxes = categoryBounds(graph, layout.positions, layout.dimensions, new Set(['Frontend', 'Job']));
  assert.equal(boxes.length, 1);
  assert.equal(boxes[0].name, 'Backend');
  assert.equal(boxes[0].total, 2);
  assert.equal(boxes[0].members.length, 1);
  const before = JSON.stringify(graph), folded = projectCollapsedGroups(graph, new Set(['Backend']));
  const foldedLayout = layoutGraph(folded, { categoryFrames: true });
  assert.deepEqual(categoryBounds(folded, foldedLayout.positions, foldedLayout.dimensions).map(box => box.name), ['Interface']);
  assert.equal(folded.nodes.filter(node => node.viewGroup).length, 1);
  assert.equal(JSON.stringify(graph), before);
});

test('category text is escaped in both SVG themes and round-trips through the unchanged JSON format', () => {
  const graph = fixture();
  graph.nodes[0].group = '<script>&"category';
  for (const theme of ['dark', 'light']) {
    const svg = buildSvg(graph, theme, { categoryFrames: true });
    assert.ok(svg.includes('class="map-category"'));
    assert.ok(svg.includes('&lt;script&gt;&amp;&quot;category'));
    assert.ok(!svg.includes('<script>'));
  }
  const roundTrip = normalizeGraph(JSON.parse(JSON.stringify(graph)));
  assert.equal(roundTrip.nodes[0].group, graph.nodes[0].group);
  assert.equal(roundTrip.nodes.find(node => node.id === 'db').group, '');
});
