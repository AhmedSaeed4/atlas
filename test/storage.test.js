import test from "node:test";
import assert from "node:assert/strict";
import { normalizeGraph } from "../public/src/schema.js";
import { branchEdgeCandidate } from "../public/src/refinement-graph.js";
import { SAMPLE_GRAPHS } from "../public/src/samples.js";
import { clearLibrary, readLibrary, writeLibrary } from "../public/src/storage.js";

const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
function fakeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    has: (key) => values.has(key),
  };
}
function useStorage(storage) {
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
}
function restoreStorage() {
  if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
  else delete globalThis.localStorage;
}

test("keeps malformed saved bytes available for recovery export", () => {
  const raw = "{ broken project library";
  useStorage(fakeStorage({ "project-atlas-library-v1": raw }));
  const state = readLibrary(normalizeGraph);
  assert.equal(state.writable, false);
  assert.equal(state.rawBackup, raw);
  assert.equal(state.projects, null);
  restoreStorage();
});

test("reads empty locally edited graphs and share identities", () => {
  const payload = {
    version: 1,
    activeId: "shared-project",
    projects: [{
      id: "shared-project", shareSourceHash: "#map=r.test", updatedAt: 10,
      graph: { schemaVersion: 1, project: { name: "Empty but valid" }, nodes: [], edges: [] },
    }],
  };
  useStorage(fakeStorage({ "project-atlas-library-v1": JSON.stringify(payload) }));
  const state = readLibrary(normalizeGraph);
  assert.equal(state.writable, true);
  assert.equal(state.projects[0].graph.nodes.length, 0);
  assert.equal(state.projects[0].shareSourceHash, "#map=r.test");
  restoreStorage();
});

test("keeps duplicate project IDs in recovery mode with original bytes intact", () => {
  const raw = JSON.stringify({
    version: 1,
    activeId: "duplicate",
    projects: [
      { id: "duplicate", graph: { schemaVersion: 1, project: { name: "First" }, nodes: [], edges: [] } },
      { id: "duplicate", graph: { schemaVersion: 1, project: { name: "Second" }, nodes: [], edges: [] } },
    ],
  });
  useStorage(fakeStorage({ "project-atlas-library-v1": raw }));
  const state = readLibrary(normalizeGraph);
  assert.equal(state.writable, false);
  assert.equal(state.projects, null);
  assert.equal(state.rawBackup, raw);
  assert.match(state.error, /duplicate project IDs/i);
  restoreStorage();
});

test("preserves saved maps and edited examples while recognizing request-flow identity", () => {
  const sample = SAMPLE_GRAPHS.find((graph) => graph.project.name === "Request flow demo");
  const payload = {
    version: 1,
    activeId: "legacy-flow",
    projects: [
      { id: "legacy-flow", graph: sample },
      { id: "user-flow", graph: { schemaVersion: 1, project: { name: "Request flow demo" }, nodes: [], edges: [] } },
      { id: "renamed-flow", exampleId: "request-flow", graph: { schemaVersion: 1, project: { name: "My renamed example" }, nodes: [], edges: [] } },
    ],
  };
  useStorage(fakeStorage({ "project-atlas-library-v1": JSON.stringify(payload) }));
  const state = readLibrary(normalizeGraph);
  assert.equal(state.writable, true);
  assert.equal(state.projects.find((project) => project.id === "legacy-flow").exampleId, "request-flow");
  assert.equal(state.projects.find((project) => project.id === "user-flow").exampleId, undefined);
  assert.equal(state.projects.find((project) => project.id === "renamed-flow").exampleId, "request-flow");
  assert.deepEqual(state.projects.map((project) => project.id), ["legacy-flow", "user-flow", "renamed-flow"]);
  assert.equal(state.projects.find((project) => project.id === "renamed-flow").graph.project.name, "My renamed example");
  assert.equal(state.projects.find((project) => project.id === "renamed-flow").graph.nodes.length, 0);
  assert.equal(writeLibrary(state.projects, state.activeId).ok, true);
  assert.deepEqual(readLibrary(normalizeGraph).projects.map((project) => project.id), ["legacy-flow", "user-flow", "renamed-flow"]);
  restoreStorage();
});

test("reports quota errors without claiming the library was saved", () => {
  useStorage({
    getItem: () => null,
    setItem: () => { const error = new Error("quota"); error.name = "QuotaExceededError"; throw error; },
    removeItem: () => {},
  });
  const result = writeLibrary([], "");
  assert.equal(result.ok, false);
  assert.match(result.error, /storage is full/i);
  restoreStorage();
});

test("clears only the Project Atlas storage key", () => {
  const storage = fakeStorage({ "project-atlas-library-v1": "saved", unrelated: "keep" });
  useStorage(storage);
  const result = clearLibrary();
  assert.equal(result.ok, true);
  assert.equal(storage.has("project-atlas-library-v1"), false);
  assert.equal(storage.has("unrelated"), true);
  restoreStorage();
});


test("a blocked local clear reports failure and keeps the raw recovery bytes", () => {
  const raw = "{broken library bytes";
  useStorage({ getItem: () => raw, setItem: () => {}, removeItem: () => { throw new Error("blocked"); } });
  const result = clearLibrary();
  assert.equal(result.ok, false);
  assert.match(result.error, /blocked local storage/i);
  const state = readLibrary(normalizeGraph);
  assert.equal(state.writable, false);
  assert.equal(state.rawBackup, raw);
  restoreStorage();
});

test("a missing library starts empty and remains empty after a clear and reload", () => {
  const storage = fakeStorage({ "atlas-theme": "light", "atlas-inspector-width": "420", unrelated: "keep" });
  useStorage(storage);

  const fresh = readLibrary(normalizeGraph);
  assert.deepEqual(fresh.projects, []);
  assert.equal(fresh.activeId, "");
  assert.equal(fresh.writable, true);

  assert.equal(writeLibrary(fresh.projects, fresh.activeId).ok, true);
  assert.deepEqual(readLibrary(normalizeGraph).projects, []);
  assert.equal(clearLibrary().ok, true);
  const reloaded = readLibrary(normalizeGraph);
  assert.deepEqual(reloaded.projects, []);
  assert.equal(reloaded.activeId, "");
  assert.equal(storage.has("atlas-theme"), true);
  assert.equal(storage.has("atlas-inspector-width"), true);
  assert.equal(storage.has("unrelated"), true);
  restoreStorage();
});

test("reloads optional details and explicit junction nodes from the existing local library", () => {
  const storage = fakeStorage();
  useStorage(storage);
  const graph = normalizeGraph({ schemaVersion: 1, project: { name: "Junction reload" }, nodes: [
    { id: "source", label: "Source", type: "Service", details: { purpose: "Publishes requests", operation: "Sends the saved event", outputs: ["Request event"], evidence: ["src/events.ts: publish"] } },
    { id: "junction", label: "Branch junction", type: "Junction", junction: true },
  ], edges: [{ id: "original", source: "source", target: "junction", label: "publishes" }] });
  const branched = branchEdgeCandidate(graph, { edgeId: "original", expectedEdge: graph.edges[0], branchTargetId: "source", junctionLabel: "Split point", relationship: "routes back", position: { x: 40, y: 60 } });
  assert.equal(writeLibrary([{ id: "local-project", graph: branched }], "local-project").ok, true);
  const restored = readLibrary(normalizeGraph);
  assert.equal(restored.writable, true);
  assert.deepEqual(restored.projects[0].graph, branched);
  restoreStorage();
});
