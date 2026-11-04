import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const graph = {
  schemaVersion: 1,
  project: { name: 'Customer support architecture', description: 'A fictional support platform with a web client, request API and stored tickets. This example contains no customer data.' },
  nodes: [
    { id: 'client', label: 'Support portal', type: 'Frontend', group: 'Channels', description: 'Customers send requests from the web portal.' },
    { id: 'api', label: 'Request API', type: 'Service', group: 'Processing', source: 'src/api.ts', description: 'Validates requests and saves tickets.', inputs: ['Support requests'], outputs: ['Saved tickets'] },
    { id: 'db', label: 'Ticket database', type: 'Database', group: 'Storage' },
  ],
  edges: [{ id: 'calls', source: 'client', target: 'api', label: 'sends request' }, { id: 'writes', source: 'api', target: 'db', label: 'stores ticket' }],
};
async function seed(page, { width = 1280, theme = 'light', description } = {}) {
  await page.setViewportSize({ width, height: 844 });
  await page.addInitScript(({graph, theme}) => {
    localStorage.setItem('atlas-theme', theme);
    localStorage.setItem('project-atlas-library-v1', JSON.stringify({ version: 1, activeId: 'design', projects: [{ id: 'design', graph, updatedAt: 1 }] }));
  }, {graph: description ? {...graph, project: {...graph.project, description}} : graph, theme});
  await page.goto('/workspace');
  await expect(page.locator('.node-card')).toHaveCount(3);
  await expect(page.locator('#save-status')).toHaveText('Saved locally');
}
const library = page => page.evaluate(() => localStorage.getItem('project-atlas-library-v1'));

test('desktop typography, aligned workspace and exported labels agree without changing graph data', async ({ page }) => {
  await seed(page);
  const saved = await library(page);
  await expect(page.locator('#share-graph')).toBeVisible();
  await expect(page.locator('#project-actions-toggle')).toBeHidden();
  await expect(page.locator('body')).toHaveCSS('font-family', /Arial/);
  await page.locator('.node-card[data-node-id="api"]').click();
  await expect(page.locator('.detail-description').first()).toHaveCSS('font-size', '13px');
  await expect(page.locator('.card-type').filter({ hasText: 'Service' })).toHaveText('Service');
  const heading = await page.locator('.page-heading').boundingBox(), stage = await page.locator('#graph-stage').boundingBox();
  expect(stage.x - heading.x).toBe(24);
  await page.locator('#export-menu-button').click();
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download SVG', exact: true }).click();
  const svg = await readFile(await (await downloading).path(), 'utf8');
  expect(svg).toContain('font-family="Arial,Helvetica Neue,Helvetica,sans-serif"');
  expect(svg).toContain('>Service</text>');
  expect(svg).not.toContain('system-ui,sans-serif');
  expect(await library(page)).toBe(saved);
  await page.locator('#graph-fullscreen').click();
  // Subpixel font hinting must not widen labels beyond a card at overview scales.
  await page.locator('#viewport').evaluate(viewport => viewport.setAttribute('transform', 'translate(0 0) scale(.05)'));
  const widths = await page.locator('.card-title,.card-desc,.card-type').evaluateAll(labels => labels.map(text => text.getBBox().width));
  expect(Math.max(...widths)).toBeLessThan(174);
});

for (const theme of ['light', 'dark']) test(`${theme} phone menus support keyboard, nested export, Map tools and editor focus`, async ({ page }) => {
  await seed(page, { width: 390, theme });
  const actions = page.locator('#project-actions-toggle');
  await expect(page.locator('#project-actions')).toBeHidden();
  await expect(page.locator('#workspace-tool-actions')).toBeHidden();
  const stage = await page.locator('#graph-stage').boundingBox();
  expect(stage.y).toBeLessThan(350);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await actions.focus(); await page.keyboard.press('Enter');
  await expect(actions).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab'); await expect(page.locator('#share-graph')).toBeFocused();
  const menu = await page.locator('#project-actions').boundingBox();
  expect(menu.x).toBeGreaterThanOrEqual(0); expect(menu.y).toBeGreaterThanOrEqual(0); expect(menu.x + menu.width).toBeLessThanOrEqual(390);
  await page.locator('#export-menu-button').click();
  await expect(page.getByRole('button', { name: 'Download JSON', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#export-menu')).toBeHidden();
  await expect(page.locator('#project-actions')).toBeVisible();
  await page.locator('#map-tools').click();
  await page.locator('#open-checkpoints').click();
  await expect(page.locator('#checkpoint-dialog')).toBeVisible();
  await expect(page.locator('#project-actions')).toBeHidden();
  await page.keyboard.press('Escape');
  await actions.click(); await page.locator('#edit-project').click();
  await expect(page.locator('#project-modal')).toBeVisible();
  await expect(page.locator('#project-actions')).toBeHidden();
  expect(await page.locator('#project-modal').evaluate(dialog => dialog.contains(document.activeElement))).toBe(true);
  await page.locator('#project-name-input').focus();
  await expect(page.locator('#project-name-input')).toBeFocused();
  await expect(page.locator('#project-name-input')).toHaveCSS('font-size', '16px');
});

test('responsive menus retain control identity and focus through resizing', async ({ page }) => {
  await seed(page, { width: 390 });
  const saved = await library(page);
  await page.locator('#project-actions-toggle').click();
  await page.locator('#edit-project').focus();
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(page.locator('#project-actions-toggle')).toBeHidden();
  await expect(page.locator('#edit-project')).toBeFocused();
  await expect(page.locator('#edit-project')).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#project-actions-toggle')).toBeFocused();
  await expect(page.locator('#project-actions')).toBeHidden();
  expect(await library(page)).toBe(saved);
});

test('phone tools remain available in full screen; Escape closes menu before exiting graph', async ({ page }) => {
  await seed(page, { width: 390 });
  const saved = await library(page);
  await page.locator('#graph-fullscreen').click();
  await page.locator('#workspace-tools-toggle').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#workspace-tool-actions')).toBeHidden();
  await expect(page.locator('#workspace-tools-toggle')).toBeFocused();
  await expect(page.locator('#graph-fullscreen')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#workspace-tools-toggle').click();
  await page.locator('#category-frames-toggle').click();
  await expect(page.locator('.map-category')).toHaveCount(3);
  await expect(page.locator('#workspace-tool-actions')).toBeHidden();
  expect(await library(page)).toBe(saved);
  await page.locator('#workspace-tools-toggle').click(); await page.locator('#add-node').click();
  await expect(page.locator('#editor-modal')).toBeVisible();
  await expect(page.locator('#workspace-tool-actions')).toBeHidden();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(page.locator('#graph-fullscreen')).toHaveAttribute('aria-pressed', 'false');
});

test('320px long-title workspace keeps a two-line description and offers its full text without growing the header', async ({ page }) => {
  await seed(page, { width: 320 });
  await page.locator('#project-actions-toggle').click();
  await page.locator('#edit-project').click();
  await page.locator('#project-name-input').fill('A much longer fictional enterprise support platform architecture');
  const description = 'Detailed fictional architecture explanation. '.repeat(9);
  await page.locator('#project-description-input').fill(description);
  await page.locator('#save-project').click();
  await expect(page.locator('#project-description')).toHaveText(description.trim());
  await expect(page.locator('#project-description')).toHaveCSS('-webkit-line-clamp', '2');
  await page.getByRole('button', { name: 'Read full map description' }).click();
  await expect(page.locator('#project-description-more')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#project-description')).toHaveText(description.trim());
  await expect(page.locator('#project-description')).toHaveCSS('display', 'block');
  await expect(page.locator('#project-description-panel')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#project-description-more')).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#workspace-tools-toggle').click();
  const box = await page.locator('#workspace-tool-actions').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(320);
});

test('desktop header gives the map space and long sidebar names keep the same compact row height', async ({ page }) => {
  await page.addInitScript(({graph}) => {
    const longGraph = structuredClone(graph);
    longGraph.project.name = 'An exceptionally long fictional workspace name that should always truncate in the library';
    longGraph.project.description = 'A detailed fictional support platform explanation. '.repeat(9);
    localStorage.setItem('project-atlas-library-v1', JSON.stringify({version:1,activeId:'short',projects:[
      {id:'short',graph,updatedAt:1}, {id:'long',graph:longGraph,updatedAt:2},
    ]}));
    localStorage.setItem('atlas-theme','dark');
  }, {graph});
  await page.setViewportSize({width:1600,height:1000});
  await page.goto('/workspace');
  await expect(page.locator('.node-card')).toHaveCount(3);
  await expect(page.locator('#project-description-more')).toBeHidden();
  expect((await page.locator('#graph-stage').boundingBox()).y).toBeLessThan(270);
  const copy = await page.locator('.heading-copy').boundingBox();
  const summary = await page.locator('.project-description-row').boundingBox();
  const actions = await page.locator('.project-action-area').boundingBox();
  expect(summary.x + summary.width).toBeLessThanOrEqual(copy.x + copy.width + 1);
  expect(summary.x + summary.width).toBeLessThan(actions.x);
  const rows = await page.locator('.project-row').evaluateAll(rows => rows.map(row => ({height:row.getBoundingClientRect().height,meta:row.querySelector('.project-summary').textContent,wrapping:getComputedStyle(row.querySelector('.project-name')).whiteSpace,ellipsis:getComputedStyle(row.querySelector('.project-name')).textOverflow,updated:getComputedStyle(row.querySelector('.project-updated')).display,modified:row.querySelector('.project-updated').getAttribute('datetime')})));
  expect(rows).toHaveLength(2);
  for (const row of rows) {
    expect(row.height).toBe(50); expect(row.meta).toBe('3 components');
    expect(row.wrapping).toBe('nowrap'); expect(row.ellipsis).toBe('ellipsis'); expect(row.updated).not.toBe('none');
    expect(Number.isFinite(Date.parse(row.modified))).toBe(true);
  }
  await page.locator('.project-row-open').nth(1).click();
  await expect(page.locator('#project-title')).toContainText('exceptionally long');
  await page.setViewportSize({width:1280,height:1000});
  const description = await page.locator('#project-description').boundingBox();
  expect(description.height).toBeLessThanOrEqual(41);
  await page.getByRole('button', {name:'Read full map description'}).click();
  await expect(page.locator('#project-description')).toHaveCSS('display', 'block');
  await page.locator('#workspace-main').evaluate(main => main.dataset.workspaceLoading = 'skeleton');
  await expect(page.locator('#project-description-more')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#project-description-more')).toBeHidden();
  await page.locator('#workspace-main').evaluate(main => main.dataset.workspaceLoading = 'idle');
  await expect(page.locator('#project-description-more')).toBeVisible();
});

for (const theme of ['light', 'dark']) test(`${theme} description expands inline smoothly, preserves the camera and handles rapid toggles and outside clicks`, async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  const description = 'Detailed fictional platform architecture with multiple independent components and connected workflows. '.repeat(5).slice(0, 490);
  await seed(page, {width:1280, theme, description});
  const more = page.locator('#project-description-more'), clip = page.locator('#project-description-clip');
  await expect(more).toBeVisible();
  const collapsed = await clip.boundingBox(), mapBefore = await page.locator('#graph-stage').boundingBox();
  const cameraBefore = await page.locator('#viewport').getAttribute('transform');
  const button = await more.boundingBox();
  expect(button.x).toBeCloseTo(collapsed.x, 1); expect(button.y).toBeGreaterThanOrEqual(collapsed.y + collapsed.height - 1);
  const saved = await library(page);
  const samples = await more.evaluate(button => new Promise(resolve => {
    const clip = document.getElementById('project-description-clip');
    const before = clip.getBoundingClientRect().height, readings = [];
    button.click();
    const start = performance.now();
    function read() {
      readings.push(clip.getBoundingClientRect().height);
      if (performance.now() - start < 300) requestAnimationFrame(read);
      else resolve({before, readings, after:clip.getBoundingClientRect().height});
    }
    requestAnimationFrame(read);
  }));
  expect(samples.after).toBeGreaterThan(samples.before + 20);
  expect(samples.readings.some(height => height > samples.before + 1 && height < samples.after - 1)).toBe(true);
  const expandedMap = await page.locator('#graph-stage').boundingBox();
  expect(expandedMap.height).toBeLessThan(mapBefore.height - 20);
  expect(await page.locator('#viewport').getAttribute('transform')).toBe(cameraBefore);
  await page.locator('#project-description').click();
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#search').click();
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(async () => (await clip.boundingBox()).height).toBeCloseTo(collapsed.height, 1);
  await clip.click(); await expect(more).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape'); await expect(more).toBeFocused();
  await more.evaluate(button => {button.click(); button.click(); button.click();});
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  await page.setViewportSize({width:1100,height:844});
  await expect(page.locator('#project-description')).toHaveCSS('display','block');
  await page.emulateMedia({reducedMotion:'reduce'});
  await more.click();
  await expect(clip).not.toHaveAttribute('data-animating','true');
  await expect(page.locator('#project-description')).toHaveCSS('-webkit-line-clamp','2');
  expect(await library(page)).toBe(saved);
});

test('cloud skeleton reserves heading and description height before search on first load and hard refresh', async ({ page }) => {
  const fictional = {...graph, project:{...graph.project,description:'A complete fictional cloud description with many related components. '.repeat(7)}};
  await page.route('**/src/cloud-config.js', route => route.fulfill({contentType:'text/javascript',body:'export const firebaseConfig={}; export const isCloudConfigured=()=>true; export const getCloudConfigStatus=()=>({enabled:true});'}));
  const service = `export function createCloudService(){return {
    onAuthStateChanged(callback){queueMicrotask(()=>callback(null));return ()=>{};},
    async signInWithGoogle(){throw new Error('Sign-in is unavailable in this fictional fixture.');},
    async signOut(){},
    watchOwnedWorkspaces(callback){callback({status:'ready',workspaces:[]});return ()=>{};},
    watchWorkspace(target,callback){callback({status:'loading'});window.releaseFictionalWorkspace=()=>callback({status:'ready',workspace:{id:target.workspaceId,ownerId:'fictional-owner',name:'Cloud fixture',shared:true,currentRevision:1},graph:${JSON.stringify(fictional)}});return ()=>{};}
  };}`;
  await page.route('**/src/cloud-service.bundle.js', route => route.fulfill({contentType:'text/javascript',body:service}));
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  for (const width of [1280,390]) {
   await page.setViewportSize({width,height:844});
   await page.goto('/workspace?view='+'S'.repeat(22));
   for (let pass=0;pass<2;pass++) {
    if (pass) await page.reload();
    await expect(page.locator('#workspace-main')).toHaveAttribute('data-workspace-loading','skeleton');
    const search = await page.locator('.component-search').boundingBox();
    for (const selector of ['.workspace-heading-skeleton','.workspace-description-skeleton']) {
      const skeleton=await page.locator(selector).boundingBox();
      expect(skeleton.y+skeleton.height).toBeLessThanOrEqual(search.y-4);
    }
    await expect(page.locator('#project-description-more')).toBeHidden();
    await page.screenshot({path:test.info().outputPath(`cloud-loading-${width}-${pass}.png`)});
    await page.waitForFunction(()=>typeof window.releaseFictionalWorkspace==='function');
    await page.evaluate(()=>window.releaseFictionalWorkspace());
    await expect(page.locator('.node-card')).toHaveCount(3);
    await expect(page.locator('#workspace-main')).toHaveAttribute('data-workspace-loading','idle');
    await page.getByRole('button',{name:'Read full map description'}).click();
    await expect(page.locator('#project-description-more')).toHaveAttribute('aria-expanded','true');
    await page.keyboard.press('Escape');
   }
  }
  expect(errors).toEqual([]);
});
