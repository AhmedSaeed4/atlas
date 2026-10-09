import {
  LIMITS,
  MAX_IMPORT_BYTES,
  normalizeGraph,
  serializeGraphJson,
} from "./schema.js";

export const CLOUD_LIMITS = Object.freeze({
  maxGraphBytes: MAX_IMPORT_BYTES,
  maxChunkBytes: 288 * 1024,
  maxChunkCount: 8,
  workspaceIdBytes: 16,
  maxWorkspaceName: 120,
  maxProjectType: 60,
  maxNodes: LIMITS.nodes,
  maxEdges: LIMITS.edges,
});

const encoder = new TextEncoder();
const WORKSPACE_ID_PATTERN = /^[A-Za-z0-9_-]{22}$/;

export class CloudModelError extends Error {
  constructor(message, code = "invalid-data", options = {}) {
    super(message, options);
    this.name = "CloudModelError";
    this.code = code;
  }
}

export function normalizeWorkspaceId(value) {
  if (typeof value !== "string" || !WORKSPACE_ID_PATTERN.test(value)) {
    throw new CloudModelError("This online workspace link is invalid.", "invalid-id");
  }
  return value;
}

export function createRandomWorkspaceId(cryptoApi = globalThis.crypto) {
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== "function") {
    throw new CloudModelError("Secure random IDs are unavailable in this browser.", "crypto-unavailable");
  }
  const bytes = new Uint8Array(CLOUD_LIMITS.workspaceIdBytes);
  cryptoApi.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = globalThis.btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return normalizeWorkspaceId(encoded);
}

export function normalizeWorkspaceName(value, fallback = "") {
  const candidate = value === undefined || value === null ? fallback : value;
  if (typeof candidate !== "string") {
    throw new CloudModelError("Workspace name must be text.", "invalid-name");
  }
  const name = candidate.trim();
  if (!name) throw new CloudModelError("Workspace name is required.", "invalid-name");
  if (name.length > CLOUD_LIMITS.maxWorkspaceName) {
    throw new CloudModelError(
      "Workspace name must be " + CLOUD_LIMITS.maxWorkspaceName + " characters or fewer.",
      "invalid-name",
    );
  }
  return name;
}

function splitUtf8Text(text, maxBytes) {
  const output = [];
  let parts = [];
  let size = 0;

  const flush = () => {
    if (!parts.length) return;
    output.push({ text: parts.join(""), byteLength: size });
    parts = [];
    size = 0;
  };

  for (const character of text) {
    const characterBytes = encoder.encode(character).byteLength;
    if (characterBytes > maxBytes) {
      throw new CloudModelError("A text character exceeds the cloud chunk limit.", "chunk-too-large");
    }
    if (size + characterBytes > maxBytes) flush();
    parts.push(character);
    size += characterBytes;
  }
  flush();

  if (!output.length) output.push({ text: "", byteLength: 0 });
  return output.map((chunk, index) => ({ index, ...chunk }));
}

export function encodeCloudGraph(input, { name } = {}) {
  let graph;
  try {
    graph = normalizeGraph(input, { allowEmpty: true });
  } catch (error) {
    throw new CloudModelError(error.message, "invalid-graph", { cause: error });
  }
  if (name !== undefined) graph.project.name = normalizeWorkspaceName(name, graph.project.name);
  const json = serializeGraphJson(graph, 2);
  const byteLength = encoder.encode(json).byteLength;
  if (byteLength > CLOUD_LIMITS.maxGraphBytes) {
    throw new CloudModelError(
      "This graph exceeds Atlas's 2 MiB online workspace limit. Shorten optional details or reduce the map before saving.",
      "graph-too-large",
    );
  }

  const chunks = splitUtf8Text(json, CLOUD_LIMITS.maxChunkBytes);
  if (chunks.length > CLOUD_LIMITS.maxChunkCount) {
    throw new CloudModelError("This graph needs too many cloud chunks to save safely.", "too-many-chunks");
  }
  return Object.freeze({
    graph,
    json,
    byteLength,
    chunkCount: chunks.length,
    chunks: Object.freeze(chunks.map((chunk) => Object.freeze(chunk))),
  });
}

export function decodeCloudGraphChunks({ chunks, chunkCount, byteLength }) {
  if (!Number.isInteger(chunkCount) || chunkCount < 1 || chunkCount > CLOUD_LIMITS.maxChunkCount) {
    throw new CloudModelError("The online workspace has an invalid chunk count.", "invalid-metadata");
  }
  if (!Number.isInteger(byteLength) || byteLength < 1 || byteLength > CLOUD_LIMITS.maxGraphBytes) {
    throw new CloudModelError("The online workspace has an invalid size.", "invalid-metadata");
  }
  if (!Array.isArray(chunks) || chunks.length !== chunkCount) {
    throw new CloudModelError("The online workspace is missing one or more graph chunks.", "missing-chunk");
  }

  let totalBytes = 0;
  const ordered = [];
  for (let index = 0; index < chunkCount; index += 1) {
    const chunk = chunks[index];
    if (!chunk || chunk.index !== index || typeof chunk.text !== "string") {
      throw new CloudModelError("The online workspace graph chunks are out of order.", "invalid-chunk");
    }
    const actualBytes = encoder.encode(chunk.text).byteLength;
    if (actualBytes > CLOUD_LIMITS.maxChunkBytes) {
      throw new CloudModelError("The online workspace contains an oversized graph chunk.", "chunk-too-large");
    }
    totalBytes += actualBytes;
    if (totalBytes > CLOUD_LIMITS.maxGraphBytes) {
      throw new CloudModelError("The online workspace graph exceeds the 2 MiB limit.", "graph-too-large");
    }
    ordered.push(chunk.text);
  }
  if (totalBytes !== byteLength) {
    throw new CloudModelError("The online workspace graph size does not match its metadata.", "invalid-size");
  }

  const json = ordered.join("");
  let graph;
  try {
    graph = normalizeGraph(json, { allowEmpty: true });
  } catch (error) {
    throw new CloudModelError(
      "The online workspace contains an invalid graph: " + error.message,
      "invalid-graph",
      { cause: error },
    );
  }
  return Object.freeze({ graph, json, byteLength: totalBytes, chunkCount });
}

export function normalizeWorkspaceMetadata(id, data) {
  normalizeWorkspaceId(id);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new CloudModelError("The online workspace metadata is invalid.", "invalid-metadata");
  }
  const validText = (value, max, required = true) => typeof value === "string"
    && value.length <= max
    && (!required || value.trim().length > 0);
  const validInt = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

  if (data.schemaVersion !== 1
      || typeof data.ownerId !== "string"
      || !data.ownerId
      || typeof data.shared !== "boolean"
      || typeof data.deleting !== "boolean"
      || !validText(data.name, CLOUD_LIMITS.maxWorkspaceName)
      || !validText(data.projectType, CLOUD_LIMITS.maxProjectType)
      || !validText(data.currentRevision, 22)
      || !WORKSPACE_ID_PATTERN.test(data.currentRevision)
      || !(data.previousRevision === null
        || (typeof data.previousRevision === "string" && WORKSPACE_ID_PATTERN.test(data.previousRevision)))
      || !validInt(data.chunkCount, 1, CLOUD_LIMITS.maxChunkCount)
      || !validInt(data.byteLength, 1, CLOUD_LIMITS.maxGraphBytes)
      || !validInt(data.nodeCount, 0, CLOUD_LIMITS.maxNodes)
      || !validInt(data.edgeCount, 0, CLOUD_LIMITS.maxEdges)) {
    throw new CloudModelError("The online workspace metadata is invalid or outside Atlas limits.", "invalid-metadata");
  }

  const timestamp = (value) => {
    if (value && typeof value.toDate === "function") {
      const date = value.toDate();
      return Number.isFinite(date.getTime()) ? date.toISOString() : null;
    }
    if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
    if (typeof value === "string" && Number.isFinite(Date.parse(value))) return new Date(value).toISOString();
    return null;
  };
  const createdAt = timestamp(data.createdAt);
  const updatedAt = timestamp(data.updatedAt);
  if (!createdAt || !updatedAt) {
    throw new CloudModelError("The online workspace timestamps are invalid.", "invalid-metadata");
  }

  return Object.freeze({
    id,
    schemaVersion: data.schemaVersion,
    ownerId: data.ownerId,
    shared: data.shared,
    deleting: data.deleting,
    name: data.name,
    projectType: data.projectType,
    currentRevision: data.currentRevision,
    previousRevision: data.previousRevision,
    chunkCount: data.chunkCount,
    byteLength: data.byteLength,
    nodeCount: data.nodeCount,
    edgeCount: data.edgeCount,
    createdAt,
    updatedAt,
  });
}

export function createWorkspaceViewUrl(workspaceId, baseUrl = globalThis.location?.href) {
  const id = normalizeWorkspaceId(workspaceId);
  if (typeof baseUrl !== "string" || !baseUrl) {
    throw new CloudModelError("A browser URL is required to make a workspace link.", "missing-base-url");
  }
  let url;
  try {
    url = new URL("./workspace", baseUrl);
  } catch (error) {
    throw new CloudModelError("The workspace link base URL is invalid.", "invalid-base-url", { cause: error });
  }
  url.search = "";
  url.searchParams.set("view", id);
  url.hash = "";
  return url.href;
}
