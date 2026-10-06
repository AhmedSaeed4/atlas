import test from "node:test";
import assert from "node:assert/strict";
import { buildAgentPrompt } from "../public/src/prompt.js";
import { normalizeGraph } from "../public/src/schema.js";

test("agent prompt asks for a delivery mode before work and keeps outputs conditional", () => {
  const prompt = buildAgentPrompt("https://atlas.example/view?token=private#old", false);
  const question = "Would you like a JSON file to import into Atlas yourself, or should I generate the file and a clickable link that opens it directly in Atlas?";
  assert.equal(prompt.split("\n", 1)[0], question);
  assert.ok(prompt.includes("Honor an explicit choice without asking again"));
  assert.ok(prompt.includes("wait for the answer before inspecting the repository or creating any output"));
  assert.ok(prompt.includes("Manual: inspect the repository and create only architecture-map.json"));
  assert.ok(prompt.includes("Do not create a helper, build or return a viewer URL"));
  assert.ok(prompt.includes("Automatic: inspect the repository and create architecture-map.json plus the local make_atlas_link.py helper"));
  assert.ok(prompt.includes("https://atlas.example/view"));
  assert.ok(!prompt.includes("token=private") && !prompt.includes("#old"));
  assert.ok(prompt.includes("direct viewer link as a named Markdown link"));
  assert.ok(prompt.includes("800 nodes, 2,400 edges, and 2 MiB"));
  assert.ok(prompt.includes('if len(graph.get("nodes", [])) > 800 or len(graph.get("edges", [])) > 2400:'));
  assert.ok(prompt.includes("raw_bytes = graph_path.read_bytes()"));
  assert.ok(prompt.includes("formatted_input = json.dumps(graph, ensure_ascii=False, indent=2).encode(\"utf-8\")"));
  assert.ok(prompt.includes("if len(raw_bytes) > 2 * 1024 * 1024:"));
  assert.ok(prompt.includes("if len(formatted_input) > 2 * 1024 * 1024:"));
  assert.ok(prompt.indexOf("if len(raw_bytes)") < prompt.indexOf("json.loads(raw_bytes.decode"));
  assert.ok(prompt.indexOf("if len(formatted_input)") < prompt.indexOf("payload = json.dumps(graph"));
  assert.ok(prompt.indexOf("payload = json.dumps(graph") < prompt.indexOf("gzip.compress(payload"));
  assert.ok(!prompt.includes("if len(payload) > 2 * 1024 * 1024:"));
  assert.ok(prompt.includes("Atlas normalizes records and measures its own canonical export"));
  assert.ok(prompt.includes("Never upload, POST, publish, or send graph data anywhere"));
  assert.ok(prompt.includes('BASE_URL = "https://atlas.example/view"'));
});

test("agent prompt warns that local development links stay on this computer", () => {
  const prompt = buildAgentPrompt("http://127.0.0.1:4173/", true);
  assert.ok(prompt.includes("works only on this computer"));
  assert.ok(prompt.includes("static app deployed at a public URL"));
});

test("agent prompt only asks for charts with evidence and bounded values", () => {
  const prompt = buildAgentPrompt("https://atlas.example/view", false);
  assert.ok(prompt.includes('"chart": {'));
  assert.ok(prompt.includes("The chart field is optional"));
  assert.ok(prompt.includes("nonempty evidence string"));
  assert.ok(prompt.includes("do not invent telemetry or dates"));
  assert.ok(prompt.includes("2 to 32 finite numbers"));
  assert.ok(prompt.includes("one clear category label per value"));
  assert.ok(prompt.includes("operation to 1,000; each list to 8 items of at most 240 characters"));
  assert.ok(prompt.includes("Chart categories must match the value count"));
  assert.ok(prompt.includes("In Automatic mode only: return the direct viewer link as a named Markdown link"));
});


test("agent prompt defines truthful presentation junction topology as optional", () => {
  const prompt = buildAgentPrompt("https://atlas.example/view", false);
  assert.ok(prompt.includes('"type": "Junction", "junction": true'));
  assert.ok(prompt.includes("not a runtime software component"));
  assert.ok(prompt.includes("only for genuine fan-out"));
  assert.ok(prompt.includes("never force them into ordinary flows"));
  assert.ok(prompt.includes("keep the original direction and relationship on source->junction"));

  const heading = "Illustrative minimal version 1 topology";
  const from = prompt.indexOf(heading);
  const start = prompt.indexOf("{", from);
  const end = prompt.indexOf("\nFor a genuine split", start);
  const topology = JSON.parse(prompt.slice(start, end));
  const graph = normalizeGraph(topology);
  const junction = graph.nodes.find((node) => node.id === "split");
  assert.equal(junction?.type, "Junction");
  assert.equal(junction?.junction, true);
  assert.deepEqual(graph.edges.map((edge) => [edge.source, edge.target, edge.label]), [
    ["source", "split", "original evidenced relation [observed]"],
    ["split", "target", ""],
    ["split", "branch-target", "evidenced branch relation [observed]"],
  ]);
});
