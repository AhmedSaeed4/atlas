import test from "node:test";
import assert from "node:assert/strict";
import { createGraphFullscreen } from "../public/src/graph-fullscreen.js";

function fixture({ animated = false } = {}) {
  const classes = new Set(), attrs = new Map(), changes = [], captures = [], transitions = [], scrolls = [];
  const root = { classList: { add(name) { classes.add(name); }, toggle(name, on) { on ? classes.add(name) : classes.delete(name); }, remove(name) { classes.delete(name); } } };
  const win = { scrollX: 15, scrollY: 80, scrollTo: (...args) => scrolls.push(args),
    matchMedia: () => ({ matches: !animated, addEventListener() {} }), addEventListener() {} };
  const doc = { defaultView: win, documentElement: root, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] };
  if (animated) doc.startViewTransition = update => {
    let finish;
    const transition = { ready: Promise.resolve(), updateCallbackDone: Promise.resolve(),
      finished: new Promise(resolve => { finish = resolve; }), skipTransition() { finish(); },
      update() { update(); finish(); } };
    transitions.push(transition); return transition;
  };
  const toggle = { ownerDocument: doc, querySelector: () => ({}), setAttribute: (name, value) => attrs.set(name, value), focus() {}, addEventListener() {} };
  const controller = createGraphFullscreen({ toggle,
    captureView() { const snapshot = { expanded: classes.has("graph-fullscreen"), number: captures.length }; captures.push(snapshot); return snapshot; },
    onChange: (...args) => changes.push(args) });
  return { controller, changes, captures, transitions, scrolls, attrs };
}
test("full-screen entry and exit capture the outgoing camera before changing layout", () => {
  const f = fixture();
  f.controller.setActive(true); f.controller.setActive(false);
  assert.deepEqual(f.captures.map(view => view.expanded), [false, true]);
  assert.deepEqual(f.changes[0], [true, f.captures[0], f.captures[0]]);
  assert.deepEqual(f.changes[1], [false, f.captures[0], f.captures[1]]);
  assert.deepEqual(f.scrolls, [[15, 80]]);
  assert.equal(f.attrs.get("aria-pressed"), "false");
});
test("skipped deferred toggles cannot capture or overwrite a newer camera", async () => {
  const f = fixture({ animated: true });
  f.controller.setActive(true); f.controller.setActive(false); f.controller.setActive(true);
  f.transitions[0].update(); f.transitions[1].update(); f.transitions[2].update();
  await Promise.resolve();
  assert.equal(f.controller.isActive(), true);
  assert.equal(f.captures.length, 1);
  assert.equal(f.changes.length, 1);
  f.controller.setActive(false); f.transitions[3].update();
  assert.deepEqual(f.captures.map(view => view.expanded), [false, true]);
  assert.equal(f.changes[1][1], f.captures[0]);
  assert.equal(f.changes[1][2], f.captures[1]);
});
