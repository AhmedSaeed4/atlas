import test from "node:test";
import assert from "node:assert/strict";
import { chartCompactReadout, chartDescription, chartGeometry, chartPresentation, chartValueLabel, compactChartValue } from "../public/src/charts.js";
import { createRelationshipLookup, dependencyStages, relationshipsForNode } from "../public/src/timeline.js";
import { LIMITS } from "../public/src/schema.js";
import { SAMPLE_GRAPHS } from "../public/src/samples.js";

const graph = (nodes, edges) => ({ schemaVersion: 1, project: { name: "Flow" }, nodes, edges });

test("chart geometry keeps finite positive, negative, and flat series in bounds", () => {
  for (const values of [[0, 1, 4], [-5, -2, 0], [3, 3, 3]]) {
    const chart = chartGeometry(values);
    assert.equal(chart.points.length, values.length);
    assert.ok(chart.points.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y) && point.x >= 0 && point.x <= chart.width && point.y >= 0 && point.y <= chart.height));
    assert.ok(chart.areaPath.endsWith("Z"));
  }
  const boundary = chartGeometry([-1000000000000, 0, 1000000000000]);
  assert.ok(boundary.points.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y) && point.x >= 0 && point.x <= boundary.width && point.y >= 0 && point.y <= boundary.height));
  assert.throws(() => chartGeometry([1, Infinity]), /finite numbers/);
  assert.throws(() => chartGeometry(Array(33).fill(1)), /2 to 32/);
});

test("dependency stages follow graph edges and keep cycles in one stage", () => {
  const result = dependencyStages(graph(
    [
      { id: "entry", label: "Entry", type: "API" },
      { id: "auth", label: "Auth", type: "Service" },
      { id: "handler", label: "Handler", type: "Service" },
      { id: "cycle-a", label: "Cycle A", type: "Module" },
      { id: "cycle-b", label: "Cycle B", type: "Module" },
      { id: "island", label: "Island", type: "File" },
    ],
    [
      { source: "entry", target: "auth" },
      { source: "auth", target: "handler" },
      { source: "cycle-a", target: "cycle-b" },
      { source: "cycle-b", target: "cycle-a" },
    ],
  ));
  assert.deepEqual(result.map((stage) => stage.index), [0, 1, 2]);
  assert.ok(result[0].nodes.some((node) => node.id === "entry"));
  assert.ok(result[0].nodes.some((node) => node.id === "cycle-a"));
  assert.ok(result[0].nodes.some((node) => node.id === "cycle-b"));
  assert.ok(result[0].nodes.some((node) => node.id === "island"));
  assert.equal(result[1].nodes[0].id, "auth");
  assert.equal(result[2].nodes[0].id, "handler");
});

test("manual card positions do not change structural dependency stages", () => {
  const input = graph(
    [
      { id: "entry", label: "Entry", type: "API", position: { x: 50000, y: -30000 } },
      { id: "service", label: "Service", type: "Service", position: { x: -50000, y: 90000 } },
    ],
    [{ source: "entry", target: "service" }],
  );
  assert.deepEqual(dependencyStages(input).map((stage) => stage.nodes.map((node) => node.id)), [["entry"], ["service"]]);
});

test("request flow demo chart matches explicitly labeled structural stage counts", () => {
  const sample = SAMPLE_GRAPHS.find((item) => item.project.name === "Request flow demo");
  const chartNode = sample.nodes.find((node) => node.chart);
  const stages = dependencyStages(sample);
  assert.deepEqual(chartNode.chart.values, stages.map((stage) => stage.nodes.length));
  assert.match(sample.project.description, /Demonstration/);
  assert.match(chartNode.chart.evidence, /DEMONSTRATION structural count/);
  assert.match(chartNode.chart.evidence, /Not runtime telemetry/);
  assert.doesNotMatch(chartNode.chart.evidence, /\b20\d{2}-\d{2}-\d{2}\b/);
});


test("timeline relationships retain direction and readable labels across branches", () => {
  const input = graph(
    [
      { id: "api", label: "API", type: "API" },
      { id: "store", label: "Document store", type: "Database" },
      { id: "queue", label: "Change queue", type: "Queue" },
      { id: "worker", label: "Indexer", type: "Job" },
    ],
    [
      { source: "api", target: "store", label: "writes" },
      { source: "api", target: "queue", label: "publishes" },
      { source: "queue", target: "worker", label: "starts" },
    ],
  );
  assert.deepEqual(relationshipsForNode(input, "api").links.map((link) => [link.direction, link.nodeLabel, link.label]), [
    ["To", "Document store", "writes"],
    ["To", "Change queue", "publishes"],
  ]);
  assert.deepEqual(relationshipsForNode(input, "worker").links.map((link) => [link.direction, link.nodeLabel, link.label]), [
    ["From", "Change queue", "starts"],
  ]);
});


test("compact chart captions abbreviate extreme values while full readouts retain exact values", () => {
  const chart = { categories: ["Channel", "Agent", "End-to-end", "Unit tests", "Integration"], values: [LIMITS.chartMagnitude, -LIMITS.chartMagnitude, 0, 1200000000, -1234567], unit: "tests" };
  assert.equal(compactChartValue(LIMITS.chartMagnitude), "1T");
  assert.equal(compactChartValue(-LIMITS.chartMagnitude), "-1T");
  const captions = chart.values.map((_, index) => chartCompactReadout(chart, index, 174 / 5, 6));
  assert.match(captions[0], /1T$/);
  assert.match(captions[1], /-1T$/);
  assert.ok(captions.every((caption) => caption.length * 6 * .54 <= 174 / 5));
  assert.equal(chartValueLabel(chart, 0), "Channel: 1000000000000 tests");
  assert.equal(chartValueLabel(chart, 1), "Agent: -1000000000000 tests");
});

test("compact chart captions mark rounded decimal and exponent values as approximate", () => {
  const values = [0.123456789123, 1.23456789123e-10, -0.000000000987654321];
  const chart = { categories: ["Channel", "Agent", "End-to-end"], values, unit: "ratio" };
  const captions = values.map((_, index) => chartCompactReadout(chart, index, 174 / 5, 6));
  assert.ok(captions.every((caption) => caption.length <= 10));
  assert.ok(captions.every((caption) => caption.includes("~")));
  assert.equal(chartValueLabel(chart, 0), "Channel: 0.123456789123 ratio");
  assert.equal(chartValueLabel(chart, 1), "Agent: 1.23456789123e-10 ratio");
});

test("blank continuation edges stay explicitly unlabeled in Timeline data", () => {
  const input = graph(
    [{ id: "junction", label: "Junction", type: "Junction" }, { id: "target", label: "Target", type: "Service" }],
    [{ id: "continuation", source: "junction", target: "target", label: "", type: "" }],
  );
  assert.deepEqual(relationshipsForNode(input, "junction").links.map((link) => link.label), ["Unlabeled connection"]);
  assert.equal(relationshipsForNode(input, "junction").links.some((link) => link.label === "connects"), false);
});

test("request flow line chart derives outgoing edge counts per dependency stage", () => {
  const sample = SAMPLE_GRAPHS.find((item) => item.project.name === "Request flow demo");
  const stages = dependencyStages(sample);
  const values = stages.map((stage) => stage.nodes.reduce((sum, node) => sum + sample.edges.filter((edge) => edge.source === node.id).length, 0));
  const lineNode = sample.nodes.find((node) => node.chart?.kind === "line");
  assert.deepEqual(values, [1, 1, 1, 1, 2, 1, 1, 0]);
  assert.deepEqual(lineNode.chart.values, values);
  assert.match(lineNode.chart.evidence, /DEMONSTRATION structural count/);
  assert.match(lineNode.chart.evidence, /Not runtime telemetry/);
});

test("timeline caps parallel relationships, counts omissions, and lists self-loops once", () => {
  const input = graph(
    [
      { id: "a", label: "A", type: "API" },
      { id: "b", label: "B", type: "Service" },
      { id: "c", label: "C", type: "Queue" },
    ],
    [
      { source: "a", target: "a", label: "loops" },
      { source: "a", target: "b", label: "writes 1" },
      { source: "a", target: "b", label: "writes 2" },
      { source: "a", target: "c", label: "publishes" },
      { source: "b", target: "a", label: "reads 1" },
      { source: "b", target: "a", label: "reads 2" },
      { source: "b", target: "a", label: "reads 3" },
      { source: "b", target: "a", label: "reads 4" },
      { source: "c", target: "a", label: "retries" },
    ],
  );
  const result = relationshipsForNode(input, "a", 2);
  assert.deepEqual(result.links.map((item) => [item.direction, item.label]), [
    ["To", "loops"],
    ["To", "writes 1"],
    ["From", "reads 1"],
    ["From", "reads 2"],
  ]);
  assert.equal(result.omitted, 5);
});
test("relationship index matches standalone lookup and reuses its directed adjacency", () => {
  const input = graph(
    [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    [{ source: "a", target: "b", label: "writes" }, { source: "b", target: "a", label: "reads" }],
  );
  const lookup = createRelationshipLookup(input);
  assert.deepEqual(lookup("a"), relationshipsForNode(input, "a"));
  assert.deepEqual(lookup("b"), relationshipsForNode(input, "b"));
});

test("independent category bars stay finite and identify positive, zero, negative, and dense values", () => {
  for (const values of [[16, 8, 25], [2, 0, -3], Array.from({ length: 32 }, (_, index) => index - 16)]) {
    const geometry = chartGeometry(values, { width: 174, height: 43, padding: 4, kind: "bar" });
    assert.equal(geometry.bars.length, values.length);
    assert.equal(geometry.linePath, "");
    assert.ok(geometry.bars.every((bar) => [bar.x, bar.y, bar.width, bar.height].every(Number.isFinite) && bar.width > 0 && bar.height > 0 && bar.x >= 0 && bar.x + bar.width <= geometry.width));
  }
});

test("legacy charts are explicit unlabelled bars and ordered series name their context", () => {
  const legacy = { label: "Old values", kind: "line", values: [1, 3], unit: "tests", evidence: "old export" };
  assert.deepEqual(chartPresentation(legacy), { kind: "bar", legacy: true, context: "Legacy chart: category labels and ordering were not supplied. Values appear as separate bars, with no implied trend." });
  assert.match(chartDescription(legacy), /Unlabeled point 01: 1 tests/);
  const ordered = { label: "Components", kind: "line", values: [1, 2], categories: ["Step 01", "Step 02"], order: "dependency stage", evidence: "graph edges" };
  assert.equal(chartPresentation(ordered).kind, "line");
  assert.match(chartDescription(ordered), /Ordered by dependency stage/);
  assert.match(chartDescription(ordered), /Step 02: 2/);
});
