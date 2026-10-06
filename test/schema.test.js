import test from "node:test";
import assert from "node:assert/strict";
import { LIMITS, MAX_IMPORT_BYTES, assertGraphJsonWithinLimit, graphJsonByteLength, normalizeEditableGraph, normalizeGraph, serializeGraphJson } from "../public/src/schema.js";

const valid = {
  schemaVersion: 1,
  project: { name: "Test map", description: "A small map", type: "Backend" },
  nodes: [{ id: "api", label: "API", type: "API" }, { id: "worker", label: "Worker", type: "Job" }],
  edges: [{ id: "calls", source: "api", target: "worker", label: "publishes [observed]" }],
};

test("normalizes the version 1 schema and preserves user text as data", () => {
  const graph = normalizeGraph({ ...valid, nodes: [{ ...valid.nodes[0], label: "<script>alert(1)</script>" }, valid.nodes[1]] });
  assert.equal(graph.schemaVersion, 1);
  assert.equal(graph.nodes[0].label, "<script>alert(1)</script>");
  assert.equal(graph.edges[0].source, "api");
});

test("supports nested Foglamp graph containers and field aliases", () => {
  const graph = normalizeGraph({
    version: 1,
    project: { name: "Foglamp sample", tagline: "A service map", type: "Backend" },
    graph: {
      nodes: [
        { id: "api", name: "API", kind: "API", detail: "Handles requests.", sourceRef: { path: "src/api.ts" } },
        { id: "job", label: "Publisher", type: "Job", sub: "Publishes events.", sourceRef: "src/jobs/publish.ts" },
      ],
      edges: [{ from: "api", to: "job", relationship: "publishes [inferred]" }],
    },
  });
  assert.equal(graph.project.description, "A service map");
  assert.equal(graph.nodes[0].description, "Handles requests.");
  assert.equal(graph.nodes[0].source, "src/api.ts");
  assert.equal(graph.nodes[1].source, "src/jobs/publish.ts");
  assert.equal(graph.edges[0].label, "publishes [inferred]");
});

test("rejects duplicate IDs, missing endpoints, unsupported versions, and empty imported maps", () => {
  assert.throws(() => normalizeGraph({ ...valid, nodes: [valid.nodes[0], valid.nodes[0]] }), /Duplicate component ID/);
  assert.throws(() => normalizeGraph({ ...valid, edges: [{ source: "api", target: "missing" }] }), /missing component/);
  assert.throws(() => normalizeGraph({ ...valid, schemaVersion: 2 }), /not supported/);
  assert.throws(() => normalizeGraph({ ...valid, nodes: [], edges: [] }), /at least one component/);
});

test("allows an empty graph only when the caller opts in for local editing", () => {
  const empty = normalizeGraph({ schemaVersion: 1, project: { name: "Empty" }, nodes: [], edges: [] }, { allowEmpty: true });
  assert.equal(empty.nodes.length, 0);
  assert.equal(empty.edges.length, 0);
});

test("enforces size and graph count limits before building a graph", () => {
  assert.throws(() => normalizeGraph(" ".repeat(MAX_IMPORT_BYTES + 1)), /2 MB/);
  const tooManyNodes = Array.from({ length: LIMITS.nodes + 1 }, (_, index) => ({ id: "n" + index, label: "N" + index }));
  assert.throws(() => normalizeGraph({ schemaVersion: 1, project: { name: "Large" }, nodes: tooManyNodes, edges: [] }), /limit is 800/);
});

test("normalizes optional evidence-labeled line and area series", () => {
  const input = {
    ...valid,
    nodes: [{ ...valid.nodes[0], chart: {
      label: "Calls by request stage",
      kind: "area",
      values: [0, 2, 1.5],
      unit: "calls",
      evidence: "src/metrics.ts: request-stage counter aggregation",
    } }, valid.nodes[1]],
  };
  const graph = normalizeGraph(input);
  assert.deepEqual(graph.nodes[0].chart, {
    label: "Calls by request stage",
    kind: "area",
    values: [0, 2, 1.5],
    evidence: "src/metrics.ts: request-stage counter aggregation",
    unit: "calls",
  });
});

test("rejects invalid, unbounded, or unsupported chart values", () => {
  const withChart = (chart) => normalizeGraph({
    ...valid,
    nodes: [{ ...valid.nodes[0], chart }, valid.nodes[1]],
  });
  const baseChart = { label: "Requests", kind: "line", values: [1, 2], evidence: "src/metrics.ts" };
  assert.deepEqual(withChart({ ...baseChart, values: [-LIMITS.chartMagnitude, LIMITS.chartMagnitude] }).nodes[0].chart.values, [-LIMITS.chartMagnitude, LIMITS.chartMagnitude]);
  assert.throws(() => withChart({ ...baseChart, kind: "pie" }), /must be bar, line, or area/);
  assert.throws(() => withChart({ ...baseChart, values: [1] }), /2 to 32 points/);
  assert.throws(() => withChart({ ...baseChart, values: [1, "2"] }), /finite number/);
  assert.throws(() => withChart({ ...baseChart, values: [1, Number.NaN] }), /finite number/);
  assert.throws(() => withChart({ ...baseChart, values: [1, 1000000000001] }), /finite number/);
  assert.throws(() => withChart({ ...baseChart, values: Array(33).fill(1) }), /2 to 32 points/);
  assert.throws(() => withChart({ ...baseChart, evidence: "" }), /evidence is required/);
});


test("normalizes bounded v1 chart labels, grounded node details, and explicit junctions", () => {
  const input = {
    ...valid,
    nodes: [
      { ...valid.nodes[0], details: { purpose: "Routes validated requests", operation: "Checks claims before service dispatch", inputs: ["HTTP request"], outputs: ["JSON response"], dependencies: ["worker"], evidence: ["src/api.ts: route handler"], uncertainty: ["Retry policy is configured elsewhere"] }, chart: { label: "Tests by suite", kind: "bar", values: [16, 8, 25], categories: ["Channel", "Agent", "End-to-end"], unit: "tests", evidence: "DEMONSTRATION example; replace with repository evidence" } },
      { ...valid.nodes[1], type: "Junction", junction: true },
    ],
  };
  const normalized = normalizeGraph(input);
  assert.deepEqual(normalized.nodes[0].chart.categories, ["Channel", "Agent", "End-to-end"]);
  assert.deepEqual(normalized.nodes[0].details.inputs, ["HTTP request"]);
  assert.equal(normalized.nodes[1].junction, true);
  assert.deepEqual(normalizeGraph(JSON.stringify(normalized)), normalized);
});

test("keeps old unlabelled line charts valid without inventing categories", () => {
  const graph = normalizeGraph({ ...valid, nodes: [{ ...valid.nodes[0], chart: { label: "Old measure", kind: "line", values: [3, 1, 4], evidence: "legacy source" } }, valid.nodes[1]] });
  assert.equal(graph.nodes[0].chart.kind, "line");
  assert.equal("categories" in graph.nodes[0].chart, false);
  assert.equal("order" in graph.nodes[0].chart, false);
});

test("rejects mismatched chart labels, missing ordered context, excessive details, and invalid junction markers", () => {
  const withChart = (chart) => normalizeGraph({ ...valid, nodes: [{ ...valid.nodes[0], chart }, valid.nodes[1]] });
  assert.throws(() => withChart({ label: "Tests", kind: "bar", values: [16, 8], categories: ["Channel"], evidence: "fixture" }), /one category label/);
  assert.throws(() => withChart({ label: "Steps", kind: "line", values: [1, 2], categories: ["A", "B"], evidence: "fixture" }), /order explanation/);
  assert.throws(() => withChart({ label: "Steps", kind: "line", values: [1, 2], order: "source order", evidence: "fixture" }), /both category labels and an order/);
  assert.throws(() => normalizeGraph({ ...valid, nodes: [{ ...valid.nodes[0], details: { inputs: Array(9).fill("value") } }, valid.nodes[1]] }), /8 items or fewer/);
  assert.throws(() => normalizeGraph({ ...valid, nodes: [{ ...valid.nodes[0], details: { uncertainty: ["x".repeat(241)] } }, valid.nodes[1]] }), /240 characters or fewer/);
  assert.throws(() => normalizeGraph({ ...valid, nodes: [{ ...valid.nodes[0], type: "Service", junction: true }, valid.nodes[1]] }), /requires component type Junction/);
});


test("editable graph preflight measures pretty UTF-8 exports while preserving old object reads", () => {
  const longItem = "\u00e9".repeat(118) + "\\<>";
  const details = {
    purpose: "\u00e9".repeat(249) + "\\",
    operation: "\u00e9".repeat(499) + "\\",
    inputs: Array(8).fill(longItem),
    outputs: Array(8).fill(longItem),
    dependencies: Array(8).fill(longItem),
    evidence: Array(8).fill(longItem),
    uncertainty: Array(8).fill(longItem),
  };
  const candidate = { schemaVersion: 1, project: { name: "T\u00e9st \"map", description: "Unicode \u00e9", type: "Software project" }, nodes: [], edges: [] };
  let oversizePretty = null;
  const measure = (graph) => ({
    compact: new TextEncoder().encode(JSON.stringify(graph)).byteLength,
    pretty: graphJsonByteLength(graph),
  });
  for (let index = 0; index < LIMITS.nodes; index += 1) {
    candidate.nodes.push({ id: "node-" + index, label: "Node " + index, type: "Service", description: "", source: "", group: "", details: structuredClone(details) });
    const sizes = measure(candidate);
    if (sizes.pretty > MAX_IMPORT_BYTES) {
      if (sizes.compact <= MAX_IMPORT_BYTES) { oversizePretty = structuredClone(candidate); break; }
      const last = candidate.nodes[candidate.nodes.length - 1];
      let low = 0;
      let high = last.details.purpose.length;
      while (low <= high) {
        const middle = Math.floor((low + high) / 2);
        last.details.purpose = "é".repeat(Math.floor(middle / 2)) + (middle % 2 ? "x" : "");
        const adjusted = measure(candidate);
        if (adjusted.compact <= MAX_IMPORT_BYTES && adjusted.pretty > MAX_IMPORT_BYTES) {
          oversizePretty = structuredClone(candidate);
          break;
        }
        if (adjusted.compact > MAX_IMPORT_BYTES) high = middle - 1;
        else low = middle + 1;
      }
      break;
    }
  }
  assert.ok(oversizePretty, "the fixture should sit between compact import size and pretty export size");
  const before = structuredClone(oversizePretty);
  const sizes = measure(oversizePretty);
  assert.ok(sizes.compact <= MAX_IMPORT_BYTES);
  assert.ok(sizes.pretty > MAX_IMPORT_BYTES);
  assert.equal(new TextEncoder().encode(serializeGraphJson(oversizePretty)).byteLength, sizes.pretty);
  assert.doesNotThrow(() => normalizeGraph(JSON.stringify(oversizePretty), { allowEmpty: true }), "compact imports under the cap remain readable");
  assert.doesNotThrow(() => normalizeGraph(oversizePretty, { allowEmpty: true }), "legacy object-based saved maps remain readable");
  assert.doesNotThrow(() => normalizeEditableGraph(oversizePretty, { baselineGraph: oversizePretty }), "a bounded incoming v1 share can be opened as an unchanged legacy baseline");
  assert.throws(() => normalizeEditableGraph(oversizePretty), /formatted JSON.*2 MiB/);
  assert.deepEqual(oversizePretty, before, "a rejected candidate cannot mutate its source graph");
  const reducedInput = structuredClone(oversizePretty);
  reducedInput.nodes[0].details.purpose = "shortened";
  const reduced = normalizeEditableGraph(reducedInput, { baselineGraph: oversizePretty });
  assert.ok(graphJsonByteLength(reduced) < sizes.pretty, "existing oversized data can be reduced incrementally");
});
