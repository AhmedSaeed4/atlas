import assert from "node:assert/strict";
import test from "node:test";
import { createLandingScene, createSceneLogo, projectScenePoint, orbitSceneCamera, easeSceneCamera, scenePolygonContains, sceneMotionStep, sceneCanvasFrame, createSceneIdleReturn, sceneHomeReturnCamera } from "../public/src/landing-scene.js";

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

test("the rounded Atlas mark is four closed solids with outward unit normals and distinct front/back caps", () => {
  const faces = createSceneLogo();
  const snapshot = structuredClone(faces);
  for (let tile = 0; tile < 4; tile++) {
    const mesh = faces.filter(face => face.tile === tile);
    const points = mesh.flatMap(face => face.points);
    const center = Object.fromEntries(["x", "y", "z"].map(key => [key, (Math.min(...points.map(p => p[key])) + Math.max(...points.map(p => p[key]))) / 2]));
    const edges = new Map();
    const key = p => [p.x, p.y, p.z].map(n => n.toFixed(9)).join(",");
    assert.equal(mesh.filter(face => face.cap).length, 2);
    assert.deepEqual(mesh.filter(face => face.cap).map(face => Math.sign(face.normal[2])).sort(), [-1, 1]);
    for (const face of mesh) {
      assert.ok(Math.abs(Math.hypot(...face.normal) - 1) < 1e-9);
      assert.ok(face.normal[0] * (face.center.x - center.x) + face.normal[1] * (face.center.y - center.y) + face.normal[2] * (face.center.z - center.z) > 0, "inverted normals would hide outward faces during a turn");
      assert.equal(face.muted, tile === 1 || tile === 2);
      face.points.forEach((point, i) => {
        assert.ok(Object.values(point).every(Number.isFinite));
        const a = key(point), b = key(face.points[(i + 1) % face.points.length]);
        assert.notEqual(a, b, "no zero-length bevel edges");
        const id = [a, b].sort().join("|");
        const entry = edges.get(id) || [];
        entry.push([a, b]); edges.set(id, entry);
      });
    }
    for (const pair of edges.values()) {
      assert.equal(pair.length, 2, "each edge must join exactly two faces, including both caps");
      assert.deepEqual(pair[0], [...pair[1]].reverse(), "shared edge winding must oppose its neighbour");
    }
    // The complete model stays inside the already allocated logo/plinth envelope.
    for (const p of points) {
      assert.ok(p.x >= -.43 && p.x <= .47 && p.y >= .25 && p.y <= .95 && p.z >= .25 && p.z <= 1.05);
    }
  }
  assert.deepEqual(faces, snapshot);
  faces[0].points[0].x = 100;
  assert.notEqual(createSceneLogo()[0].points[0].x, 100);
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
  const logoVertices = new Map(createSceneLogo().flatMap(face => face.points).map(p => [JSON.stringify(p), p]));
  points.push(...logoVertices.values());
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


function idleClock() {
  let time = 0, nextId = 0;
  const jobs = new Map();
  return {
    now: () => time,
    schedule(callback, delay) { const id = nextId++; jobs.set(id, { callback, at: time + delay }); return id; },
    cancel(id) { jobs.delete(id); },
    pending: () => [...jobs.values()],
    advance(elapsed) {
      const target = time + elapsed;
      for (;;) {
        const next = [...jobs.entries()].filter(([, job]) => job.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        jobs.delete(next[0]); time = next[1].at; next[1].callback();
      }
      time = target;
    }
  };
}

test("the idle return waits five seconds after the most recent input and fires only once", () => {
  const clock = idleClock(), calls = [];
  const idle = createSceneIdleReturn(() => calls.push(clock.now()), clock);
  clock.advance(8000);
  assert.deepEqual(calls, []);
  idle.interact();
  const oldCallback = clock.pending()[0].callback;
  clock.advance(4999);
  assert.deepEqual(calls, []);
  idle.interact();
  oldCallback(); // A superseded callback must not reset a newly interacted-with scene.
  assert.deepEqual(calls, []);
  assert.equal(clock.pending().length, 1);
  clock.advance(4999);
  assert.deepEqual(calls, []);
  clock.advance(1);
  assert.deepEqual(calls, [17999]);
  clock.advance(20000);
  assert.equal(calls.length, 1, "returning home must not schedule ongoing idle polling");
});

test("holding a pointer prevents return until five seconds after release", () => {
  const clock = idleClock(), calls = [];
  const idle = createSceneIdleReturn(() => calls.push(clock.now()), clock);
  idle.interact();
  clock.advance(2000);
  idle.interact(true);
  assert.equal(clock.pending().length, 0);
  clock.advance(15000);
  idle.interact(true);
  clock.advance(15000);
  assert.deepEqual(calls, []);
  idle.interact(false);
  clock.advance(4999);
  assert.deepEqual(calls, []);
  clock.advance(1);
  assert.deepEqual(calls, [37000]);
});

test("hidden or offscreen pauses and manual reset discard stale idle deadlines", () => {
  const clock = idleClock(), calls = [];
  const idle = createSceneIdleReturn(() => calls.push(clock.now()), clock);
  idle.interact();
  clock.advance(2000);
  const beforePause = clock.pending()[0].callback;
  idle.pause();
  beforePause();
  clock.advance(10000);
  assert.deepEqual(calls, []);
  assert.equal(clock.pending().length, 0);
  idle.resume();
  clock.advance(4000);
  idle.resume(); // An ordinary visibility observation must not restart a running deadline.
  clock.advance(999);
  assert.deepEqual(calls, []);
  clock.advance(1);
  assert.deepEqual(calls, [17000]);
  idle.interact();
  const beforeReset = clock.pending()[0].callback;
  idle.cancel();
  beforeReset();
  clock.advance(10000);
  assert.equal(calls.length, 1);
  assert.equal(clock.pending().length, 0);
});

test("the slow home return follows the short arc, eases at both ends and finishes exactly at home", () => {
  const from = { yaw: 2.9, pitch: .99 }, home = { yaw: -.8, pitch: .6 };
  const distance = camera => Math.hypot(Math.atan2(Math.sin(home.yaw - camera.yaw), Math.cos(home.yaw - camera.yaw)), home.pitch - camera.pitch);
  assert.deepEqual(sceneHomeReturnCamera(from, 0), from);
  assert.deepEqual(sceneHomeReturnCamera(from, -10), from);
  let previous = distance(from);
  for (let elapsed = 10; elapsed <= 2400; elapsed += 10) {
    const camera = sceneHomeReturnCamera(from, elapsed);
    assert.ok(distance(camera) <= previous + 1e-12, "the camera must approach home without an overshoot");
    previous = distance(camera);
  }
  const halfway = sceneHomeReturnCamera(from, 1200);
  assert.ok(halfway.yaw < -2, "return must cross the full-turn boundary along the short arc");
  assert.ok(Math.abs(distance(halfway) - distance(from) / 2) < 1e-12);
  const firstStep = distance(from) - distance(sceneHomeReturnCamera(from, 10));
  const middleStep = distance(sceneHomeReturnCamera(from, 1200)) - distance(sceneHomeReturnCamera(from, 1210));
  const lastStep = distance(sceneHomeReturnCamera(from, 2390));
  assert.ok(firstStep < middleStep / 20 && lastStep < middleStep / 20, "start and finish must be gentle");
  assert.deepEqual(sceneHomeReturnCamera(from, 2400), home);
  assert.deepEqual(sceneHomeReturnCamera(from, 30000), home);
  assert.deepEqual(from, { yaw: 2.9, pitch: .99 });
});
