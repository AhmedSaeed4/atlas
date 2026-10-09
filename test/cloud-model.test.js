import test from "node:test";
import assert from "node:assert/strict";
import {
  CLOUD_LIMITS,
  createRandomWorkspaceId,
  createWorkspaceViewUrl,
  decodeCloudGraphChunks,
  encodeCloudGraph,
  normalizeWorkspaceId,
  normalizeWorkspaceMetadata,
} from "../public/src/cloud-model.js";

const sampleGraph = (count = 1) => ({
  schemaVersion: 1,
  project: { name: "Cloud map", description: "Unicode 🛰️", type: "Software project" },
  nodes: Array.from({ length: count }, (_, index) => ({
    id: "node-" + index,
    label: "Node " + index,
    type: "Service",
    description: index === 0 ? "🧭".repeat(500) : "A supported description",
  })),
  edges: [],
});

test("cloud workspace IDs contain 128 random bits and reject malformed links", () => {
  const deterministicCrypto = {
    getRandomValues(bytes) {
      for (let index = 0; index < bytes.length; index += 1) bytes[index] = index;
      return bytes;
    },
  };
  const id = createRandomWorkspaceId(deterministicCrypto);
  assert.equal(id.length, 22);
  assert.match(id, /^[A-Za-z0-9_-]{22}$/);
  assert.equal(normalizeWorkspaceId(id), id);
  assert.throws(() => normalizeWorkspaceId("short"), { code: "invalid-id" });
});

test("Unicode graph chunks stay within UTF-8 byte bounds and decode in order", () => {
  const largeGraph = {
    schemaVersion: 1,
    project: { name: "Cloud map", description: "Unicode 🛰️", type: "Software project" },
    nodes: Array.from({ length: 200 }, (_, index) => ({
      id: "node-" + index,
      label: "Node " + index,
      type: "Service",
      description: "🧭".repeat(500),
    })),
    edges: [],
  };
  const encoded = encodeCloudGraph(largeGraph);
  assert.ok(encoded.chunkCount > 1);
  assert.equal(encoded.chunkCount, encoded.chunks.length);
  assert.ok(encoded.chunks.every((chunk, index) => chunk.index === index));
  assert.ok(encoded.chunks.every((chunk) => new TextEncoder().encode(chunk.text).length <= CLOUD_LIMITS.maxChunkBytes));
  assert.equal(encoded.byteLength, new TextEncoder().encode(encoded.json).length);
  const decoded = decodeCloudGraphChunks(encoded);
  assert.deepEqual(decoded.graph, encoded.graph);
  assert.equal(decoded.byteLength, encoded.byteLength);
  assert.throws(() => decodeCloudGraphChunks({ ...encoded, chunks: [...encoded.chunks].reverse() }), { code: "invalid-chunk" });
  assert.throws(() => decodeCloudGraphChunks({ ...encoded, byteLength: encoded.byteLength + 1 }), { code: "invalid-size" });
});

test("empty online graphs round-trip for deleting the last node", () => {
  const encoded = encodeCloudGraph({ schemaVersion: 1, project: { name: "Empty map" }, nodes: [], edges: [] });
  assert.equal(encoded.graph.nodes.length, 0);
  const decoded = decodeCloudGraphChunks(encoded);
  assert.equal(decoded.graph.nodes.length, 0);
  assert.deepEqual(decoded.graph.edges, []);
});

test("exact 2 MiB payload is accepted; over-limit imports are rejected", () => {
  const base = JSON.stringify({
    schemaVersion: 1,
    project: { name: "Maximum" },
    nodes: [{ id: "n1", label: "One", type: "Service" }],
    edges: [],
  });
  const json = base + " ".repeat(CLOUD_LIMITS.maxGraphBytes - base.length);
  const chunks = [];
  const width = CLOUD_LIMITS.maxGraphBytes / CLOUD_LIMITS.maxChunkCount;
  for (let index = 0; index < CLOUD_LIMITS.maxChunkCount; index += 1) {
    chunks.push({ index, text: json.slice(index * width, (index + 1) * width) });
  }
  const decoded = decodeCloudGraphChunks({ chunks, chunkCount: 8, byteLength: CLOUD_LIMITS.maxGraphBytes });
  assert.equal(decoded.byteLength, CLOUD_LIMITS.maxGraphBytes);
  assert.equal(decoded.graph.nodes.length, 1);
  assert.throws(() => encodeCloudGraph(json + " "), /larger than the 2 MB import limit/);
});

test("workspace metadata validates empty graph counts and rejects invalid revisions or sizes", () => {
  const metadata = {
    schemaVersion: 1,
    ownerId: "owner-1",
    shared: false,
    deleting: false,
    name: "Empty map",
    projectType: "Software project",
    currentRevision: "R".repeat(22),
    previousRevision: null,
    chunkCount: 1,
    byteLength: 20,
    nodeCount: 0,
    edgeCount: 0,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };
  assert.equal(normalizeWorkspaceMetadata("A".repeat(22), metadata).nodeCount, 0);
  assert.throws(() => normalizeWorkspaceMetadata("A".repeat(22), { ...metadata, chunkCount: 9 }), { code: "invalid-metadata" });
  assert.throws(() => normalizeWorkspaceMetadata("A".repeat(22), { ...metadata, currentRevision: "short" }), { code: "invalid-metadata" });
});

test("share URL includes only the random route ID and preserves the static subdirectory", () => {
  const id = "A".repeat(22);
  const url = createWorkspaceViewUrl(id, "https://example.test/atlas/index.html?local=1#data");
  assert.equal(url, "https://example.test/atlas/workspace?view=" + id);
});