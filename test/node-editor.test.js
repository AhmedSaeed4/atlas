import test from "node:test";
import assert from "node:assert/strict";
import { NODE_TYPE_PRESETS, buildChartFromEditor, resolveNodeType, selectNodeTypeEditor } from "../public/src/node-editor.js";

test("node type editor keeps common types selectable and preserves custom imported values", () => {
  assert.ok(NODE_TYPE_PRESETS.includes("Database"));
  assert.deepEqual(selectNodeTypeEditor("Service"), { preset: "Service", custom: "" });
  assert.deepEqual(selectNodeTypeEditor("Project-specific worker"), { preset: "Custom", custom: "Project-specific worker" });
  assert.equal(resolveNodeType("Custom", " Project-specific worker "), "Project-specific worker");
  assert.equal(resolveNodeType("Database", "ignored"), "Database");
  assert.throws(() => resolveNodeType("Custom", " "), /enter a custom type/);
  assert.throws(() => resolveNodeType("Custom", "x".repeat(61)), /60 characters/);
});

test("chart editor requires measured values, evidence, and labels for comparable categories", () => {
  const chart = buildChartFromEditor({
    enabled: true, label: "Tests by suite", kind: "bar", values: "16\n8\n25",
    categories: "Channel\nAgent\nEnd-to-end", unit: "tests", evidence: "package scripts and test files",
  });
  assert.deepEqual(chart, {
    label: "Tests by suite", kind: "bar", values: [16, 8, 25],
    categories: ["Channel", "Agent", "End-to-end"], unit: "tests", evidence: "package scripts and test files",
  });
  assert.equal(buildChartFromEditor({ enabled: false }), null);
  assert.throws(() => buildChartFromEditor({ enabled: true, label: "tests", kind: "bar", values: "1\n2", categories: "unit", evidence: "fixture" }), /one category label/);
  assert.throws(() => buildChartFromEditor({ enabled: true, label: "steps", kind: "line", values: "1\n2", categories: "start\nfinish", evidence: "fixture" }), /explanation of its order/);
  assert.throws(() => buildChartFromEditor({ enabled: true, label: "steps", kind: "area", values: "1\n2", evidence: "fixture" }), /labeled, ordered categories/);
  assert.throws(() => buildChartFromEditor({ enabled: true, label: "steps", kind: "bar", values: "1\nInfinity", categories: "a\nb", evidence: "fixture" }), /must be a number/);
  assert.throws(() => buildChartFromEditor({ enabled: true, label: "steps", kind: "bar", values: "1\n1e13", categories: "a\nb", evidence: "fixture" }), /between -/);
  assert.throws(() => buildChartFromEditor({ enabled: true, label: "steps", kind: "bar", values: "1\n2", categories: "a\nb", evidence: "" }), /Evidence.*required/);
});
