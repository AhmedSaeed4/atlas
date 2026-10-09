import { assertGraphJsonWithinLimit, normalizeGraph } from "./schema.js";

const DRAFT_PREFIX = "atlas.online.owner-draft.v1:";

function draftKey(ownerUid, workspaceId) {
  const uid = String(ownerUid || "");
  const id = String(workspaceId || "");
  if (!uid || !id) return "";
  return DRAFT_PREFIX + encodeURIComponent(uid) + ":" + encodeURIComponent(id);
}

function validGraph(graph) {
  if (!graph || typeof graph !== "object" || Array.isArray(graph) || graph.schemaVersion !== 1
      || !graph.project || typeof graph.project !== "object" || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return false;
  try {
    assertGraphJsonWithinLimit(normalizeGraph(graph, { allowEmpty: true }));
    return true;
  } catch { return false; }
}

export function readOnlineOwnerDraft(storage, ownerUid, workspaceId) {
  const key = draftKey(ownerUid, workspaceId);
  if (!key) return null;
  try {
    const raw = storage?.getItem(key);
    if (!raw || raw.length > 4_500_000) return null;
    const draft = JSON.parse(raw);
    if (draft?.version !== 1
        || draft.ownerUid !== String(ownerUid)
        || draft.workspaceId !== String(workspaceId)
        || !validGraph(draft.graph)) return null;
    return draft;
  } catch { return null; }
}

export function readOnlineOwnerDraftForOwnerEdit(storage, { mode, userUid, ownerUid, workspaceId } = {}) {
  const uid = String(userUid || "");
  const creator = String(ownerUid || "");
  if (mode !== "owner" || !uid || uid !== creator) return null;
  return readOnlineOwnerDraft(storage, uid, workspaceId);
}

export function writeOnlineOwnerDraft(storage, { ownerUid, workspaceId, graph, updatedAt = Date.now() } = {}) {
  const key = draftKey(ownerUid, workspaceId);
  if (!key || !storage || typeof storage.setItem !== "function" || !validGraph(graph)) return false;
  try {
    storage?.setItem(key, JSON.stringify({
      version: 1,
      ownerUid: String(ownerUid),
      workspaceId: String(workspaceId),
      updatedAt: Number.isFinite(updatedAt) ? updatedAt : Date.now(),
      graph,
    }));
    return true;
  } catch { return false; }
}

export function clearOnlineOwnerDraftIfMatches(storage, { ownerUid, workspaceId, confirmedGraph } = {}) {
  if (!validGraph(confirmedGraph)) return false;
  const draft = readOnlineOwnerDraft(storage, ownerUid, workspaceId);
  if (!draft || JSON.stringify(draft.graph) !== JSON.stringify(confirmedGraph)) return false;
  return clearOnlineOwnerDraft(storage, ownerUid, workspaceId);
}

export function clearOnlineOwnerDraft(storage, ownerUid, workspaceId) {
  const key = draftKey(ownerUid, workspaceId);
  if (!key || !storage || typeof storage.removeItem !== "function") return false;
  try {
    storage.removeItem(key);
    return true;
  } catch { return false; }
}
