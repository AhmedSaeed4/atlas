import test from "node:test";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { normalizeGraph, MAX_IMPORT_BYTES } from "../public/src/schema.js";
import { branchEdgeCandidate } from "../public/src/refinement-graph.js";
import { SAMPLE_GRAPHS } from "../public/src/samples.js";
import { buildSvg, escapeXml, safeRasterDimensions } from "../public/src/exports.js";
import { createShareUrl, decodeShareHash, encodeShareHash, findSharedProject, isLocalShareHost, shareKey, shouldClearShareFragmentForDeletedProject } from "../public/src/share.js";

test("escapes XML text in standalone exports", () => {
  assert.equal(escapeXml("<x a=\"1\">&'"), "&lt;x a=&quot;1&quot;&gt;&amp;&apos;");
  const graph = normalizeGraph({
    schemaVersion: 1,
    project: { name: "Map <script>", description: "Safe & local" },
    nodes: [{ id: "x", label: "<script>alert(1)</script>", type: "Module" }],
    edges: [],
  });
  const svg = buildSvg(graph);
  assert.match(svg, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(svg, /<script>/i);
  assert.match(svg, /--export-card:#252823/);
  assert.match(svg, /rx="18"/);
  assert.doesNotMatch(svg, /card-accent/);
  assert.match(svg, /--export-canvas:#171916/);
  assert.doesNotMatch(svg, /#239d89|#f7f9f9/);
});

test("exports routed back edges and self-loops without arrowheads", () => {
  const graph = normalizeGraph({
    schemaVersion: 1, project: { name: "Routes" },
    nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    edges: [{ source: "a", target: "a", label: "self" }, { source: "b", target: "a", label: "back" }],
  });
  const svg = buildSvg(graph);
  assert.doesNotMatch(svg, /stroke-width="1.5" stroke-linecap="round"/);
  assert.equal((svg.match(/stroke="var\(--export-muted\)" stroke-width="1.5"/g) || []).length, 2);
});

test("keeps parallel edge routes and full relation titles in standalone SVG", () => {
  const graph = normalizeGraph({
    schemaVersion: 1, project: { name: "Parallel paths" },
    nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    edges: [
      { id: "one", source: "a", target: "b", label: "first long relationship label over eighteen chars" },
      { id: "two", source: "a", target: "b", label: "second long relationship label over eighteen chars" },
      { id: "three", source: "a", target: "b", label: "third long relationship label over eighteen chars" },
    ],
  });
  const svg = buildSvg(graph);
  const paths = [...svg.matchAll(/<g><title>.*?<\/title><path d="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(paths.length, 3);
  assert.equal(new Set(paths).size, 3);
  assert.match(svg, /<title>first long relationship label over eighteen chars<\/title>/);
});
test("replaces XML-invalid control characters and unpaired surrogates in exports", () => {
  assert.equal(escapeXml("before\u0000\u0001after"), "before\uFFFD\uFFFDafter");
  assert.equal(escapeXml("\uD800"), "\uFFFD");
  const graph = normalizeGraph({
    schemaVersion: 1, project: { name: "Bad\u0001name" },
    nodes: [{ id: "n", label: "Invalid\u0000label" }], edges: [],
  });
  const svg = buildSvg(graph);
  assert.doesNotMatch(svg, /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/);
  assert.match(svg, /Invalid\uFFFDlabel/);
});

test("caps PNG dimensions and total raster pixels", () => {
  for (const [width, height] of [[40000, 40000], [20000, 50], [300, 100]]) {
    const size = safeRasterDimensions(width, height);
    assert.ok(size.width <= 8192);
    assert.ok(size.height <= 8192);
    assert.ok(size.width * size.height <= 24000000);
    assert.ok(size.width >= 1 && size.height >= 1);
  }
});

test("round-trips gzip share links for frontend, backend, and Electron examples", async () => {
  for (const sample of SAMPLE_GRAPHS) {
    const graph = normalizeGraph({ ...sample, project: { ...sample.project, name: sample.project.name + " - Cafee 日本語" } });
    const hash = await encodeShareHash(graph);
    const restored = await decodeShareHash(hash);
    assert.deepEqual(restored, graph);
  }
});

test("decodes portable raw UTF-8 fragments without losing Unicode", async () => {
  const graph = normalizeGraph({
    schemaVersion: 1,
    project: { name: "Cafe\u00e9 - \u65e5\u672c\u8a9e" },
    nodes: [{ id: "n", label: "Cr\u00e8me \u6771\u4eac" }],
    edges: [],
  });
  const raw = Buffer.from(JSON.stringify(graph), "utf8").toString("base64url");
  const restored = await decodeShareHash("#map=r." + raw);
  assert.equal(restored.project.name, "Cafe\u00e9 - \u65e5\u672c\u8a9e");
  assert.equal(restored.nodes[0].label, "Cr\u00e8me \u6771\u4eac");
});

test("rejects malformed fragments and bounded gzip expansion", async () => {
  await assert.rejects(decodeShareHash("#map=x.AA"), /unsupported payload format/);
  await assert.rejects(decodeShareHash("#map=g.@@@"), /invalid encoded payload/);
  const bomb = Buffer.from(" ".repeat(MAX_IMPORT_BYTES + 1), "utf8");
  const compressed = gzipSync(bomb).toString("base64url");
  await assert.rejects(decodeShareHash("#map=g." + compressed), /2 MB safety limit/);
});

test("shared maps are deduplicated by exact fragment across key capability changes", () => {
  const hash = "#map=r.YQ";
  const existing = { id: "sha-derived-id", shareSourceHash: hash };
  assert.equal(findSharedProject([existing], hash), existing);
  assert.equal(findSharedProject([{ id: "fallback-id", shareSourceHash: "#map=r.Yg" }], hash), null);
});

test("share URLs drop arbitrary query tokens and identify local hosts", async () => {
  const graph = normalizeGraph(SAMPLE_GRAPHS[0]);
  const url = await createShareUrl(graph, "https://atlas.example/app/index.html?token=private&campaign=ad#old");
  assert.equal(url.startsWith("https://atlas.example/app/index.html#map="), true);
  assert.equal(url.includes("token="), false);
  assert.equal(isLocalShareHost("[::1]"), true);
  assert.equal(isLocalShareHost("localhost"), true);
  assert.notEqual(await shareKey("#map=r.a"), await shareKey("#map=r.b"));
});

test("preserves optional chart measurements and evidence through a share fragment", async () => {
  const graph = normalizeGraph({
    schemaVersion: 1,
    project: { name: "Measured path" },
    nodes: [{ id: "entry", label: "Entry", chart: {
      label: "Calls per interval",
      kind: "line",
      values: [2, 4, 3],
      unit: "calls",
      evidence: "src/telemetry.ts: response counter snapshot",
    } }],
    edges: [],
  });
  assert.deepEqual(await decodeShareHash(await encodeShareHash(graph)), graph);
});

test("light SVG exports preserve the warm palette and accessible measured chart", () => {
  const graph = normalizeGraph({
    schemaVersion: 1,
    project: { name: "Measured flow" },
    nodes: [{ id: "chart", label: "Request path", type: "Service", chart: {
      label: "Requests by step", kind: "area", categories: ["Step 01", "Step 02", "Step 03"], order: "dependency stage", values: [1, 2, 1], unit: "calls", evidence: "src/counter.ts, sample window <redacted> & local",
    } }],
    edges: [],
  });
  const svg = buildSvg(graph, "light");
  assert.match(svg, /--export-canvas:#d4d5cd/);
  assert.match(svg, /--export-card:#f4f5ee/);
  assert.match(svg, /--chart-accent:#c3d32c/);
  assert.match(svg, /aria-label="Requests by step\. Ordered by dependency stage\. Step 01: 1 calls; Step 02: 2 calls; Step 03: 1 calls\. Unit: calls\. Evidence: src\/counter\.ts, sample window &lt;redacted&gt; &amp; local"/);
  assert.match(svg, /Step 01: 1 calls/);
  assert.match(svg, /Step 01 1<\/text>/);
  assert.match(svg, /Ordered by dependency stage\./);
  assert.doesNotMatch(svg, /Ordered by dependency stage\.\./);
  assert.match(svg, /fill-opacity="\.2"/);
  assert.match(svg, /height="200" rx="18"/);
  assert.doesNotMatch(svg, /card-accent|width="4"/);
});





test("exports legacy unlabeled charts as discrete bars with an explicit explanation", () => {
  const graph = normalizeGraph({ schemaVersion: 1, project: { name: "Legacy series" }, nodes: [{ id: "chart", label: "Old chart", chart: { label: "Values", kind: "line", values: [1, 4, 2], evidence: "legacy data" } }], edges: [] });
  const svg = buildSvg(graph);
  assert.match(svg, /Legacy chart: category labels and ordering were not supplied/);
  assert.match(svg, /no implied trend/);
  assert.equal(svg.includes("stroke=\"var(--chart-accent)\""), false);
  assert.equal(svg.split("fill=\"var(--chart-accent)\"").length - 1, 3);
});

test("preserves optional details, chart categories, and junction markers through v1 JSON and share links", async () => {
  const graph = normalizeGraph({ schemaVersion: 1, project: { name: "Bounded details" }, nodes: [
    { id: "api", label: "API", details: { purpose: "Receives requests", operation: "Validates <request> & routes it", inputs: ["HTTP request"], outputs: ["JSON response"], dependencies: ["branch"], evidence: ["src/api.ts: route"], uncertainty: ["Retries not shown"] }, chart: { label: "Tests by suite", kind: "bar", values: [16, 8, 25], categories: ["Channel <beta>", "Agent", "End-to-end"], unit: "tests", evidence: "DEMONSTRATION only" } },
    { id: "junction", label: "Existing junction", type: "Junction", junction: true },
    { id: "branch-target", label: "Branch target", type: "Agent" },
  ], edges: [{ id: "to-junction", source: "api", target: "junction", label: "routes", type: "control" }] });
  const branched = branchEdgeCandidate(graph, { edgeId: "to-junction", expectedEdge: graph.edges[0], branchTargetId: "branch-target", junctionLabel: "New branch point", relationship: "notifies", relationshipType: "event", position: { x: 120, y: 80 } });
  assert.deepEqual(normalizeGraph(JSON.stringify(branched)), branched);
  assert.deepEqual(await decodeShareHash(await encodeShareHash(branched)), branched);
  const svg = buildSvg(branched);
  assert.match(svg, /Channel &lt;beta&gt;: 16 tests/);
  assert.match(svg, /Purpose: Receives requests/);
  assert.match(svg, /Validates &lt;request&gt; &amp; routes it/);
  assert.doesNotMatch(svg, /<request>|<beta>/);
  assert.match(svg, /src\/api.ts: route/);
  const junctionGroup = svg.match(/<g transform="translate\([^)]*\)" role="group" aria-label="Branch junction, New branch point">[\s\S]*?<\/g>/)?.[0] || "";
  assert.match(junctionGroup, /<circle cx="18" cy="18" r="14"/);
  assert.match(junctionGroup, /<circle cx="0" cy="18" r="4"/);
  assert.match(junctionGroup, /<circle cx="36" cy="18" r="4"/);
  assert.doesNotMatch(junctionGroup, /<rect/);
  assert.match(svg, />routes<\/text>/);
  assert.match(svg, />notifies<\/text>/);
  assert.doesNotMatch(svg, />connects<\/text>/);
  assert.match(svg, /Channel[^<]* 16<\/text>/);
});

test("deleting a project clears only its exact current share fragment", () => {
  const project = { shareSourceHash: "#map=g.shared-snapshot" };
  assert.equal(shouldClearShareFragmentForDeletedProject(project, "#map=g.shared-snapshot"), true);
  assert.equal(shouldClearShareFragmentForDeletedProject(project, "#map=g.other-snapshot"), false);
  assert.equal(shouldClearShareFragmentForDeletedProject(project, "#settings"), false);
  assert.equal(shouldClearShareFragmentForDeletedProject({}, "#map=g.shared-snapshot"), false);
});