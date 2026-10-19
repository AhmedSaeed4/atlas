import test from "node:test";
import assert from "node:assert/strict";
import { resizeGraphCamera } from "../public/src/graph-camera.js";

const view = () => ({ viewport: { width: 600, height: 400 }, transform: { x: -125, y: 37, scale: 0.85 } });

test("resizing a live camera retains the world centre and exact zoom in either direction", () => {
  const before = view();
  for (const viewport of [{ width: 1200, height: 750 }, { width: 390, height: 250 }]) {
    const after = resizeGraphCamera(before, viewport);
    assert.equal(after.scale, before.transform.scale);
    for (const [size, offset] of [["width", "x"], ["height", "y"]]) {
      assert.equal((viewport[size] / 2 - after[offset]) / after.scale,
        (before.viewport[size] / 2 - before.transform[offset]) / before.transform.scale);
    }
    assert.deepEqual(resizeGraphCamera({ viewport, transform: after }, before.viewport), before.transform);
  }
  assert.deepEqual(resizeGraphCamera(before, before.viewport), before.transform);
});

test("invalid dimensions or camera transforms cannot produce a broken viewport", () => {
  const before = view();
  for (const viewport of [{ width: 0, height: 20 }, { width: Infinity, height: 20 }, { width: 300, height: -1 }]) {
    assert.equal(resizeGraphCamera(before, viewport), null);
    assert.equal(resizeGraphCamera({ ...before, viewport }, before.viewport), null);
  }
  for (const transform of [{ x: NaN, y: 0, scale: 1 }, { x: 0, y: Infinity, scale: 1 }, { x: 0, y: 0, scale: -1 }]) {
    assert.equal(resizeGraphCamera({ ...before, transform }, before.viewport), null);
  }
  assert.equal(resizeGraphCamera(null, before.viewport), null);
});
