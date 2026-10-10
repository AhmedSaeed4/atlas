import test from "node:test";
import assert from "node:assert/strict";
import { isCurrentTouchEdgeSelection, isTouchClick, scrollTypeFiltersWithWheel, transitionTypeInteractions } from "../public/src/filter-interaction.js";

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

test("desktop categories cycle from hover preview to locked highlight, hidden, then restored", () => {
  let state = transition(initial(), { kind: "pointer-over", type: "API", pointerType: "mouse" });
  assert.equal(state.focusedType, "API");
  state = transition(state, { kind: "activate-type", type: "API", detail: 1, pointerType: "mouse" });
  assert.equal(state.lockedType, "API");
  assert.equal(state.focusedType, "API");
  assert.deepEqual([...state.excludedTypes], []);
  state = transition(state, { kind: "pointer-out", pointerType: "mouse" });
  state = transition(state, { kind: "pointer-over", type: "Service", pointerType: "mouse" });
  state = transition(state, { kind: "focus", type: "", inputType: "keyboard" });
  assert.equal(state.focusedType, "API");
  state = transition(state, { kind: "activate-type", type: "API", detail: 1, pointerType: "mouse" });
  assert.equal(state.lockedType, "");
  assert.equal(state.focusedType, "");
  assert.deepEqual([...state.excludedTypes], ["API"]);
  state = transition(state, { kind: "pointer-over", type: "API", pointerType: "mouse" });
  assert.equal(state.focusedType, "");
  state = transition(state, { kind: "activate-type", type: "API", detail: 1, pointerType: "mouse" });
  assert.equal(state.lockedType, "");
  assert.deepEqual([...state.excludedTypes], []);
  state = transition(state, { kind: "activate-type", type: "API", detail: 1, pointerType: "mouse" });
  assert.equal(state.lockedType, "API");
});

test("another desktop category replaces the lock and All clears locks and hidden categories", () => {
  let state = transition(initial("", ["Database"]), { kind:"activate-type", type:"API", detail:0, pointerType:"" });
  state = transition(state, { kind:"focus", type:"Service", inputType:"keyboard" });
  assert.equal(state.focusedType, "API");
  state = transition(state, { kind:"activate-type", type:"Service", detail:0, pointerType:"" });
  assert.equal(state.lockedType, "Service");
  assert.equal(state.focusedType, "Service");
  assert.deepEqual([...state.excludedTypes], ["Database"]);
  state = transition(state, { kind:"activate-all", detail:0, pointerType:"" });
  assert.equal(state.focusedType, "");
  assert.equal(state.lockedType, "");
  assert.deepEqual([...state.excludedTypes], []);
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
  assert.deepEqual([...state.excludedTypes], []);
  assert.equal(state.lockedType, "Service");
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


test("clearing a locked highlight preserves hidden categories and the next activation locks again", () => {
  const before = transition(initial("", ["Database"]), { kind: "activate-type", type: "API", detail: 1, pointerType: "mouse" });
  let state = transition(before, { kind: "clear-highlight" });
  assert.equal(state.focusedType, "");
  assert.equal(state.lockedType, "");
  assert.deepEqual([...state.excludedTypes], ["Database"]);
  assert.equal(before.lockedType, "API", "the transition does not mutate its input");
  state = transition(state, { kind: "activate-type", type: "API", detail: 1, pointerType: "mouse" });
  assert.equal(state.lockedType, "API");
  assert.deepEqual([...state.excludedTypes], ["Database"]);
});

test("an empty-map highlight clear also releases touch focus without restoring hidden categories", () => {
  const before = touchTap("API", "", ["Service"]);
  const after = transition(before, { kind: "clear-highlight" });
  assert.equal(after.focusedType, "");
  assert.equal(after.lockedType, "");
  assert.equal(after.touchInteractionActive, false);
  assert.deepEqual([...after.excludedTypes], ["Service"]);
});

function wheelFixture(options = {}, geometry = {}) {
  const group = { scrollLeft: 0, clientWidth: 250, scrollWidth: 850, ...geometry };
  const event = { deltaX: 0, deltaY: 100, deltaMode: 0, cancelable: true,
    preventDefault() { this.defaultPrevented = true; }, ...options };
  return { group, event, scroll: () => scrollTypeFiltersWithWheel(group, event) };
}

test("vertical mouse wheel reveals categories in both directions without page scrolling", () => {
  const down = wheelFixture();
  assert.equal(down.scroll(), true); assert.equal(down.group.scrollLeft, 100);
  assert.equal(down.event.defaultPrevented, true);
  const up = wheelFixture({ deltaY: -80 }, { scrollLeft: 100 });
  assert.equal(up.scroll(), true); assert.equal(up.group.scrollLeft, 20);
  assert.equal(up.event.defaultPrevented, true);
});

test("line and page mouse wheels use the strip's horizontal scale", () => {
  for (const [deltaMode, deltaY, expected] of [[0, 32, 32], [1, 2, 32], [2, 1, 250]]) {
    const f = wheelFixture({ deltaMode, deltaY });
    assert.equal(f.scroll(), true); assert.equal(f.group.scrollLeft, expected);
  }
});

test("scrolling clamps to either end and releases the wheel to the page once at the boundary", () => {
  const right = wheelFixture({ deltaY: 200 }, { scrollLeft: 560 });
  assert.equal(right.scroll(), true); assert.equal(right.group.scrollLeft, 600);
  const atRight = wheelFixture({}, { scrollLeft: 600 });
  assert.equal(atRight.scroll(), false); assert.equal(atRight.event.defaultPrevented, undefined);
  const left = wheelFixture({ deltaY: -200 }, { scrollLeft: 40 });
  assert.equal(left.scroll(), true); assert.equal(left.group.scrollLeft, 0);
  const atLeft = wheelFixture({ deltaY: -100 });
  assert.equal(atLeft.scroll(), false); assert.equal(atLeft.event.defaultPrevented, undefined);
});

test("zoom, native horizontal gestures, nonoverflowing rows and handled wheel events remain native", () => {
  for (const options of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true },
    { deltaX: 120 }, { deltaY: 0 }, { deltaY: NaN }, { cancelable: false }, { defaultPrevented: true }]) {
    const f = wheelFixture(options);
    assert.equal(f.scroll(), false); assert.equal(f.group.scrollLeft, 0);
    assert.equal(f.event.defaultPrevented, options.defaultPrevented);
  }
  for (const geometry of [{ scrollWidth: 250 }, { scrollWidth: 150 }, { clientWidth: 0 }]) {
    const f = wheelFixture({}, geometry);
    assert.equal(f.scroll(), false); assert.equal(f.group.scrollLeft, 0);
    assert.equal(f.event.defaultPrevented, undefined);
  }
});
