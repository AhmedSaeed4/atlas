import test from "node:test";
import assert from "node:assert/strict";
import { clearEdgeEntranceState, graphMotionAllowed, setEdgeTraceState } from "../public/src/edge-motion.js";

function fakeSvgElement(classNames = [], styleValues = {}) {
  const classes = new Set(classNames);
  const styles = new Map(Object.entries(styleValues));
  return {
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
      toggle: (name, force) => {
        if (force) classes.add(name);
        else classes.delete(name);
        return classes.has(name);
      },
    },
    style: {
      getPropertyValue: (name) => styles.get(name) || "",
      setProperty: (name, value) => styles.set(name, value),
      removeProperty: (name) => {
        const previous = styles.get(name) || "";
        styles.delete(name);
        return previous;
      },
    },
  };
}

test("selecting a traced edge clears stale dash, arrow, and label entrance state permanently", () => {
  const group = fakeSvgElement(["edge-group", "label-delayed"], { "--draw-delay": "0.7s" });
  const path = fakeSvgElement(["edge-path", "draw-in"], {
    "stroke-dasharray": "145.324",
    "stroke-dashoffset": "145.324",
  });
  const arrow = fakeSvgElement(["edge-arrow", "show-after"]);

  setEdgeTraceState(group, path, arrow, true);

  assert.equal(path.classList.contains("connected"), true);
  assert.equal(path.classList.contains("draw-in"), false);
  assert.equal(path.style.getPropertyValue("stroke-dasharray"), "");
  assert.equal(path.style.getPropertyValue("stroke-dashoffset"), "");
  assert.equal(arrow.classList.contains("connected"), true);
  assert.equal(arrow.classList.contains("show-after"), false);
  assert.equal(group.classList.contains("trace-label"), true);
  assert.equal(group.classList.contains("label-delayed"), false);
  assert.equal(group.style.getPropertyValue("--draw-delay"), "");

  setEdgeTraceState(group, path, arrow, false);

  assert.equal(path.classList.contains("connected"), false);
  assert.equal(path.classList.contains("draw-in"), false);
  assert.equal(path.style.getPropertyValue("stroke-dashoffset"), "");
  assert.equal(arrow.classList.contains("connected"), false);
  assert.equal(arrow.classList.contains("show-after"), false);
  assert.equal(group.classList.contains("trace-label"), false);
  assert.equal(group.classList.contains("label-delayed"), false);
});

test("normal edge entrance completion removes only its temporary state", () => {
  const group = fakeSvgElement(["edge-group", "label-delayed"], { "--draw-delay": "0.7s" });
  const path = fakeSvgElement(["edge-path", "draw-in"], {
    "stroke-dasharray": "145.324",
    "stroke-dashoffset": "145.324",
  });
  const arrow = fakeSvgElement(["edge-arrow", "show-after"]);

  clearEdgeEntranceState({ group, path, arrow });

  assert.equal(path.classList.contains("draw-in"), false);
  assert.equal(path.style.getPropertyValue("stroke-dasharray"), "");
  assert.equal(path.style.getPropertyValue("stroke-dashoffset"), "");
  assert.equal(arrow.classList.contains("show-after"), false);
  assert.equal(group.classList.contains("label-delayed"), false);
  assert.equal(group.classList.contains("edge-group"), true);
});
test("dense maps retain every edge but skip graph motion", () => {
  assert.equal(graphMotionAllowed({ nodes: Array(9), edges: Array(7) }), true);
  assert.equal(graphMotionAllowed({ nodes: Array(600), edges: Array(40) }), true);
  assert.equal(graphMotionAllowed({ nodes: Array(601), edges: [] }), false);
  assert.equal(graphMotionAllowed({ nodes: [], edges: Array(160) }), true);
  assert.equal(graphMotionAllowed({ nodes: [], edges: Array(161) }), false);
  assert.equal(graphMotionAllowed({ nodes: Array(800), edges: Array(2400) }), false);
});