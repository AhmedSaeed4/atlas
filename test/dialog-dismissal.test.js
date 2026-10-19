import test from "node:test";
import assert from "node:assert/strict";
import { bindDialogBackdropClose } from "../public/src/dialog-dismissal.js";

class Dialog extends EventTarget {
  open = true;
  closed = [];
  getBoundingClientRect() {
    return { left: 100, right: 300, top: 100, bottom: 300 };
  }
  close(value) {
    this.closed.push(value);
    this.open = false;
    this.dispatchEvent(new Event("close"));
  }
  pointer(type, { x = 20, y = 20, button = 0, target } = {}) {
    const event = new Event(type);
    Object.assign(event, { clientX: x, clientY: y, button });
    if (target) Object.defineProperty(event, "target", { value: target });
    this.dispatchEvent(event);
  }
}
test("a deliberate outside click follows cancel before closing and never submits a dialog", () => {
  const dialog = new Dialog(),
    events = [];
  dialog.addEventListener("cancel", () => events.push("cancel"));
  dialog.addEventListener("close", () => events.push("close"));
  dialog.addEventListener("submit", () => events.push("submit"));
  bindDialogBackdropClose(dialog);
  dialog.pointer("pointerdown");
  dialog.pointer("click");
  assert.deepEqual(events, ["cancel", "close"]);
  assert.deepEqual(dialog.closed, ["cancel"]);
});
test("dialog padding, content and drags across the border do not dismiss", () => {
  const dialog = new Dialog();
  bindDialogBackdropClose(dialog);
  const content = {};
  for (const [down, up] of [
    [
      { x: 110, y: 110 },
      { x: 110, y: 110 },
    ],
    [{ target: content, x: 150, y: 150 }, {}],
    [{}, { x: 150, y: 150 }],
    [
      { target: content, x: 150, y: 150 },
      { target: content, x: 150, y: 150 },
    ],
  ]) {
    dialog.pointer("pointerdown", down);
    dialog.pointer("click", up);
    assert.equal(dialog.open, true);
  }
});
test("right clicks, canceled gestures and old press state cannot close a reopened dialog", () => {
  const dialog = new Dialog();
  bindDialogBackdropClose(dialog);
  dialog.pointer("pointerdown", { button: 2 });
  dialog.pointer("click");
  dialog.pointer("pointerdown");
  dialog.pointer("pointercancel");
  dialog.pointer("click");
  assert.deepEqual(dialog.closed, []);
  dialog.pointer("pointerdown");
  dialog.close("button");
  dialog.open = true;
  dialog.pointer("click");
  assert.deepEqual(dialog.closed, ["button"]);
});
test("a busy-operation cancel guard can veto outside dismissal then allow a later click", () => {
  const dialog = new Dialog();
  let busy = true;
  dialog.addEventListener("cancel", (event) => {
    if (busy) event.preventDefault();
  });
  bindDialogBackdropClose(dialog);
  dialog.pointer("pointerdown");
  dialog.pointer("click");
  assert.equal(dialog.open, true);
  busy = false;
  dialog.pointer("pointerdown");
  dialog.pointer("click");
  assert.equal(dialog.open, false);
});
test("custom close cleanup runs once for an actual open dialog", () => {
  const dialog = new Dialog();
  let cleanups = 0;
  bindDialogBackdropClose(dialog, () => {
    cleanups++;
    dialog.close("custom");
  });
  dialog.pointer("pointerdown");
  dialog.pointer("click");
  dialog.pointer("pointerdown");
  dialog.pointer("click");
  assert.equal(cleanups, 1);
});
