import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

async function pauseEntry(page,entry){
  let release;
  const wait=new Promise(resolve=>{release=resolve;});
  await page.route('**/src/'+entry,async route=>{await wait;await route.continue();});
  return release;
}
async function seed(page){
  await page.addInitScript(()=>{
    if(!localStorage.getItem('project-atlas-library-v1'))localStorage.setItem('project-atlas-library-v1',JSON.stringify({version:1,activeId:'startup-test',projects:[{id:'startup-test',updatedAt:1,graph:{schemaVersion:1,project:{name:'Disposable startup map'},nodes:[{id:'api',label:'Fictional API',type:'Service'}],edges:[]}}]}));
  });
}

for(const [path,entry,container] of [['/','landing.js','.landing-shell'],['/workspace','app.js','.app-shell'],['/admin','admin-page.js','main']]){
  test(`${path} shows delayed startup feedback and fades it away when its shell is ready`,async({page})=>{
    await seed(page);await page.emulateMedia({reducedMotion:'no-preference'});
    const release=await pauseEntry(page,entry);
    try{
      await page.goto(path,{waitUntil:'commit'});
      await expect(page.locator('#page-startup')).toBeVisible();
      await expect(page.locator(container)).toHaveJSProperty('inert',true);
      await expect(page.locator('#page-startup')).toHaveCSS('transition-duration','0.2s');
      await expect(page.locator('#startup-message')).toHaveText('Loading Atlas…');
      release();
      await expect(page.locator('html')).toHaveAttribute('data-startup-state','leaving');
      await expect(page.locator('#page-startup')).toHaveCount(0);
      await expect(page.locator(container)).toHaveJSProperty('inert',false);
      await expect(page.locator('html')).toHaveAttribute('data-startup-state','ready');
    }finally{release();}
  });
}

test('fast readiness skips the overlay and reduced motion removes entrance/fade movement',async({page})=>{
  const source=await readFile(new URL('../../public/src/page-startup.js',import.meta.url),'utf8');
  await page.route('**/src/page-startup.js',route=>route.fulfill({contentType:'text/javascript',body:source+'\nwindow.AtlasStartup.ready();'}));
  await page.addInitScript(()=>{window.startupMounts=0;new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.id==='page-startup')window.startupMounts++;}).observe(document,{childList:true,subtree:true});});
  await page.goto('/privacy',{waitUntil:'networkidle'});
  expect(await page.evaluate(()=>window.startupMounts)).toBe(0);
  await expect(page.locator('#page-startup')).toHaveCount(0);
  await page.unroute('**/src/page-startup.js');
  const release=await pauseEntry(page,'landing.js');
  try{
    await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/',{waitUntil:'commit'});
    await expect(page.locator('#page-startup')).toBeVisible();
    await expect(page.locator('.startup-track i')).toHaveCSS('animation-name','none');
    expect(await page.locator('#page-startup').evaluate(el=>parseFloat(getComputedStyle(el).transitionDuration))).toBeLessThan(.001);
    release();await expect(page.locator('html')).toHaveAttribute('data-startup-state','ready');
  }finally{release();}
});

test('failed entry offers Retry/Continue/Help, and retry keeps the map and address',async({page})=>{
  await seed(page);let attempts=0;
  await page.route('**/src/app.js',route=>++attempts===1?route.abort('failed'):route.continue());
  await page.goto('/workspace?startup-check=1#kept');
  await expect(page.locator('html')).toHaveAttribute('data-startup-state','error');
  await expect(page.locator('#startup-retry')).toBeFocused();
  await expect(page.locator('.startup-actions a')).toHaveAttribute('href','./help#troubleshooting');
  await expect(page.locator('#startup-continue')).toBeVisible();
  await page.locator('#startup-retry').click();
  await expect(page.locator('#project-title')).toHaveText('Disposable startup map');
  await expect(page.locator('#page-startup')).toHaveCount(0);
  await expect(page).toHaveURL(/\/workspace\?startup-check=1#kept$/);
  expect(attempts).toBe(2);
  await expect(page.locator('.node-card')).toHaveCount(1);
});

test('slow startup has an escape after ten seconds without deleting stored work',async({page})=>{
  await seed(page);await page.clock.install();const release=await pauseEntry(page,'app.js');
  try{
    await page.goto('/workspace',{waitUntil:'commit'});await expect(page.locator('#page-startup')).toBeVisible();
    const saved=await page.evaluate(()=>localStorage.getItem('project-atlas-library-v1'));
    await page.clock.fastForward(10000);
    await expect(page.locator('#startup-message')).toContainText('taking longer');
    await page.locator('#startup-continue').click();
    await expect(page.locator('#page-startup')).toHaveCount(0);
    await expect(page.locator('.app-shell')).toHaveJSProperty('inert',false);
    expect(await page.evaluate(()=>localStorage.getItem('project-atlas-library-v1'))).toBe(saved);
  }finally{release();}
});

test('cloud fetching does not keep the startup overlay over the usable workspace',async({page})=>{
  await page.route('https://**/*',route=>route.abort('blockedbyclient'));
  const release=await pauseEntry(page,'cloud-service.bundle.js');
  try{
    await page.goto('/workspace?view=abcdefghijklmnopqrstuvwx12345678',{waitUntil:'domcontentloaded'});
    await expect(page.locator('html')).toHaveAttribute('data-startup-state','ready');
    await expect(page.locator('#graph-fullscreen')).toBeVisible();
    await expect(page.locator('#page-startup')).toHaveCount(0);
  }finally{release();}
});

test('a missing loader script cannot lock the working application behind an overlay',async({page})=>{
  await seed(page);await page.route('**/src/page-startup.js',route=>route.abort('failed'));
  await page.goto('/workspace');await expect(page.locator('#project-title')).toHaveText('Disposable startup map');
  await expect(page.locator('#page-startup')).toHaveCount(0);
  await page.locator('.node-card').press('Enter');await expect(page.locator('#inspector')).toBeVisible();
});
