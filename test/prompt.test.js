import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { buildAgentPrompt } from "../public/src/prompt.js";
import { normalizeGraph } from "../public/src/schema.js";

test("agent prompt gates repository work on an explicit mode and output folder", () => {
  const prompt = buildAgentPrompt("https://atlas.example/view?token=private#old", false);
  const modeQuestion = "Would you like a JSON file to import into Atlas yourself, or should I generate the file and a clickable link that opens it directly in Atlas?";
  const folderQuestion = "Where should I create or reuse a dedicated Atlas output folder? I recommend choosing an explicit location outside the source repository.";
  assert.equal(prompt.split("\n", 1)[0], modeQuestion + " Also, " + folderQuestion[0].toLowerCase() + folderQuestion.slice(1));
  assert.ok(prompt.includes("Before reading the target repository or creating any output, establish both the delivery mode (Manual or Automatic) and the dedicated Atlas output folder."));
  assert.ok(prompt.includes("Check the user's explicit current instructions and trusted user-authored conversation history for each choice."));
  assert.ok(prompt.includes("do not infer location approval from a discovered folder"));
  assert.ok(prompt.includes("Ask only about missing items."));
  assert.ok(prompt.includes("Stop and wait until both are clear"));
  assert.ok(prompt.includes("Do not take automatic actions until Automatic mode was explicitly selected."));
  assert.ok(prompt.includes("Resolve the agreed output folder to an absolute path."));
  assert.ok(prompt.includes("Resolve a relative path only against a base explicitly named in trusted user context"));
  assert.ok(prompt.includes("Never assume the process working directory or repository root."));
  assert.ok(prompt.includes("Analyze the target repository read-only."));
  assert.ok(prompt.includes("reuse it and preserve all its contents"));
  assert.ok(prompt.includes("create only that agreed folder"));
  assert.ok(prompt.includes("architecture-map-YYYYMMDD-HHMMSS.json"));
  assert.ok(prompt.includes('Use exclusive file creation (open(..., "x") or equivalent)'));
  assert.ok(prompt.includes("retry on collisions, including concurrent runs"));
  assert.ok(prompt.includes("Never truncate, replace, or reuse an existing file."));
  assert.ok(prompt.includes("Manual: inspect the repository read-only and create exactly one new timestamped JSON"));
  assert.ok(prompt.includes("Do not create or run a helper, build or return a viewer URL"));
  assert.ok(prompt.includes("Automatic: create a new timestamped JSON and versioned helper"));
  assert.ok(prompt.includes("configured for this run's exact new JSON basename"));
  assert.ok(prompt.includes("Run the helper with no arguments and use its exact stdout URL as the destination in a named Markdown link"));
  assert.ok(prompt.includes("[Open project graph](EXACT_HELPER_STDOUT_URL)"));
  assert.ok(prompt.includes("Path(__file__).resolve().parent / GRAPH_FILENAME"));
  assert.ok(!prompt.includes('Path("architecture-map.json")'));
  assert.ok(!prompt.includes("make_atlas_link.py helper"));
  assert.ok(prompt.includes("https://atlas.example/view"));
  assert.ok(!prompt.includes("token=private") && !prompt.includes("#old"));
  assert.ok(prompt.includes("return a concise project summary and a named Markdown link whose destination is the exact no-argument helper stdout URL"));
  assert.ok(prompt.includes("800 nodes, 2,400 edges, and 2 MiB"));
  assert.ok(prompt.includes('if len(graph.get("nodes", [])) > 800 or len(graph.get("edges", [])) > 2400:'));
  assert.ok(prompt.includes("raw_bytes = graph_path.read_bytes()"));
  assert.ok(prompt.includes('formatted_input = json.dumps(graph, ensure_ascii=False, indent=2).encode("utf-8")'));
  assert.ok(prompt.includes("if len(raw_bytes) > 2 * 1024 * 1024:"));
  assert.ok(prompt.includes("if len(formatted_input) > 2 * 1024 * 1024:"));
  assert.ok(prompt.indexOf("if len(raw_bytes)") < prompt.indexOf("json.loads(raw_bytes.decode"));
  assert.ok(prompt.indexOf("if len(formatted_input)") < prompt.indexOf("payload = json.dumps(graph"));
  assert.ok(prompt.indexOf("payload = json.dumps(graph") < prompt.indexOf("gzip.compress(payload"));
  assert.ok(!prompt.includes("if len(payload) > 2 * 1024 * 1024:"));
  assert.ok(prompt.includes("This generated-shape preflight does not perform full Atlas normalization or its canonical-size check"));
  assert.ok(prompt.includes('checked_text(project.get("type"), "Project type", 60)'));
  assert.ok(prompt.includes("Never upload, POST, publish, or send graph data anywhere"));
  assert.ok(prompt.includes('BASE_URL = "https://atlas.example/view"'));
});

test("Automatic helper reads its exact graph beside itself outside the working directory", (t) => {
  const prompt = buildAgentPrompt("https://atlas.example/view", false);
  const python = process.platform === "win32" ? "python" : "python3";
  const probe = spawnSync(python, ["--version"], { encoding: "utf8" });
  if (probe.error || probe.status !== 0) {
    t.skip("Python is unavailable for the standard-library helper integration check");
    return;
  }

  const helperStart = prompt.indexOf("import base64\nimport gzip\n");
  const helperEnd = prompt.indexOf("\nThe viewer accepts", helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart, "helper source block should be present");
  const graphName = "architecture-map-20300101-000000.json";
  const helperName = "make_atlas_link-20300101-000000.py";
  const helperSource = prompt.slice(helperStart, helperEnd).replace(
    'GRAPH_FILENAME = "__ATLAS_JSON_FILENAME__"',
    "GRAPH_FILENAME = " + JSON.stringify(graphName),
  );
  assert.notEqual(helperSource, prompt.slice(helperStart, helperEnd), "helper must be configured for this exact run");

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "atlas-helper-check-"));
  const outputDirectory = path.join(root, "Atlas exports_\u65e5\u672c\u8a9e-\u03a9");
  const unrelatedWorkingDirectory = path.join(root, "another-current-directory");
  const graphPath = path.join(outputDirectory, graphName);
  const helperPath = path.join(outputDirectory, helperName);
  const preservedPath = path.join(outputDirectory, "keep-existing.txt");
  const graph = {
    schemaVersion: 1,
    project: { name: "caf\u00e9_\u65e5\u672c\u8a9e", description: "Unicode-safe fixture" },
    nodes: [{ id: "n1", label: "\u00c5ngstr\u00f6m_\u65e5\u672c\u8a9e", type: "Module" }],
    edges: [],
  };
  const graphBytes = Buffer.from(JSON.stringify(graph), "utf8");
  const preservedBytes = Buffer.from("keep this file unchanged", "utf8");

  try {
    fs.mkdirSync(outputDirectory);
    fs.mkdirSync(unrelatedWorkingDirectory);
    fs.writeFileSync(graphPath, graphBytes, { flag: "wx" });
    fs.writeFileSync(preservedPath, preservedBytes, { flag: "wx" });
    fs.writeFileSync(helperPath, helperSource, { flag: "wx" });

    const run = spawnSync(python, [helperPath], {
      cwd: unrelatedWorkingDirectory,
      encoding: "utf8",
      timeout: 15000,
    });
    assert.equal(run.status, 0, run.stderr || run.error?.message || "helper should succeed");
    const url = run.stdout.trim();
    assert.ok(url.startsWith("https://atlas.example/view#map=g."));
    const fragment = url.slice(url.indexOf("#map=g.") + "#map=g.".length);
    const decoded = JSON.parse(gunzipSync(Buffer.from(fragment, "base64url")).toString("utf8"));
    assert.deepEqual(decoded, graph);
    assert.deepEqual(fs.readFileSync(graphPath), graphBytes, "source graph must remain unchanged");
    assert.deepEqual(fs.readFileSync(preservedPath), preservedBytes, "existing output-folder files must remain unchanged");
    assert.deepEqual(fs.readdirSync(unrelatedWorkingDirectory), [], "helper must not write to the current working directory");
  } finally {
    for (const file of [helperPath, graphPath, preservedPath]) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    for (const directory of [outputDirectory, unrelatedWorkingDirectory, root]) {
      if (fs.existsSync(directory)) fs.rmdirSync(directory);
    }
  }
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
  assert.ok(prompt.includes("In Automatic mode only: return a concise project summary and a named Markdown link"));
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
test("Automatic helper rejects documented version 1 schema violations before printing a URL", (t) => {
  const prompt = buildAgentPrompt("https://atlas.example/view", false);
  const python = process.platform === "win32" ? "python" : "python3";
  const probe = spawnSync(python, ["--version"], { encoding: "utf8" });
  if (probe.error || probe.status !== 0) {
    t.skip("Python is unavailable for the standard-library helper preflight check");
    return;
  }

  const helperStart = prompt.indexOf("import base64\nimport gzip\n");
  const helperEnd = prompt.indexOf("\nThe viewer accepts", helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart, "helper source block should be present");
  const graphName = "architecture-map-20300101-000000.json";
  const helperName = "make_atlas_link-20300101-000000.py";
  const helperSource = prompt.slice(helperStart, helperEnd).replace(
    'GRAPH_FILENAME = "__ATLAS_JSON_FILENAME__"',
    "GRAPH_FILENAME = " + JSON.stringify(graphName),
  );

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "atlas-preflight-check-"));
  const outputDirectory = path.join(root, "Atlas exports_日ᧄ語-Ω");
  const unrelatedWorkingDirectory = path.join(root, "another-current-directory");
  const graphPath = path.join(outputDirectory, graphName);
  const helperPath = path.join(outputDirectory, helperName);
  const baseGraph = () => ({
    schemaVersion: 1,
    project: { name: "Atlas fixture", description: "Unicode-safe fixture" },
    nodes: [{ id: "n1", label: "Example component", type: "Module" }],
    edges: [],
  });
  const writeGraph = (graph) => fs.writeFileSync(graphPath, Buffer.from(JSON.stringify(graph), "utf8"));
  const runHelper = (graph) => {
    writeGraph(graph);
    return spawnSync(python, [helperPath], {
      cwd: unrelatedWorkingDirectory,
      encoding: "utf8",
      timeout: 15000,
    });
  };
  const decodedGraph = (url) => {
    assert.ok(url.startsWith("https://atlas.example/view#map=g."));
    const fragment = url.slice(url.indexOf("#map=g.") + "#map=g.".length);
    return JSON.parse(gunzipSync(Buffer.from(fragment, "base64url")).toString("utf8"));
  };

  try {
    fs.mkdirSync(outputDirectory);
    fs.mkdirSync(unrelatedWorkingDirectory);
    fs.writeFileSync(helperPath, helperSource, { flag: "wx" });

    const boundary = baseGraph();
    boundary.project.type = "T".repeat(60);
    assert.equal(normalizeGraph(boundary, { allowEmpty: true }).project.type.length, 60);
    const validRun = runHelper(boundary);
    assert.equal(validRun.status, 0, validRun.stderr || validRun.error?.message || "60-character type should be accepted");
    assert.deepEqual(decodedGraph(validRun.stdout.trim()), boundary);

    const trimmed = baseGraph();
    trimmed.project.type = "\uFEFF" + "T".repeat(60) + "\uFEFF";
    assert.equal(normalizeGraph(trimmed, { allowEmpty: true }).project.type.length, 60);
    const trimmedRun = runHelper(trimmed);
    assert.equal(trimmedRun.status, 0, trimmedRun.stderr || trimmedRun.error?.message || "helper should match JavaScript trim whitespace");
    assert.deepEqual(decodedGraph(trimmedRun.stdout.trim()), trimmed);

    const missingVersion = baseGraph();
    delete missingVersion.schemaVersion;
    const missingVersionRun = runHelper(missingVersion);
    assert.notEqual(missingVersionRun.status, 0, "generated-v1 helper requires the declared schema version");
    assert.equal(missingVersionRun.stdout, "", "missing schema version must not print a viewer URL");
    assert.match(missingVersionRun.stderr, /must declare schema version 1/);

    const cases = [
      ["project type length 61", (graph) => { graph.project.type = "T".repeat(61); }, /Project type must be 60 characters or fewer/],
      ["reported project type length 62", (graph) => { graph.project.type = "Mixed: AI agent backend, web frontend, workers, infrastructure"; }, /Project type must be 60 characters or fewer/],
      ["astral project type counts as two UTF-16 units", (graph) => { graph.project.type = "T".repeat(59) + "😀"; }, /Project type must be 60 characters or fewer/],
      ["project name length 121", (graph) => { graph.project.name = "N".repeat(121); }, /Project name must be 120 characters or fewer/],
      ["project description length 501", (graph) => { graph.project.description = "D".repeat(501); }, /Project description must be 500 characters or fewer/],
      ["node label length 121", (graph) => { graph.nodes[0].label = "L".repeat(121); }, /Component n1 name must be 120 characters or fewer/],
      ["node type length 61", (graph) => { graph.nodes[0].type = "T".repeat(61); }, /Component Example component type must be 60 characters or fewer/],
      ["node source length 241", (graph) => { graph.nodes[0].source = "s".repeat(241); }, /Component Example component source must be 240 characters or fewer/],
      ["node group length 101", (graph) => { graph.nodes[0].group = "g".repeat(101); }, /Component Example component group must be 100 characters or fewer/],
      ["detail purpose length 501", (graph) => { graph.nodes[0].details = { purpose: "P".repeat(501) }; }, /Component Example component purpose must be 500 characters or fewer/],
      ["detail list has a ninth item", (graph) => { graph.nodes[0].details = { inputs: Array(9).fill("input") }; }, /Component Example component inputs must contain 8 items or fewer/],
      ["detail list item length 241", (graph) => { graph.nodes[0].details = { evidence: ["E".repeat(241)] }; }, /Component Example component evidence item 1 must be 240 characters or fewer/],
      ["chart label length 81", (graph) => { graph.nodes[0].chart = { label: "C".repeat(81), kind: "bar", values: [1, 2], categories: ["a", "b"], evidence: "source" }; }, /Chart for Example component label must be 80 characters or fewer/],
      ["chart evidence length 241", (graph) => { graph.nodes[0].chart = { label: "counts", kind: "bar", values: [1, 2], categories: ["a", "b"], evidence: "E".repeat(241) }; }, /Chart for Example component evidence must be 240 characters or fewer/],
      ["chart values exceed the magnitude limit", (graph) => { graph.nodes[0].chart = { label: "counts", kind: "bar", values: [1000000000001, 2], categories: ["a", "b"], evidence: "source" }; }, /Chart for Example component point 1 must be a finite number within 1000000000000/],
      ["bar categories do not match values", (graph) => { graph.nodes[0].chart = { label: "counts", kind: "bar", values: [1, 2], categories: ["a"], evidence: "source" }; }, /Bar chart for Example component needs one category label for each value/],
      ["edge label length 101", (graph) => { graph.edges = [{ id: "e1", source: "n1", target: "n1", label: "E".repeat(101) }]; }, /Connection e1 label must be 100 characters or fewer/],
      ["missing edge endpoint", (graph) => { graph.edges = [{ id: "e1", source: "n1", target: "missing" }]; }, /Connection 1 refers to missing component "missing"/],
    ];

    for (const [name, mutate, expectedError] of cases) {
      const invalid = baseGraph();
      mutate(invalid);
      assert.throws(() => normalizeGraph(invalid, { allowEmpty: true }), expectedError, name);
      const run = runHelper(invalid);
      assert.notEqual(run.status, 0, name + " must fail before link creation");
      assert.equal(run.stdout, "", name + " must not print a viewer URL");
      assert.match(run.stderr, expectedError, name + " should report the invalid field");
    }
    assert.deepEqual(fs.readdirSync(unrelatedWorkingDirectory), [], "helper must not write in the current working directory");
  } finally {
    for (const file of [helperPath, graphPath]) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    for (const directory of [outputDirectory, unrelatedWorkingDirectory, root]) {
      if (fs.existsSync(directory)) fs.rmdirSync(directory);
    }
  }
});
test("Automatic helper emits its exact round-tripped link URL and rejects corrupted or altered destinations", (t) => {
  const prompt = buildAgentPrompt("https://atlas.example/view", false);
  assert.ok(prompt.includes("stdout as the sole source for the Markdown link destination"));
  assert.ok(prompt.includes("[Open project graph](EXACT_HELPER_STDOUT_URL)"));
  assert.ok(!prompt.includes("--write-delivery"));
  assert.ok(prompt.includes("--verify-url-file PATH"));
  assert.ok(prompt.includes("exact no-argument helper stdout URL"));
  assert.ok(!prompt.includes("local HTML launcher"));
  assert.ok(prompt.includes("round_trip_bytes != payload"));
  assert.ok(prompt.indexOf("round_trip_bytes != payload") < prompt.indexOf("print(link)"));
  assert.ok(prompt.indexOf("Candidate URL file does not exactly match") < prompt.indexOf("if verified_candidate_path is not None:"));

  const python = process.platform === "win32" ? "python" : "python3";
  const probe = spawnSync(python, ["--version"], { encoding: "utf8" });
  if (probe.error || probe.status !== 0) {
    t.skip("Python is unavailable for the standard-library helper integrity check");
    return;
  }
  const helperStart = prompt.indexOf("import base64\nimport gzip\n");
  const helperEnd = prompt.indexOf("\nThe viewer accepts", helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart, "helper source block should be present");

  const graphName = "architecture-map-20300101-000001.json";
  const helperName = "make_atlas_link-20300101-000001.py";
  const corruptedHelperName = "make_atlas_link-corrupt-check.py";
  const helperSource = prompt.slice(helperStart, helperEnd).replace(
    'GRAPH_FILENAME = "__ATLAS_JSON_FILENAME__"',
    "GRAPH_FILENAME = " + JSON.stringify(graphName),
  );
  const generatedUrlLine = 'link = BASE_URL + "#map=g." + encoded';
  const corruptedHelperSource = helperSource.replace(
    generatedUrlLine,
    generatedUrlLine + '\nlink = link.replace(encoded, ("A" if encoded[0] != "A" else "B") + encoded[1:])',
  );
  assert.notEqual(corruptedHelperSource, helperSource, "fault fixture should corrupt the helper's final URL");

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "atlas-link-integrity-"));
  const outputDirectory = path.join(root, "Atlas output_日本語-Ω");
  const unrelatedWorkingDirectory = path.join(root, "different-cwd");
  const graphPath = path.join(outputDirectory, graphName);
  const helperPath = path.join(outputDirectory, helperName);
  const corruptedHelperPath = path.join(outputDirectory, corruptedHelperName);
  const graph = {
    schemaVersion: 1,
    project: { name: "Café_日本語", description: "Exact UTF-8 helper round trip", type: "Mixed software" },
    nodes: [{ id: "n1", label: "API", type: "Service", description: "A component", source: "src/api.js" }],
    edges: [],
  };
  const expectedPayload = Buffer.from(JSON.stringify(graph), "utf8");

  try {
    fs.mkdirSync(outputDirectory);
    fs.mkdirSync(unrelatedWorkingDirectory);
    fs.writeFileSync(graphPath, expectedPayload, { flag: "wx" });
    fs.writeFileSync(helperPath, helperSource, { flag: "wx" });
    fs.writeFileSync(corruptedHelperPath, corruptedHelperSource, { flag: "wx" });

    const run = spawnSync(python, [helperPath], {
      cwd: unrelatedWorkingDirectory,
      encoding: "utf8",
      timeout: 15000,
    });
    assert.equal(run.status, 0, run.stderr || run.error?.message || "helper should emit a verified URL");
    const outputLines = run.stdout.split(/\r?\n/);
    assert.equal(outputLines.length, 2, "stdout must contain one URL line and its final newline");
    assert.equal(outputLines[1], "");
    const url = outputLines[0];
    assert.ok(url.startsWith("https://atlas.example/view#map=g."));
    const fragment = url.slice(url.indexOf("#map=g.") + "#map=g.".length);
    const decodedBytes = gunzipSync(Buffer.from(fragment, "base64url"));
    assert.deepEqual(decodedBytes, expectedPayload, "verbatim helper output must encode the exact source JSON bytes");
    assert.deepEqual(JSON.parse(decodedBytes.toString("utf8")), graph);

    const exactCandidatePath = path.join(outputDirectory, "captured-link-destination.txt");
    const changedCandidatePath = path.join(outputDirectory, "captured-link-changed.txt");
    const oversizedCandidatePath = path.join(outputDirectory, "captured-link-oversized.txt");
    const missingCandidatePath = path.join(outputDirectory, "captured-link-missing.txt");
    fs.writeFileSync(exactCandidatePath, url + "\n", { flag: "wx" });
    const verified = spawnSync(python, [helperPath, "--verify-url-file", exactCandidatePath], { cwd: unrelatedWorkingDirectory, encoding: "utf8", timeout: 15000 });
    assert.equal(verified.status, 0, verified.stderr || verified.error?.message || "the exact captured Markdown destination should verify");
    assert.match(verified.stdout, /Candidate URL file verified/);
    assert.doesNotMatch(verified.stdout, /#map=/, "candidate verification should not print the URL again");

    const alteredCharacters = Array.from(url);
    const fragmentStart = url.indexOf("#map=g.") + "#map=g.".length;
    for (const offset of [2, 19, 47, 89, 151, 277]) {
      const index = fragmentStart + offset;
      alteredCharacters[index] = alteredCharacters[index] === "A" ? "B" : "A";
    }
    alteredCharacters.splice(fragmentStart + 401, 1);
    fs.writeFileSync(changedCandidatePath, alteredCharacters.join("") + "\n", { flag: "wx" });
    const changed = spawnSync(python, [helperPath, "--verify-url-file", changedCandidatePath], { cwd: unrelatedWorkingDirectory, encoding: "utf8", timeout: 15000 });
    assert.notEqual(changed.status, 0, "changed characters and a deletion must fail");
    assert.equal(changed.stdout, "", "a failed candidate must not print any URL");
    assert.match(changed.stderr, /does not exactly match/);

    fs.writeFileSync(oversizedCandidatePath, Buffer.alloc(60002, 65), { flag: "wx" });
    const oversized = spawnSync(python, [helperPath, "--verify-url-file", oversizedCandidatePath], { cwd: unrelatedWorkingDirectory, encoding: "utf8", timeout: 15000 });
    assert.notEqual(oversized.status, 0);
    assert.equal(oversized.stdout, "");
    assert.match(oversized.stderr, /exceeds the 60,000 character limit/);
    const missing = spawnSync(python, [helperPath, "--verify-url-file", missingCandidatePath], { cwd: unrelatedWorkingDirectory, encoding: "utf8", timeout: 15000 });
    assert.notEqual(missing.status, 0);
    assert.equal(missing.stdout, "");
    assert.match(missing.stderr, /Could not read candidate URL file/);

    const corruptedRun = spawnSync(python, [corruptedHelperPath], {
      cwd: unrelatedWorkingDirectory,
      encoding: "utf8",
      timeout: 15000,
    });
    assert.notEqual(corruptedRun.status, 0, "a corrupted final fragment must fail the helper");
    assert.equal(corruptedRun.stdout, "", "the helper must not print a corrupted URL");
    assert.match(corruptedRun.stderr, /failed its local base64\/gzip round-trip/);
    assert.deepEqual(fs.readdirSync(unrelatedWorkingDirectory), [], "helper must not write into the current working directory");
  } finally {
    for (const file of [helperPath, corruptedHelperPath, graphPath, path.join(outputDirectory, "captured-link-destination.txt"), path.join(outputDirectory, "captured-link-changed.txt"), path.join(outputDirectory, "captured-link-oversized.txt")]) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    for (const directory of [outputDirectory, unrelatedWorkingDirectory, root]) {
      if (fs.existsSync(directory)) fs.rmdirSync(directory);
    }
  }
});
