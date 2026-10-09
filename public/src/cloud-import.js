import { createRandomWorkspaceId, normalizeWorkspaceId } from "./cloud-model.js";
import { normalizeEditableGraph } from "./schema.js";

export function canImportArchitecture({ destination = "local", canEdit = false, sharedViewer = false, ownerUid = "" } = {}) {
  if (sharedViewer) return false;
  return destination === "cloud" ? Boolean(ownerUid) : canEdit;
}

async function graphDigest(text) {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}

// Only a candidate ID is stored; imported graph data never enters the local library.
export function createCloudImportController({ account, storage, createWorkspace, idFactory = createRandomWorkspaceId, fingerprint = graphDigest } = {}) {
  let pending = null;
  const completed = new Set();
  const ownerIsCurrent = uid => account.getState()?.status === "ready" && account.getState()?.user?.uid === uid;
  function importMap({ graph, ownerUid, isCurrent = () => true } = {}) {
    let snapshot, text;
    try { snapshot = normalizeEditableGraph(graph); text = JSON.stringify(snapshot); }
    catch (error) { return Promise.reject(error); }
    const uid = String(ownerUid || "");
    if (pending) {
      if (pending.ownerUid === uid && pending.text === text) return pending.promise;
      return Promise.reject(new Error("Another cloud import is still in progress. Wait for it to finish."));
    }
    const record = { ownerUid: uid, text, promise: null };
    const current = () => ownerIsCurrent(uid) && isCurrent() !== false;
    record.promise = Promise.resolve().then(async () => {
      if (!uid || !ownerIsCurrent(uid)) throw new Error("Sign in to the account that started this cloud import and try again.");
      if (!current()) return { status: "stale" };
      const digest = await fingerprint(text);
      if (!current()) return { status: "stale" };
      const key = "atlas.cloud-import.candidate.v1:" + encodeURIComponent(uid) + ":" + digest;
      let candidate;
      try {
        const stored = storage?.getItem(key);
        candidate = stored && !completed.has(key + ":" + stored) ? normalizeWorkspaceId(stored) : idFactory();
        if (!storage || typeof storage.setItem !== "function") throw new Error("Storage unavailable");
        storage.setItem(key, candidate);
      } catch {
        throw new Error("Atlas could not prepare a safe cloud import. Free some browser storage and try again. No map was uploaded.");
      }
      const service = await account.getService();
      if (!current()) return { status: "stale" };
      const workspace = await createWorkspace({ service, graph: snapshot, ownerUid: uid, workspaceId: candidate });
      if (workspace?.id !== candidate || String(workspace?.ownerId || "") !== uid) {
        throw new Error("The cloud import could not be confirmed for this account. Retry with the same JSON.");
      }
      completed.add(key + ":" + candidate);
      try { if (storage.getItem(key) === candidate) storage.removeItem(key); } catch {}
      return { status: "saved", workspace, graph: snapshot, ownerUid: uid, current: current() };
    }).finally(() => { if (pending === record) pending = null; });
    pending = record;
    return record.promise;
  }
  return Object.freeze({ importMap });
}
