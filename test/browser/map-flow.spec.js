import { test, expect } from '@playwright/test';

const legacyMap = () => ({ schemaVersion: 1, project: { name: 'Existing category map' }, nodes: [
  { id: 'web', label: 'Web client', type: 'Frontend', group: 'Clients', position: { x: 2, y: 3 } },
  { id: 'mobile', label: 'Mobile client', type: 'Frontend', group: 'Clients' },
  { id: 'api', label: 'Request API', type: 'API', group: 'Processing' },
  { id: 'worker', label: 'Worker', type: 'Job', group: 'Processing' },
  { id: 'data', label: 'Records', type: 'Database', group: 'Storage' },
  { id: 'mail', label: 'Email delivery', type: 'External', group: 'Delivery' },
], edges: [
  { id: 'web-api', source: 'web', target: 'api', label: 'submits' },
  { id: 'mobile-api', source: 'mobile', target: 'api', label: 'submits' },
  { id: 'dispatch', source: 'api', target: 'worker', label: 'dispatches' },
  { id: 'save', source: 'worker', target: 'data', label: 'stores' },
  { id: 'email', source: 'worker', target: 'mail', label: 'notifies' },
  { id: 'read', source: 'mobile', target: 'data', label: 'reads' },
] });

async function seed(page, theme = 'dark') {
  await page.addInitScript(({ graph, theme }) => {
    if (!localStorage.getItem('project-atlas-library-v1')) localStorage.setItem('project-atlas-library-v1', JSON.stringify({ version: 1, activeId: 'old-flow', projects: [{ id: 'old-flow', graph, updatedAt: 1 }] }));
    localStorage.setItem('atlas.category-frames.v1', JSON.stringify(['local:old-flow']));
    localStorage.setItem('atlas-theme', theme);
  }, { graph: legacyMap(), theme });
  await page.goto('/workspace');
  await expect(page.locator('.node-card')).toHaveCount(6);
  await expect(page.locator('.group-wire[data-kind="trunk"]')).toHaveCount(4);
}

test('an existing map receives directed per-pair terminals and exact path selection without a migration or data write', async ({ page }) => {
  await seed(page);
  const stored = await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'));
  const outputs = page.locator('[data-group-port="Processing"][data-direction="out"]');
  await expect(outputs).toHaveCount(2);
  const terminalPositions = await outputs.evaluateAll(items => items.map(item => item.getAttribute('transform')));
  expect(new Set(terminalPositions).size).toBe(2);
  await expect(outputs.first().locator('.group-port')).toHaveJSProperty('tagName', 'rect');
  await expect(page.locator('.group-wire .edge-arrow').first()).toHaveCSS('display', 'inline');
  const storeTrunk = page.locator('.group-wire[data-kind="trunk"]').filter({ has: page.locator('title', { hasText: 'Processing → Storage' }) });
  await storeTrunk.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.node-card.wire-endpoint')).toHaveCount(2);
  await expect(page.locator('.node-card[data-node-id="worker"]')).toHaveClass(/wire-endpoint/);
  await expect(page.locator('.node-card[data-node-id="data"]')).toHaveClass(/wire-endpoint/);
  await expect(page.locator('.group-wire[data-kind="branch"].selected')).toHaveCount(2);
  await expect(page.locator('.group-wire[data-node-id="data"][data-kind="branch"]:not(.selected)')).toHaveCount(1);
  const stage = await page.locator('#graph-stage').boundingBox();
  await page.mouse.click(stage.x + 30, stage.y + stage.height - 50);
  await expect(page.locator('.node-card.wire-endpoint,.node-card.wire-context-muted')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.group-wire[data-kind="trunk"]')).toHaveCount(4);
  expect(await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'))).toBe(stored);
});

for (const theme of ['light', 'dark']) test(`${theme} overview keeps every node while relationship labels remain available by keyboard and zoom`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, theme);
  const wire = page.locator('.group-wire[data-kind="trunk"]').filter({ hasText: '2 connections' });
  await expect(page.locator('#graph')).toHaveAttribute('data-connection-detail', 'overview');
  await expect(wire.locator('.edge-label')).toHaveCSS('visibility', 'hidden');
  await wire.focus();
  await expect(wire.locator('.edge-label')).toHaveCSS('visibility', 'visible');
  await page.keyboard.press('Enter');
  await expect(page.locator('.group-relationship')).toHaveCount(2);
  await expect(page.locator('.node-card')).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#close-inspector').click();
  for (let i = 0; i < 12; i++) await page.locator('#zoom-in').click();
  await expect(page.locator('#graph')).toHaveAttribute('data-connection-detail', 'detail');
  await expect(page.locator('[data-group-port="Clients"] .group-port-label').first()).toHaveCSS('visibility', 'visible');
});
