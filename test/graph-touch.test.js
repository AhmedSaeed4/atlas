import test from 'node:test';
import assert from 'node:assert/strict';
import { touchCamera, bindGraphTouch } from '../public/src/graph-touch.js';

test('touch pan moves the viewport without changing its zoom', () => {
  assert.deepEqual(touchCamera({x:20,y:-30,scale:.8},{x:100,y:200},{x:140,y:180}),{x:60,y:-50,scale:.8});
});
test('pinch retains the world point beneath the moving finger midpoint', () => {
  const view={x:-50,y:30,scale:.5},origin={x:150,y:100},current={x:170,y:120};
  const next=touchCamera(view,origin,current,2);
  assert.equal((origin.x-view.x)/view.scale,(current.x-next.x)/next.scale);
  assert.equal((origin.y-view.y)/view.scale,(current.y-next.y)/next.scale);
  assert.equal(next.scale,1);
});
test('pinch clamps at the same map zoom limits while keeping its anchor', () => {
  const view={x:0,y:0,scale:1},origin={x:100,y:100};
  for(const [ratio,expected] of [[100,2.5],[.00001,.001]]) {
    const next=touchCamera(view,origin,origin,ratio);
    assert.equal(next.scale,expected);assert.ok(Math.abs((100-next.x)/next.scale-100)<1e-7);
  }
});

function touchFixture() {
  const document = new EventTarget(), window = new EventTarget(), surface = new EventTarget();
  document.defaultView = window;
  surface.ownerDocument = document;
  let reads = 0, view = { x: 0, y: 0, scale: 1 }, currentScope = {}, taps = 0;
  const lifecycle = [];
  surface.getBoundingClientRect = () => { reads++; return { left: 10, top: 20 }; };
  const controller = bindGraphTouch(surface, {
    readCamera: () => view, writeCamera: next => { view = next; }, onStart() {}, onEmptyTap: () => taps++, scope: () => currentScope,
    onNavigateStart: () => lifecycle.push(['start', controller.isNavigating()]),
    onNavigateEnd: () => lifecycle.push(['end', controller.isNavigating()]),
  });
  const pointer = (type, x = 110, y = 120, id = 1) => {
    const event = Object.assign(new Event(type, { cancelable: true }), { pointerType: 'touch', pointerId: id, clientX: x, clientY: y });
    (type === 'pointerdown' ? surface : document).dispatchEvent(event);
  };
  return { document, window, pointer, controller, lifecycle, view: () => view, reads: () => reads, taps: () => taps,
    replaceScope: () => { currentScope = {}; } };
}

test('touch navigation measures bounds once per finger configuration, keeps pan math and finishes once', () => {
  const fixture = touchFixture();
  fixture.pointer('pointerdown');
  for (let step = 1; step <= 100; step++) fixture.pointer('pointermove', 110 + step, 120 + step / 2);
  assert.equal(fixture.reads(), 1);
  assert.deepEqual(fixture.view(), { x: 100, y: 50, scale: 1 });
  fixture.pointer('pointerup', 210, 170);
  assert.deepEqual(fixture.lifecycle, [['start', true], ['end', false]]);
  assert.equal(fixture.controller.isActive(), false);
  assert.equal(fixture.taps(), 0);
  fixture.pointer('pointerdown'); fixture.pointer('pointerdown', 180, 120, 2);
  fixture.pointer('pointermove', 200, 120, 2);
  assert.equal(fixture.reads(), 3);
  fixture.pointer('pointerup', 200, 120, 2);
  assert.equal(fixture.reads(), 4);
  fixture.pointer('pointermove', 130, 140);
  fixture.pointer('pointerup', 130, 140);
  assert.deepEqual(fixture.lifecycle.slice(-2), [['start', true], ['end', false]]);
});

test('tap does not suspend motion and interrupted touch navigation cannot leave it stuck', () => {
  const fixture = touchFixture();
  fixture.pointer('pointerdown'); fixture.pointer('pointerup');
  assert.equal(fixture.taps(), 1); assert.deepEqual(fixture.lifecycle, []);
  for (const interrupt of [
    () => fixture.controller.cancel(),
    () => fixture.window.dispatchEvent(new Event('resize')),
    () => fixture.document.dispatchEvent(new Event('scroll')),
    () => { fixture.replaceScope(); fixture.pointer('pointermove', 150, 150); },
    () => { fixture.document.hidden = true; fixture.document.dispatchEvent(new Event('visibilitychange')); },
  ]) {
    fixture.pointer('pointerdown'); fixture.pointer('pointermove', 140, 145);
    assert.equal(fixture.controller.isNavigating(), true);
    interrupt();
    assert.equal(fixture.controller.isActive(), false); assert.equal(fixture.controller.isNavigating(), false);
    const view = fixture.view(); fixture.pointer('pointermove', 210, 220); fixture.pointer('pointerup', 210, 220);
    assert.deepEqual(fixture.view(), view);
    assert.deepEqual(fixture.lifecycle.slice(-2), [['start', true], ['end', false]]);
  }
});
