import assert from "node:assert/strict";
import test from "node:test";
import { createLandingScene, projectScenePoint, orbitSceneCamera, easeSceneCamera, scenePolygonContains, sceneMotionStep, sceneCanvasFrame } from "../public/src/landing-scene.js";

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

test("camera damping has the same timing on 30, 60 and 120 Hz displays and bounds suspended frames", () => {
  const target = { yaw: .8, pitch: .9 };
  const run = hz => {
    let camera = { yaw: -.8, pitch: .4 };
    for (let i = 0; i < hz / 2; i++) camera = easeSceneCamera(camera, target, sceneMotionStep(1000 / hz));
    return camera;
  };
  const reference = run(60);
  for (const hz of [30, 120]) {
    assert.ok(Math.abs(run(hz).yaw - reference.yaw) < 1e-12);
    assert.ok(Math.abs(run(hz).pitch - reference.pitch) < 1e-12);
  }
  assert.equal(sceneMotionStep(-10), 0);
  assert.equal(sceneMotionStep(30000), sceneMotionStep(64));
  for (const elapsed of [0, 8, 16, 64, NaN, Infinity]) {
    assert.ok(Number.isFinite(sceneMotionStep(elapsed)));
    assert.ok(sceneMotionStep(elapsed) >= 0 && sceneMotionStep(elapsed) < 1);
  }
});

test("one fixed expanded canvas contains the complete orbit while preserving the original desktop size and center", () => {
  const panels = createLandingScene(), home = { yaw: -.8, pitch: .6 };
  const corners = panel => [[0, 0], [panel.w, 0], [panel.w, panel.h], [0, panel.h]].map(([x, y]) => ({
    x: panel.o.x + panel.u.x * x + panel.v.x * y,
    y: panel.o.y + panel.u.y * x + panel.v.y * y,
    z: panel.o.z + panel.u.z * x + panel.v.z * y
  }));
  const points = panels.flatMap(panel => corners(panel).flatMap(p => {
    const back = { ...p, y: p.y - (panel.v.z ? .037 : 0), z: p.z - (panel.v.y ? .037 : 0) };
    return [p, back, { ...p, y: p.y + .075 }, { ...back, y: back.y + .075 }, ...(panel.v.z ? [{ x: p.x + .08, y: -.087, z: p.z + .07 }] : [])];
  }));
  for (const x of [-.43, .47]) for (const y of [-.01, .95]) for (const z of [.25, 1.05]) points.push({ x, y, z });
  for (const x of [-.42, .56]) for (const z of [.32, 1.16]) points.push({ x, y: -.09, z });
  const original = panels.flatMap(corners).map(p => projectScenePoint(p, home));
  const minX = Math.min(...original.map(p => p.x)), maxX = Math.max(...original.map(p => p.x));
  const minY = Math.min(...original.map(p => p.y)), maxY = Math.max(...original.map(p => p.y));
  let formerBottomCrop = false, formerSideCrop = false;
  for (const [width, height, viewport, left] of [[352.328125, 405, 977, 561.171875], [423.8, 410.8, 1012, 556.2], [527, 512, 1265, 690], [339, 335, 375, 18], [284, 320, 305, 18]]) {
    const frame = sceneCanvasFrame(width, height, viewport, left);
    const stable = structuredClone(frame);
    const originalScale = Math.max(1, Math.min((width - 28) / (maxX - minX), (height - 38) / (maxY - minY)));
    const originalOffset = { x: width / 2 - (minX + maxX) * originalScale / 2, y: height / 2 - (minY + maxY) * originalScale / 2 };
    if (viewport >= 375) assert.equal(frame.scale, originalScale, "normal desktop and phone size must remain unchanged");
    if (viewport > 850) {
      assert.ok(Math.abs(frame.offset.x - frame.room.left - originalOffset.x) < 1e-9);
      assert.ok(Math.abs(frame.offset.y - frame.room.top - originalOffset.y) < 1e-9);
    }
    assert.ok(frame.width > width && frame.height > height, "the drawing area must expand rather than refit while turning");
    // The same frame is used for every angle, including fractional sample angles.
    for (let step = 0; step <= 144; step++) for (const pitch of [.18, .273, .409, .6, .819, .97, 1.15]) {
      const camera = { yaw: -Math.PI + (step + .37) * Math.PI / 72, pitch };
      for (const point of points) {
        const p = projectScenePoint(point, camera);
        const x = frame.offset.x + p.x * frame.scale, y = frame.offset.y + p.y * frame.scale;
        assert.ok(x >= 20 - 1e-8 && x <= frame.width - 20 + 1e-8, "fixed canvas side gutter");
        assert.ok(y >= 20 - 1e-8 && y <= frame.height - 20 + 1e-8, "fixed canvas vertical gutter");
        const pageX = left - frame.room.left + x;
        assert.ok(pageX >= 4 - 1e-8 && pageX <= viewport - 4 + 1e-8, "even a narrow screen must show the outer corners");
        const oldX = originalOffset.x + p.x * originalScale, oldY = originalOffset.y + p.y * originalScale;
        formerSideCrop ||= oldX < 0 || oldX > width;
        formerBottomCrop ||= oldY > height;
      }
    }
    assert.deepEqual(frame, stable);
    assert.deepEqual(sceneCanvasFrame(width, height, viewport, left), stable);
  }
  assert.ok(formerBottomCrop && formerSideCrop, "the sweep must reproduce both old edge crops");
});
