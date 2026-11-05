import {test,expect} from '@playwright/test';
import {createShareUrl} from '../../public/src/share.js';
import {normalizeGraph} from '../../public/src/schema.js';

test.use({hasTouch:true,viewport:{width:390,height:844}});
const graph={schemaVersion:1,project:{name:'Disposable touch map'},nodes:[
  {id:'client',label:'Fictional client',type:'Frontend'},
  {id:'api',label:'Fictional API',type:'Service'},
],edges:[{id:'calls',source:'client',target:'api',label:'calls'}]};
async function seed(page){
 await page.addInitScript(graph=>localStorage.setItem('project-atlas-library-v1',JSON.stringify({version:1,activeId:'touch',projects:[{id:'touch',graph,updatedAt:1}]})),graph);
 await page.goto('/workspace');await expect(page.locator('.node-card')).toHaveCount(2);
 await page.locator('#graph-stage').scrollIntoViewIfNeeded();
}
const camera=page=>page.locator('#viewport').evaluate(el=>{const m=el.transform.baseVal.consolidate().matrix;return{x:m.e,y:m.f,scale:m.a};});
const snapshot=page=>page.evaluate(()=>localStorage.getItem('project-atlas-library-v1'));
async function gesture(page,points,moves,{cancel=false}={}){
 const session=await page.context().newCDPSession(page);
 try{
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});
  for(const touchPoints of moves)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints});
  await session.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});
 }finally{await session.detach();}
}
test('finger drags over nodes pan without editing or selecting; pinch zooms and remaining finger pans',async({page})=>{
 await seed(page);const saved=await snapshot(page),before=await camera(page);
 const box=await page.locator('.node-card').first().boundingBox();
 const p={x:box.x+box.width/2,y:box.y+box.height/2,id:1};
 await gesture(page,[p],[[{...p,x:p.x+35,y:p.y-25}],[{...p,x:p.x+60,y:p.y-40}]]);
 const pan=await camera(page);expect(pan.x-before.x).toBeCloseTo(60,0);expect(pan.y-before.y).toBeCloseTo(-40,0);expect(pan.scale).toBeCloseTo(before.scale,5);
 expect(await snapshot(page)).toBe(saved);await expect(page.locator('#inspector')).toBeHidden();
 await expect(page.locator('.canvas-help')).toContainText('Pinch to zoom');
 const stage=await page.locator('#graph-stage').boundingBox(),x=stage.x+stage.width/2,y=stage.y+100;
 const session=await page.context().newCDPSession(page);
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-35,y,id:1},{x:x+35,y,id:2}]});
 await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-65,y,id:1},{x:x+65,y,id:2}]});
 const pinch=await camera(page);expect(pinch.scale).toBeGreaterThan(pan.scale*1.7);
 await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[{x:x+65,y,id:2}]});
 await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-45,y:y+20,id:1}]});
 await expect.poll(async()=>Math.round((await camera(page)).x-pinch.x)).toBe(20);
 const remaining=await camera(page);expect(remaining.scale).toBeCloseTo(pinch.scale,5);
 await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();
 expect(await snapshot(page)).toBe(saved);await expect(page.locator('#inspector')).toBeHidden();
});
for(const theme of ['light','dark'])test(`${theme} phone tap opens a short details sheet, map stays navigable and empty tap closes it`,async({page})=>{
 await seed(page);await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
 const before=await page.locator('#graph-stage').boundingBox();
 await page.locator('.node-card').first().tap();await expect(page.locator('#inspector')).toBeVisible();
 const sheet=await page.locator('#inspector').boundingBox(),after=await page.locator('#graph-stage').boundingBox();
 expect(sheet.height).toBeLessThan(before.height*.5);expect(after.width).toBe(before.width);expect(after.height).toBe(before.height);
 const a={x:after.x+after.width-15,y:after.y+90,id:1},view=await camera(page);
 await gesture(page,[a],[[{...a,x:a.x-25,y:a.y+20}]]);expect((await camera(page)).x).not.toBe(view.x);
 await page.locator('#expand-inspector').click();expect((await page.locator('#inspector').boundingBox()).height).toBeGreaterThan(sheet.height);
 await page.locator('#expand-inspector').click();
 await page.touchscreen.tap(after.x+after.width-12,after.y+55);await expect(page.locator('#inspector')).toBeHidden();
 await page.locator('#graph-fullscreen').click();await expect(page.locator('#graph-fullscreen')).toHaveAttribute('aria-pressed','true');
 await page.locator('.node-card').first().tap();await expect(page.locator('#inspector')).toBeVisible();
 const full=await page.locator('#graph-stage').boundingBox();expect((await page.locator('#inspector').boundingBox()).height).toBeLessThan(full.height*.5);
});

test('cancelled gestures do not select or edit, and the next gesture works',async({page})=>{
 await seed(page);const saved=await snapshot(page),stage=await page.locator('#graph-stage').boundingBox();
 const p={id:1,x:stage.x+stage.width/2,y:stage.y+110};
 await gesture(page,[p],[[{...p,x:p.x+20}]],{cancel:true});
 const before=await camera(page);
 await gesture(page,[p],[[{...p,y:p.y+30}]]);
 expect((await camera(page)).y-before.y).toBeCloseTo(30,0);expect(await snapshot(page)).toBe(saved);
 await expect(page.locator('#inspector')).toBeHidden();
});

test('shared snapshots support anchored pinch out without modifying the map',async({page})=>{
 const url=await createShareUrl(normalizeGraph(graph),'http://127.0.0.1:4199/workspace');
 await page.goto(url);await expect(page.locator('.node-card')).toHaveCount(2);
 await page.locator('#graph-stage').scrollIntoViewIfNeeded();
 const saved=await snapshot(page);
 const stage=await page.locator('#graph-stage').boundingBox(),x=stage.x+stage.width/2,y=stage.y+100;
 const before=await camera(page);
 await gesture(page,[{id:1,x:x-50,y},{id:2,x:x+50,y}],[[{id:1,x:x-25,y},{id:2,x:x+25,y}]]);
 const next=await camera(page);expect(next.scale).toBeCloseTo(before.scale/2,4);
 const originX=x-stage.x-1,originY=y-stage.y-1;
 expect((originX-next.x)/next.scale).toBeCloseTo((originX-before.x)/before.scale,1);
 expect((originY-next.y)/next.scale).toBeCloseTo((originY-before.y)/before.scale,1);
 await page.locator('.node-card').first().tap();await expect(page.locator('#inspector')).toBeVisible();
 expect(await snapshot(page)).toBe(saved);
});

test('touch navigation holds flow motion only while moving, avoids redundant pan labels and respects manual pause',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await seed(page);
 await expect(page.locator('.edge-beam')).toHaveCount(1);
 await expect(page.locator('.edge-path.draw-in')).toHaveCount(0);
 const paused=()=>page.locator('#graph').evaluate(svg=>svg.animationsPaused());
 await expect.poll(paused).toBe(false);
 const stored=await snapshot(page),stage=await page.locator('#graph-stage').boundingBox();
 const p={id:1,x:stage.x+stage.width/2,y:stage.y+110};
 const session=await page.context().newCDPSession(page);
 try{
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});
  expect(await paused()).toBe(false);
  await page.evaluate(()=>{
   window.panUiWrites=0;
   window.panUiObserver=new MutationObserver(records=>window.panUiWrites+=records.length);
   window.panUiObserver.observe(document.getElementById('graph'),{attributes:true,attributeFilter:['data-connection-detail']});
   window.panUiObserver.observe(document.getElementById('zoom-label'),{childList:true});
  });
  for(let step=1;step<=8;step++)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...p,x:p.x+step*3,y:p.y+step*2}]});
  expect(await paused()).toBe(true);
  expect(await page.evaluate(()=>{window.panUiObserver.disconnect();return window.panUiWrites;})).toBe(0);
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  expect(await paused()).toBe(false);
  await page.locator('#workspace-tools-toggle').click();await page.locator('#pause-motion').click();
  expect(await paused()).toBe(true);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...p,x:p.x+20}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  expect(await paused()).toBe(true);
  await page.locator('#workspace-tools-toggle').click();await page.locator('#pause-motion').click();
  expect(await paused()).toBe(false);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...p,x:p.x+30}]});
  expect(await paused()).toBe(true);
  await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  expect(await paused()).toBe(false);
 }finally{await session.detach();}
 expect(await snapshot(page)).toBe(stored);
 await expect(page.locator('#inspector')).toBeHidden();
});
