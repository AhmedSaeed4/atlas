import assert from "node:assert/strict";
import test from "node:test";
import { createLandingScene, projectScenePoint, orbitSceneCamera, easeSceneCamera, scenePolygonContains } from "../public/src/landing-scene.js";

test("the scene contains upright and horizontal world planes with independently returned geometry",()=>{
  const panels=createLandingScene();
  assert.equal(panels.length,5);
  assert.equal(panels.filter(p=>p.v.y===-1).length,2);
  assert.equal(panels.filter(p=>p.v.z===1).length,3);
  for(const panel of panels)for(const yaw of [-Math.PI,-.62,0,Math.PI/2])for(const pitch of [.18,.53,1.15])for(const [x,y] of [[0,0],[panel.w,0],[panel.w,panel.h],[0,panel.h]]) {
    const p=projectScenePoint({x:panel.o.x+panel.u.x*x+panel.v.x*y,y:panel.o.y+panel.u.y*x+panel.v.y*y,z:panel.o.z+panel.u.z*x+panel.v.z*y},{yaw,pitch});
    assert.ok(p&&[p.x,p.y,p.depth,p.perspective].every(Number.isFinite));
  }
  panels[0].o.x=100;
  assert.notEqual(createLandingScene()[0].o.x,100);
});

test("projection uses depth and rejects points behind the camera instead of producing invalid coordinates",()=>{
  const camera={yaw:0,pitch:0};
  assert.equal(projectScenePoint({x:1,y:1,z:0},camera).x,1);
  assert.ok(projectScenePoint({x:1,y:1,z:2},camera).x>1);
  assert.ok(projectScenePoint({x:1,y:1,z:-2},camera).x<1);
  assert.equal(projectScenePoint({x:1,y:1,z:24},camera),null);
  assert.equal(projectScenePoint({x:Infinity,y:1,z:1},camera),null);
});

test("orbit supports a complete turn while keeping pitch in a usable range and preserving input",()=>{
  const camera={yaw:0,pitch:.53};
  const after=orbitSceneCamera(camera,500,1000);
  assert.ok(Math.abs(after.yaw)<=Math.PI);
  assert.equal(after.pitch,1.15);
  assert.equal(orbitSceneCamera(camera,0,-1000).pitch,.18);
  assert.deepEqual(camera,{yaw:0,pitch:.53});
  const turned=projectScenePoint({x:1,y:.4,z:.3},after);
  assert.notEqual(turned.x,projectScenePoint({x:1,y:.4,z:.3},camera).x);
});

test("hover admission follows the projected window polygon, not its empty bounding-box corners",()=>{
  const polygon=[{x:10,y:0},{x:20,y:10},{x:10,y:20},{x:0,y:10}];
  assert.equal(scenePolygonContains({x:10,y:10},polygon),true);
  assert.equal(scenePolygonContains({x:1,y:1},polygon),false);
  assert.equal(scenePolygonContains({x:30,y:10},polygon),false);
  assert.equal(scenePolygonContains({x:NaN,y:0},polygon),false);
});

test("camera easing takes the short arc across the full-turn boundary",()=>{
  const current={yaw:Math.PI-.02,pitch:.6},target={yaw:-Math.PI+.02,pitch:.8};
  const next=easeSceneCamera(current,target,.5);
  assert.ok(Math.abs(next.yaw)>3.1);
  assert.ok(Math.abs(next.pitch-.7)<1e-9);
  assert.deepEqual(easeSceneCamera(current,target,1),target);
});
