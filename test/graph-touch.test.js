import test from 'node:test';
import assert from 'node:assert/strict';
import { touchCamera } from '../public/src/graph-touch.js';

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
