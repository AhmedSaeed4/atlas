import test from "node:test";
import assert from "node:assert/strict";
import { isCurrentTouchEdgeSelection, isTouchClick, transitionTypeInteractions } from "../public/src/filter-interaction.js";

const initial = (focusedType = "", excludedTypes = []) => ({
  focusedType,
  excludedTypes: new Set(excludedTypes),
});
const transition = (state, action) => transitionTypeInteractions(state, action);
const touchTap = (type, focusedType = "", excludedTypes = []) => transition(initial(focusedType, excludedTypes), {
  kind: "activate-type",
  type,
  detail: 1,
  pointerType: "touch",
});

test("touch category taps select, persist through emulated hover-out, and clear on a second tap", () => {
  let state = initial();
  state = transition(state, { kind: "pointer-over", type: "API", pointerType: "touch" });
  state = transition(state, { kind: "pointer-out", pointerType: "touch" });
  assert.equal(state.focusedType, "");

  state = touchTap("API");
  assert.equal(state.focusedType, "API");
  state = transition(state, { kind: "pointer-out", pointerType: "touch" });
  state = transition(state, { kind: "focus", type: "", inputType: "unknown" });
  assert.equal(state.focusedType, "API");

  state = transition(state, { kind: "activate-type", type: "API", detail: 1, pointerType: "touch" });
  assert.equal(state.focusedType, "");
});

test("touch taps switch the highlighted category and All clears both highlight and filters", () => {
  let state = touchTap("API", "", ["Database"]);
  state = transition(state, { kind: "activate-type", type: "Service", detail: 1, pointerType: "touch" });
  assert.equal(state.focusedType, "Service");
  assert.deepEqual([...state.excludedTypes], ["Database"]);

  state = transition(state, { kind: "activate-all", detail: 1, pointerType: "", pointerDownType: "touch" });
  assert.equal(state.focusedType, "");
  assert.deepEqual([...state.excludedTypes], []);
  assert.equal(state.touchInteractionActive, true);
});

test("mouse hover and category clicks keep the existing desktop highlight and filter behavior", () => {
  let state = transition(initial(), { kind: "pointer-over", type: "API", pointerType: "mouse" });
  assert.equal(state.focusedType, "API");

  state = transition(state, { kind: "activate-type", type: "API", detail: 1, pointerType: "mouse" });
  assert.equal(state.focusedType, "API");
  assert.deepEqual([...state.excludedTypes], ["API"]);

  state = transition(state, { kind: "pointer-out", pointerType: "mouse", relatedType: "Service" });
  assert.equal(state.focusedType, "Service");
  state = transition(state, { kind: "pointer-out", pointerType: "mouse" });
  assert.equal(state.focusedType, "");
});

test("hybrid pointer transitions use the current activation and reject stale or keyboard touch state", () => {
  let state = touchTap("API");
  state = transition(state, { kind: "pointer-over", type: "Service", pointerType: "touch" });
  state = transition(state, { kind: "pointer-out", pointerType: "touch" });
  assert.equal(state.focusedType, "API");

  state = transition(state, { kind: "pointer-over", type: "Service", pointerType: "mouse" });
  assert.equal(state.focusedType, "Service");
  state = transition(state, {
    kind: "activate-type",
    type: "Service",
    detail: 1,
    pointerType: "mouse",
    pointerDownType: "touch",
  });
  assert.deepEqual([...state.excludedTypes], ["Service"]);
  assert.equal(state.focusedType, "Service");

  assert.equal(isTouchClick({ detail: 1, pointerType: "" }, "touch"), true);
  assert.equal(isTouchClick({ detail: 1, pointerType: "" }, ""), false);
  assert.equal(isTouchClick({ detail: 0, pointerType: "" }, "touch"), false);
  assert.equal(isTouchClick({ detail: 1, pointerType: "mouse" }, "touch"), false);

  state = touchTap("API");
  state = transition(state, { kind: "focus", type: "", inputType: "unknown" });
  assert.equal(state.focusedType, "API");
  state = transition(state, { kind: "focus", type: "Service", inputType: "keyboard" });
  assert.equal(state.focusedType, "Service");
  assert.equal(state.touchInteractionActive, false);
});

test("touch edge actions stay bound to the edge, project, and graph that was tapped", () => {
  const graph = {};
  const selection = { id: "edge-1", projectId: "project-1", graphRef: graph };
  assert.equal(isCurrentTouchEdgeSelection(selection, "edge-1", "project-1", graph), true);
  assert.equal(isCurrentTouchEdgeSelection(null, "edge-1", "project-1", graph), false);
  assert.equal(isCurrentTouchEdgeSelection(selection, "edge-2", "project-1", graph), false);
  assert.equal(isCurrentTouchEdgeSelection(selection, "edge-1", "project-2", graph), false);
  assert.equal(isCurrentTouchEdgeSelection(selection, "edge-1", "project-1", {}), false);
});
