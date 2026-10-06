import { MAX_IMPORT_BYTES, assertGraphJsonWithinLimit, normalizeGraph } from "./schema.js";

export const MAX_SHARE_URL_CHARS = 60000;

function toBase64Url(bytes) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) throw new Error("The share link has an invalid encoded payload.");
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  let binary;
  try { binary = atob(base64); }
  catch { throw new Error("The share link payload is not valid base64url data."); }
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  if (bytes.byteLength > MAX_IMPORT_BYTES) throw new Error("The share payload exceeds the 2 MB decoded limit.");
  return bytes;
}

async function gzip(bytes) {
  if (typeof CompressionStream !== "function") return null;
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gunzipBounded(bytes) {
  if (typeof DecompressionStream !== "function") throw new Error("This browser cannot open the compressed share link. Ask the sender for a JSON export.");
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const reader = stream.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      size += result.value.byteLength;
      if (size > MAX_IMPORT_BYTES) {
        await reader.cancel();
        throw new Error("The decompressed share exceeds the 2 MB safety limit. Ask the sender for a smaller map.");
      }
      chunks.push(result.value);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("2 MB")) throw error;
    throw new Error("The compressed share link is damaged or could not be opened.");
  }
  const output = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength; }
  return output;
}

export async function encodeShareHash(graph) {
  assertGraphJsonWithinLimit(graph);
  const payload = { schemaVersion: 1, project: graph.project, nodes: graph.nodes, edges: graph.edges };
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  if (bytes.byteLength > MAX_IMPORT_BYTES) throw new Error("This map is over the 2 MB share payload limit. Download a JSON backup instead.");
  let encoded = "";
  try {
    const compressed = await gzip(bytes);
    if (compressed) encoded = "g." + toBase64Url(compressed);
  } catch {}
  if (!encoded) encoded = "r." + toBase64Url(bytes);
  let hash = "map=" + encoded;
  if (hash.length + 1 > MAX_SHARE_URL_CHARS) {
    const raw = "map=r." + toBase64Url(bytes);
    if (raw.length + 1 <= MAX_SHARE_URL_CHARS) hash = raw;
    else throw new Error("This map makes a link longer than 60,000 characters. Download its JSON backup and use the viewer's local Import JSON action.");
  }
  return "#" + hash;
}

export async function decodeShareHash(hash) {
  if (!hash || !hash.startsWith("#map=")) return null;
  if (hash.length > MAX_SHARE_URL_CHARS) throw new Error("This share link is longer than the 60,000 character safety limit.");
  const value = hash.slice(5);
  const dot = value.indexOf(".");
  if (dot < 1) throw new Error("This share link is missing its payload format.");
  const format = value.slice(0, dot);
  const bytes = fromBase64Url(value.slice(dot + 1));
  let decoded = bytes;
  if (format === "g") decoded = await gunzipBounded(bytes);
  else if (format !== "r") throw new Error("This share link uses an unsupported payload format.");
  let json;
  try { json = new TextDecoder("utf-8", { fatal: true }).decode(decoded); }
  catch { throw new Error("The share link does not contain valid UTF-8 text."); }
  try { return normalizeGraph(json, { allowEmpty: true }); }
  catch (error) { throw new Error("The share link contains an invalid architecture map. " + error.message); }
}

export function createShareUrl(graph, currentUrl = location.href) {
  const url = new URL(currentUrl);
  url.search = "";
  return encodeShareHash(graph).then((hash) => {
    url.hash = hash.slice(1);
    return url.toString();
  });
}

export function findSharedProject(projects, hash) {
  return projects.find((project) => project.shareSourceHash === hash) || null;
}

export function isLocalShareHost(hostname = location.hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}

export async function shareKey(hash) {
  if (globalThis.crypto && globalThis.crypto.subtle) {
    const digest = new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(hash)));
    return "shared-" + [...digest.slice(0, 16)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  let value = 14695981039346656037n;
  for (let index = 0; index < hash.length; index += 1) {
    value ^= BigInt(hash.charCodeAt(index));
    value = BigInt.asUintN(64, value * 1099511628211n);
  }
  return "shared-" + value.toString(16).padStart(16, "0");
}

export function shouldClearShareFragmentForDeletedProject(project, currentHash) {
  return typeof currentHash === "string"
    && currentHash.startsWith("#map=")
    && project?.shareSourceHash === currentHash;
}