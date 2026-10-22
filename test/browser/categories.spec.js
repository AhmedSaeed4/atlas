import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

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

test('normal maps stay normal and optional frames keep every real node and wire visible', async ({ page }) => {
  await seed(page, { frames: false });
  await expect(page.locator('.map-category')).toHaveCount(0);
  await expect(page.locator('.edge-group')).toHaveCount(4);
  const canonical = await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'));
  const positions = await page.locator('.node-card').evaluateAll(cards => cards.map(card => card.getAttribute('transform')));
  const ids = await page.locator('.edge-group').evaluateAll(edges => edges.map(edge => edge.dataset.edgeId));
  const paths = await page.locator('.edge-path').evaluateAll(edges => edges.map(edge => edge.getAttribute('d')));
  await page.locator('#category-frames-toggle').click();
  await expect(page.locator('.map-category')).toHaveCount(2);
  await expect(page.locator('.node-card')).toHaveCount(5);
  await expect(page.locator('.view-group-card')).toHaveCount(0);
  expect(await page.locator('.edge-group').evaluateAll(edges => edges.map(edge => edge.dataset.edgeId))).toEqual(ids);
  await expect(page.locator('[data-edge-id="api-worker"] .edge-label')).toHaveCSS('visibility', 'visible');
  await expect(page.locator('.category-header[role="button"]')).toHaveCount(0);
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

test('a single-node category keeps its wire attached to the actual component', async ({ page }) => {
  await seed(page);
  await editCategory(page, 'db', 'Storage');
  await expect(page.locator('[data-category-header="Storage"] .category-count')).toHaveText('1');
  await expect(page.locator('.node-card')).toHaveCount(5);
  await expect(page.locator('.edge-group')).toHaveCount(4);
  expect(await page.evaluate(() => {
    const node = document.querySelector('.node-card[data-node-id="db"]');
    const position = node.transform.baseVal.consolidate().matrix;
    const height = Number(node.querySelector('.card-bg').getAttribute('height'));
    const path = document.querySelector('[data-edge-id="worker-db"] .edge-path');
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
  await expect(page.locator('.edge-group')).toHaveCount(4);
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
  const rect = await card.boundingBox();
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await page.mouse.down(); await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2 + 80, { steps: 8 }); await page.mouse.up();
  await expect.poll(async () => Number(await page.locator('[data-category="Experience"] .category-boundary').getAttribute('height'))).toBeGreaterThan(height);
  expect(await page.evaluate(() => window.categoryDraggedCard === document.querySelector('.node-card[data-node-id="mobile"]'))).toBe(true);
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
    { id: 'source', label: 'Source API', type: 'API', group: 'Interface', position: { x: 0, y: 100 } },
    { id: 'other', label: 'Unrelated job', type: 'Job', group: 'Unrelated', position: { x: 350, y: 100 } },
    { id: 'target', label: 'Target store', type: 'Database', group: 'Storage', position: { x: 800, y: 100 } },
  ], edges: [{ id: 'crossing', source: 'source', target: 'target', label: 'stores' }] };
  await page.addInitScript(graph => localStorage.setItem('project-atlas-library-v1', JSON.stringify({ version: 1, activeId: 'route', projects: [{ id: 'route', graph, updatedAt: 1 }] })), graph);
  await page.goto('/workspace');
  await page.locator('#category-frames-toggle').click();
  const route = page.locator('[data-edge-id="crossing"] .edge-path');
  const before = await route.getAttribute('d');
  expect(before).toContain(' Q ');
  const avoidsBoundary = () => page.evaluate(() => {
    const path = document.querySelector('[data-edge-id="crossing"] .edge-path');
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
  }
});
