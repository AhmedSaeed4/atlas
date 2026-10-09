import test from "node:test";
import assert from "node:assert/strict";
import { createActionGate } from "../public/src/action-feedback.js";

test("repeated submissions are refused until the original action settles", () => {
  const gate = createActionGate();
  const ticket = gate.begin("share:a:owner");
  assert.ok(ticket);
  assert.equal(gate.begin("share:a:owner"), null);
  assert.equal(gate.isBusy("share:a:owner"), true);
  assert.equal(gate.finish(ticket), true);
  assert.ok(gate.begin("share:a:owner"));
});

test("another workspace or dialog can progress independently", () => {
  const gate = createActionGate();
  const a = gate.begin("panel:1");
  const b = gate.begin("panel:2");
  assert.ok(a && b);
  gate.finish(a);
  assert.equal(gate.isBusy("panel:2"), true);
});

test("old completion cannot unlock a later retry", () => {
  const gate = createActionGate();
  const previous = gate.begin("copy");
  gate.finish(previous);
  const retry = gate.begin("copy");
  assert.equal(gate.finish(previous), false);
  assert.equal(gate.isBusy("copy"), true);
  assert.equal(gate.finish(retry), true);
  assert.equal(gate.finish(retry), false);
});
