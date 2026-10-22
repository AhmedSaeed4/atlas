import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { normalizeGraph } from '../../public/src/schema.js';

const model = () => ({ schemaVersion: 1, project: { name: 'Category browser test', description: 'Disposable architecture used for browser checks.' }, nodes: [
  { id: 'web', label: 'Customer portal', type: 'Frontend', group: 'Experience' },
  { id: 'mobile', label: 'Mobile app', type: 'Frontend', group: 'Experience' },
  { id: 'api', label: 'Request API', type: 'API', group: 'Processing' },
  { id: 'worker', label: 'Support worker', type: 'Job', group: 'Processing' },
  { id: 'db', label: 'Project database', type: 'Database' },
], edges: [
  { id: 'web-api', source: 'web', target: 'api', label: 'submits' },
  { id: 'mobile-api', source: 'mobile', target: 'api', label: 'submits' },
  { id: 'api-worker', source: 'api', target: 'worker', label: 'dispatches' },
  { id: 'worker-db', source: 'worker', target: 'db', label: 'stores' },
] });

async function seed(page, { frames = true, second = false, ungrouped = false } = {}) {
  const graph = model();
  if (ungrouped) for (const node of graph.nodes) node.group = '';
  const library = { version: 1, activeId: 'categories', projects: [{ id: 'categories', graph, updatedAt: 1 }] };
  if (second) library.projects.push({ id: 'second', graph: { ...model(), project: { name: 'Second category map' } }, updatedAt: 1 });
  await page.addInitScript(library => {
    if (!localStorage.getItem('project-atlas-library-v1')) localStorage.setItem('project-atlas-library-v1', JSON.stringify(library));
  }, library);
  await page.goto('/workspace');
  await expect(page.locator('.node-card')).toHaveCount(5);
  await expect(page.locator('#category-frames-toggle')).toHaveAttribute('aria-pressed', 'false');
  if (frames) await page.locator('#category-frames-toggle').click();
  await expect(page.locator('.view-group-card')).toHaveCount(0);
}

async function editCategory(page, nodeId, category) {
  await page.locator(`.node-card[data-node-id="${nodeId}"]`).press('F2');
  await page.locator('#node-group').fill(category);
  await page.getByRole('button', { name: 'Save component', exact: true }).click();
  await expect(page.locator('#editor-modal')).not.toBeVisible();
}
async function storedCategory(page, id) {
  return page.evaluate(id => JSON.parse(localStorage.getItem('project-atlas-library-v1')).projects[0].graph.nodes.find(node => node.id === id).group, id);
}

test('normal maps stay normal and frames share external wires while keeping actual nodes visible', async ({ page }) => {
  await seed(page, { frames: false });
  await expect(page.locator('.map-category')).toHaveCount(0);
  await expect(page.locator('.edge-group')).toHaveCount(4);
  const canonical = await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'));
  const positions = await page.locator('.node-card').evaluateAll(cards => cards.map(card => card.getAttribute('transform')));
  const paths = await page.locator('.edge-path').evaluateAll(edges => edges.map(edge => edge.getAttribute('d')));
  await page.locator('#category-frames-toggle').click();
  await expect(page.locator('.map-category')).toHaveCount(2);
  await expect(page.locator('.node-card')).toHaveCount(5);
  await expect(page.locator('.view-group-card')).toHaveCount(0);
  await expect(page.locator('.edge-group')).toHaveCount(1);
  await expect(page.locator('.group-wire[data-kind="trunk"]')).toHaveCount(2);
  const bundled = page.locator('.group-wire[data-kind="trunk"]').filter({ hasText: '2 connections' });
  await expect(bundled).toHaveCount(1);
  expect(JSON.parse(await bundled.getAttribute('data-edge-ids'))).toEqual(['web-api', 'mobile-api']);
  await expect(page.locator('[data-edge-id="api-worker"] .edge-label')).toHaveCSS('visibility', 'visible');
  await expect(page.locator('.category-header[role="button"]')).toHaveCount(2);
  await expect(page.locator('[data-category-header="Experience"]')).toHaveAttribute('aria-label', /Move category Experience/);
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(page.locator('#explore-groups .category-frame-summary')).toHaveCount(2);
  await expect(page.locator('#explore-groups button')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.locator('#category-frames-toggle').click();
  await expect(page.locator('.map-category')).toHaveCount(0);
  expect(await page.locator('.node-card').evaluateAll(cards => cards.map(card => card.getAttribute('transform')))).toEqual(positions);
  expect(await page.locator('.edge-path').evaluateAll(edges => edges.map(edge => edge.getAttribute('d')))).toEqual(paths);
  expect(await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'))).toBe(canonical);
});

test('a single-node category receives a shared boundary input then branches to its real component', async ({ page }) => {
  await seed(page);
  await editCategory(page, 'db', 'Storage');
  await expect(page.locator('[data-category-header="Storage"] .category-count')).toHaveText('1');
  await expect(page.locator('.node-card')).toHaveCount(5);
  await expect(page.locator('.edge-group')).toHaveCount(1);
  expect(await page.evaluate(() => {
    const node = document.querySelector('.node-card[data-node-id="db"]');
    const position = node.transform.baseVal.consolidate().matrix;
    const height = Number(node.querySelector('.card-bg').getAttribute('height'));
    const branch = [...document.querySelectorAll('.group-wire[data-kind="branch"]')].find(element => element.dataset.wireId === 'branch:' + JSON.stringify(['db', 'in']));
    const path = branch.querySelector('.edge-path');
    const end = path.getPointAtLength(path.getTotalLength());
    return Math.abs(end.x - position.e) < .1 && Math.abs(end.y - position.f - height / 2) < .1;
  })).toBe(true);
});

test('frames are remembered for the chosen map without switching on another map', async ({ page }) => {
  await seed(page, { second: true });
  await page.reload();
  await expect(page.locator('#category-frames-toggle')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.map-category')).toHaveCount(2);
  await page.locator('#project-list .project-row').nth(1).click();
  await expect(page.locator('#project-title')).toHaveText('Second category map');
  await expect(page.locator('#category-frames-toggle')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.map-category')).toHaveCount(0);
  await page.locator('#project-list .project-row').first().click();
  await expect(page.locator('#category-frames-toggle')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#category-frames-toggle').click();
  await page.reload();
  await expect(page.locator('#category-frames-toggle')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.node-card')).toHaveCount(5);
});

test('uncategorized maps are never classified automatically and can opt into a first frame', async ({ page }) => {
  await seed(page, { frames: false, ungrouped: true });
  await page.locator('#category-frames-toggle').click();
  await expect(page.locator('.map-category')).toHaveCount(0);
  await editCategory(page, 'api', 'Processing');
  await expect(page.locator('.map-category')).toHaveCount(1);
  await expect(page.locator('.node-card')).toHaveCount(5);
  await expect(page.locator('.group-wire[data-kind="trunk"]')).toHaveCount(3);
  expect(await storedCategory(page, 'web')).toBe('');
});

test('create and remove a category through the editor, reuse suggestions, undo and persist across reload', async ({ page }) => {
  await seed(page);
  await editCategory(page, 'db', 'Data & storage');
  await expect(page.locator('.map-category')).toHaveCount(3);
  await expect.poll(() => storedCategory(page, 'db')).toBe('Data & storage');
  await page.locator('.node-card[data-node-id="db"]').press('F2');
  await expect(page.locator('#node-group-options option')).toHaveCount(3);
  await page.keyboard.press('Escape');
  await editCategory(page, 'db', 'Processing');
  await expect(page.locator('.map-category')).toHaveCount(2);
  await expect(page.locator('[data-category-header="Processing"] .category-count')).toHaveText('3');
  await page.getByRole('button', { name: /^Undo/ }).click();
  await expect(page.locator('[data-category="Data & storage"]')).toHaveCount(1);
  await page.getByRole('button', { name: /^Redo/ }).click();
  await editCategory(page, 'db', '');
  await expect.poll(() => storedCategory(page, 'db')).toBe('');
  await page.reload();
  await expect(page.locator('.map-category')).toHaveCount(2);
  expect(await storedCategory(page, 'db')).toBe('');
  await expect(page.locator('.node-card[data-node-id="db"]')).toBeVisible();
});

test('search and filters retain actual nodes and update visible frame counts', async ({ page }) => {
  await seed(page);
  const before = await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'));
  const search = page.getByRole('combobox', { name: 'Find a component', exact: true });
  await search.fill('Request API'); await search.press('Enter'); await search.fill('');
  await expect(page.locator('.node-card')).toHaveCount(5);
  await expect(page.locator('.view-group-card')).toHaveCount(0);
  await expect(page.locator('[data-category-header="Processing"] .category-count')).toHaveText('2');
  await page.locator('.filter-chip[data-type="Job"]').click();
  await page.locator('.filter-chip[data-type="Job"]').click();
  await expect(page.locator('[data-category-header="Processing"] .category-count')).toHaveText('1/2');
  await page.locator('.filter-chip[data-type="Frontend"]').click();
  await page.locator('.filter-chip[data-type="Frontend"]').click();
  await expect(page.locator('[data-category="Experience"]')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'))).toBe(before);
});

test('dragging expands a category without rebuilding cards and fullscreen retains the camera', async ({ page }) => {
  await seed(page);
  await page.locator('#graph-fullscreen').click();
  await expect(page.locator('html')).not.toHaveClass(/graph-fullscreen-transition/);
  const card = page.locator('.node-card[data-node-id="mobile"]');
  await page.evaluate(() => { window.categoryDraggedCard = document.querySelector('.node-card[data-node-id="mobile"]'); });
  const height = Number(await page.locator('[data-category="Experience"] .category-boundary').getAttribute('height'));
  const sharedPath = await page.locator('.group-wire[data-kind="trunk"]').first().locator('.edge-path').getAttribute('d');
  const rect = await card.boundingBox();
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await page.mouse.down(); await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2 + 80, { steps: 8 }); await page.mouse.up();
  await expect.poll(async () => Number(await page.locator('[data-category="Experience"] .category-boundary').getAttribute('height'))).toBeGreaterThan(height);
  expect(await page.evaluate(() => window.categoryDraggedCard === document.querySelector('.node-card[data-node-id="mobile"]'))).toBe(true);
  await expect(page.locator('.group-wire[data-kind="trunk"]').first().locator('.edge-path')).not.toHaveAttribute('d', sharedPath);
  const scale = await page.evaluate(() => document.querySelector('#viewport').transform.baseVal.consolidate().matrix.a);
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveClass(/graph-fullscreen-transition/);
  expect(await page.evaluate(() => document.querySelector('#viewport').transform.baseVal.consolidate().matrix.a)).toBeCloseTo(scale, 5);
  const position = await card.getAttribute('transform');
  await page.reload();
  await expect(card).toHaveAttribute('transform', position);
});

test('rendered connections avoid an unrelated category and reroute when that category moves', async ({ page }) => {
  const graph = { schemaVersion: 1, project: { name: 'Category crossing check' }, nodes: [
    { id: 'source', label: 'Source API', type: 'API', group: 'Interface', framePosition: { x: 0, y: 100 } },
    { id: 'other', label: 'Unrelated job', type: 'Job', group: 'Unrelated', framePosition: { x: 450, y: 100 } },
    { id: 'target', label: 'Target store', type: 'Database', group: 'Storage', framePosition: { x: 900, y: 100 } },
  ], edges: [{ id: 'crossing', source: 'source', target: 'target', label: 'stores' }] };
  await page.addInitScript(graph => localStorage.setItem('project-atlas-library-v1', JSON.stringify({ version: 1, activeId: 'route', projects: [{ id: 'route', graph, updatedAt: 1 }] })), graph);
  await page.goto('/workspace');
  await page.locator('#category-frames-toggle').click();
  const route = page.locator('.group-wire[data-kind="trunk"] .edge-path');
  const before = await route.getAttribute('d');
  expect(before).toContain(' Q ');
  const avoidsBoundary = () => page.evaluate(() => {
    const path = document.querySelector('.group-wire[data-kind="trunk"] .edge-path');
    const boundary = document.querySelector('.map-category[data-category="Unrelated"]');
    const origin = boundary.transform.baseVal.consolidate().matrix;
    const rectangle = boundary.querySelector('.category-boundary');
    const width = Number(rectangle.getAttribute('width')), height = Number(rectangle.getAttribute('height'));
    const length = path.getTotalLength();
    for (let i = 0; i <= 500; i++) { const point = path.getPointAtLength(length * i / 500); if (point.x > origin.e && point.x < origin.e + width && point.y > origin.f && point.y < origin.f + height) return false; }
    return true;
  });
  expect(await avoidsBoundary()).toBe(true);
  const card = await page.locator('.node-card[data-node-id="other"]').boundingBox();
  await page.mouse.move(card.x + card.width / 2, card.y + card.height / 2); await page.mouse.down();
  await page.mouse.move(card.x + card.width / 2, card.y + card.height / 2 + 100, { steps: 8 }); await page.mouse.up();
  await expect(route).not.toHaveAttribute('d', before);
  expect(await avoidsBoundary()).toBe(true);
});

for (const theme of ['dark', 'light']) test(`${theme} category headers remain usable on a narrow screen without page overflow`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page);
  await page.evaluate(theme => document.documentElement.setAttribute('data-theme', theme), theme);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#category-frames-toggle').press('Space');
  await expect(page.locator('.map-category')).toHaveCount(0);
  await page.locator('#category-frames-toggle').press('Space');
  await expect(page.locator('.map-category')).toHaveCount(2);
  await expect(page.locator('.node-card')).toHaveCount(5);
  const before = await nodePoints(page);
  await dragHeader(page, 'Experience', 12, 10);
  const after = await nodePoints(page);
  expect(after.web).not.toEqual(before.web);
  expect(after.mobile.x - before.mobile.x).toBeCloseTo(after.web.x - before.web.x, 5);
  expect(after.mobile.y - before.mobile.y).toBeCloseTo(after.web.y - before.web.y, 5);
  expect(after.api).toEqual(before.api);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('SVG downloads follow the optional frame display', async ({ page }) => {
  await seed(page, { frames: false });
  for (const framed of [false, true]) {
    if (framed) await page.locator('#category-frames-toggle').click();
    await page.locator('#export-menu-button').click();
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-export="svg"]').click()]);
    const source = await readFile(await download.path(), 'utf8');
    expect((source.match(/class="map-category"/g) || []).length).toBe(framed ? 2 : 0);
    expect(source).toContain('Customer portal');
    expect((source.match(/data-kind="trunk"/g) || []).length).toBe(framed ? 2 : 0);
  }
});

test('shared wire inspector lists real relationships and lets owners edit one without editing the bundle', async ({ page }) => {
  await seed(page);
  const canonical = await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'));
  const trunk = page.locator('.group-wire[data-kind="trunk"]').filter({ hasText: '2 connections' });
  await trunk.press('Enter');
  await expect(page.locator('.group-relationship')).toHaveCount(2);
  await expect(page.locator('.group-wire[data-kind="branch"].selected')).toHaveCount(3);
  await expect(page.locator('.group-relationship')).toContainText(['Customer portal → Request API', 'Mobile app → Request API']);
  expect(await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'))).toBe(canonical);
  await page.locator('.group-relationship').first().click();
  await expect(page.getByRole('button', { name: 'Edit connection', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit connection', exact: true }).click();
  await expect(page.locator('#edge-source')).toHaveValue('web');
  await expect(page.locator('#edge-target')).toHaveValue('api');
  await page.keyboard.press('Escape');
  await page.locator('#graph-fullscreen').click();
  await trunk.press('Enter');
  await expect(page.locator('.group-relationship')).toHaveCount(2);
  await page.locator('#close-inspector').click();
  await expect(page.locator('.group-relationship')).toHaveCount(0);
  await trunk.press('Enter');
  const stage = await page.locator('#graph-stage').boundingBox();
  await page.mouse.click(stage.x + 30, stage.y + stage.height - 50);
  await expect(page.locator('.group-relationship')).toHaveCount(0);
});

const nodePoints = page => page.locator('.node-card').evaluateAll(cards => Object.fromEntries(cards.map(card => {
  const matrix = card.transform.baseVal.consolidate().matrix; return [card.dataset.nodeId, { x: matrix.e, y: matrix.f }];
})));
async function dragHeader(page, category, dx, dy, { release = true } = {}) {
  const header = page.locator(`[data-category-header="${category}"] .category-header-hit`), rect = await header.boundingBox();
  const x = rect.x + Math.min(rect.width / 2, 70), y = rect.y + rect.height / 2;
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + dx, y + dy, { steps: 8 });
  if (release) await page.mouse.up();
}

test('category header drags all members with stable spacing and camera, one Undo, Redo and refresh', async ({ page }) => {
  await seed(page);
  await page.locator('#graph-fullscreen').click();
  const before = await nodePoints(page);
  const camera = await page.locator('#viewport').getAttribute('transform');
  const library = await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'));
  const route = page.locator('.group-wire[data-kind="trunk"]').first().locator('.edge-path');
  const path = await route.getAttribute('d');
  await page.evaluate(() => { window.movedCategoryCard = document.querySelector('[data-node-id="web"]'); });
  await dragHeader(page, 'Experience', 64, 38);
  const after = await nodePoints(page);
  const dx = after.web.x - before.web.x, dy = after.web.y - before.web.y;
  expect(dx).not.toBe(0); expect(dy).not.toBe(0);
  expect(after.mobile.x - before.mobile.x).toBeCloseTo(dx, 5);
  expect(after.mobile.y - before.mobile.y).toBeCloseTo(dy, 5);
  for (const id of ['api', 'worker', 'db']) expect(after[id]).toEqual(before[id]);
  expect(await page.locator('#viewport').getAttribute('transform')).toBe(camera);
  expect(await page.evaluate(() => window.movedCategoryCard === document.querySelector('[data-node-id="web"]'))).toBe(true);
  await expect(route).not.toHaveAttribute('d', path);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  expect(await nodePoints(page)).toEqual(before);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('project-atlas-library-v1')).projects[0].graph)).toEqual(normalizeGraph(JSON.parse(library).projects[0].graph));
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  expect(await nodePoints(page)).toEqual(after);
  await page.reload(); expect(await nodePoints(page)).toEqual(after);
});

test('category drag cancellation and header click leave positions, storage and history untouched', async ({ page }) => {
  await seed(page);
  const before = await nodePoints(page), library = await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'));
  await page.locator('[data-category-header="Experience"] .category-header-hit').click();
  expect(await nodePoints(page)).toEqual(before);
  await dragHeader(page, 'Experience', 55, 36, { release: false });
  await page.keyboard.press('Escape'); await page.mouse.up();
  expect(await nodePoints(page)).toEqual(before);
  expect(await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'))).toBe(library);
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled();
  await dragHeader(page, 'Experience', 45, 32, { release: false });
  await page.locator('#graph').dispatchEvent('pointercancel', { pointerId: 1 }); await page.mouse.up();
  expect(await nodePoints(page)).toEqual(before);
  expect(await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'))).toBe(library);
});

test('category movement includes hidden members; node drag stays independent and keyboard movement works', async ({ page }) => {
  await seed(page);
  await page.locator('.filter-chip[data-type="Job"]').click(); await page.locator('.filter-chip[data-type="Job"]').click();
  const before = await nodePoints(page);
  await dragHeader(page, 'Processing', 36, 28);
  const after = await nodePoints(page);
  expect(after.worker.x - before.worker.x).toBeCloseTo(after.api.x - before.api.x, 5);
  expect(after.worker.y - before.worker.y).toBeCloseTo(after.api.y - before.api.y, 5);
  expect(after.web).toEqual(before.web);
  await page.locator('[data-category-header="Processing"]').press('Shift+ArrowRight');
  const keyboard = await nodePoints(page);
  expect(keyboard.api.x - after.api.x).toBeCloseTo(40, 5);
  expect(keyboard.worker.x - after.worker.x).toBeCloseTo(40, 5);
  const card = await page.locator('.node-card[data-node-id="api"]').boundingBox();
  await page.mouse.move(card.x + card.width / 2, card.y + card.height / 2); await page.mouse.down();
  await page.mouse.move(card.x + card.width / 2 - 18, card.y + card.height / 2 + 16, { steps: 5 }); await page.mouse.up();
  const individual = await nodePoints(page);
  expect(individual.worker).toEqual(keyboard.worker);
  expect(individual.api).not.toEqual(keyboard.api);
});

test('read-only category renderer removes previously active movement handlers and focus controls', async ({ page }) => {
  await seed(page);
  const result = await page.evaluate(async graph => {
    const { renderCategoryContainers } = await import('/src/map-categories.js');
    const { layoutGraph } = await import('/src/layout.js');
    const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const layout = layoutGraph(graph, { categoryFrames: true }); let moves = 0;
    renderCategoryContainers(layer, graph, layout, { onDrag: () => moves++, onMove: () => moves++ });
    let header = layer.querySelector('.category-header');
    header.dispatchEvent(new PointerEvent('pointerdown', { button: 0 }));
    renderCategoryContainers(layer, graph, layout);
    header = layer.querySelector('.category-header');
    header.dispatchEvent(new PointerEvent('pointerdown', { button: 0 }));
    header.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    return { moves, role: header.getAttribute('role'), tabindex: header.getAttribute('tabindex'), movable: header.classList.contains('is-movable') };
  }, model());
  expect(result).toEqual({ moves: 1, role: 'group', tabindex: null, movable: false });
});

test('legacy normal positions cannot overlap frames and frame moves persist without changing normal placement', async ({ page }) => {
  const graph = model();
  graph.nodes.forEach((node,index)=>node.position={x:index*300,y:(index%2)*70});
  await page.addInitScript(graph=>{
    if(!localStorage.getItem('project-atlas-library-v1'))localStorage.setItem('project-atlas-library-v1',JSON.stringify({version:1,activeId:'old',projects:[{id:'old',graph,updatedAt:1}]}));
  },graph);
  await page.goto('/workspace');
  const normal = await nodePoints(page), library = await page.evaluate(()=>localStorage.getItem('project-atlas-library-v1'));
  await page.locator('#category-frames-toggle').click();
  expect(await page.locator('.category-boundary').evaluateAll(rects=>{
    const boxes=rects.map(rect=>{const t=rect.parentElement.transform.baseVal.consolidate().matrix;return{x:t.e,y:t.f,w:Number(rect.getAttribute('width')),h:Number(rect.getAttribute('height'))};});
    return boxes.every((a,i)=>boxes.every((b,j)=>i===j||a.x+a.w+100<=b.x||b.x+b.w+100<=a.x||a.y+a.h+100<=b.y||b.y+b.h+100<=a.y));
  })).toBe(true);
  expect(await page.evaluate(()=>localStorage.getItem('project-atlas-library-v1'))).toBe(library);
  await dragHeader(page,'Experience',18,12);
  const framed = await nodePoints(page);
  const saved = await page.evaluate(()=>JSON.parse(localStorage.getItem('project-atlas-library-v1')).projects[0].graph);
  expect(saved.nodes.map(node=>node.position)).toEqual(graph.nodes.map(node=>node.position));
  expect(saved.nodes.find(node=>node.id==='web').framePosition.x).toBeCloseTo(framed.web.x,4);
  expect(saved.nodes.find(node=>node.id==='web').framePosition.y).toBeCloseTo(framed.web.y,4);
  await page.locator('#category-frames-toggle').click(); expect(await nodePoints(page)).toEqual(normal);
  await page.locator('#category-frames-toggle').click(); expect(await nodePoints(page)).toEqual(framed);
  await page.reload(); expect(await nodePoints(page)).toEqual(framed);
});
