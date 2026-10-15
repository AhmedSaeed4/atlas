export const WORKSPACE_NAVIGATION_KEY = "atlas.workspace.navigation.v1";
const local = () => ({ version: 1, library: "local", ownerUid: "", workspaceId: "" });
const validUid = value => typeof value === "string" && value.length <= 128 && !/[\u0000-\u001f]/.test(value);
const validId = value => typeof value === "string" && /^[A-Za-z0-9_-]{22}$/.test(value);

function normalize(value) {
  if (value?.version !== 1 || !["local", "cloud"].includes(value.library)) return null;
  if (value.library === "local") return local();
  const ownerUid = value.ownerUid ?? "", workspaceId = value.workspaceId ?? "";
  if (!validUid(ownerUid) || typeof workspaceId !== "string" || (workspaceId && (!ownerUid || !validId(workspaceId)))) return null;
  return { version: 1, library: "cloud", ownerUid, workspaceId };
}

function readNavigationRecord(storage) {
  try {
    const raw = storage?.getItem(WORKSPACE_NAVIGATION_KEY);
    return raw && raw.length <= 1024 ? normalize(JSON.parse(raw)) : null;
  } catch { return null; }
}

export function readWorkspaceNavigation(storage) {
  return Object.freeze(readNavigationRecord(storage) || local());
}

// A navigation hint is never an identity, graph cache or permission grant.
export function createWorkspaceNavigation({ storage, tabStorage, restore = true } = {}) {
  let saved = Object.freeze(readNavigationRecord(tabStorage) || readNavigationRecord(storage) || local());
  let persisted = false;
  const initial = restore ? saved : Object.freeze(local());
  let pending = initial.library === "cloud" && initial.workspaceId ? initial : null;

  function write(value) {
    const next = normalize(value);
    if (!next) return false;
    pending = null;
    if (persisted && JSON.stringify(saved) === JSON.stringify(next)) return true;
    saved = Object.freeze(next);
    persisted = false;
    const targets = [...new Set([tabStorage, storage].filter(Boolean))];
    let complete = targets.length > 0;
    for (const target of targets) {
      try { target.setItem(WORKSPACE_NAVIGATION_KEY, JSON.stringify(saved)); }
      catch { complete = false; }
    }
    persisted = complete;
    return complete;
  }
  function accountReady(ownerUid) {
    if (!pending) return null;
    if (!ownerUid) return { status: "signed-out" };
    if (String(ownerUid) !== pending.ownerUid) { pending = null; return { status: "mismatch" }; }
    return { status: "waiting" };
  }

  return Object.freeze({
    initial,
    snapshot: () => saved,
    hasPending: () => Boolean(pending),
    cancelRestore() { pending = null; },
    accountReady,
    rememberLocal: () => write(local()),
    rememberCloudLibrary(ownerUid = "") {
      const sameOwner = saved.library === "cloud" && saved.ownerUid === ownerUid;
      return write({ version: 1, library: "cloud", ownerUid, workspaceId: sameOwner ? saved.workspaceId : "" });
    },
    rememberCloud(ownerUid, workspaceId) {
      if (!ownerUid || !validUid(ownerUid) || !validId(workspaceId)) return false;
      return write({ version: 1, library: "cloud", ownerUid, workspaceId });
    },
    forgetWorkspace(ownerUid, workspaceId) {
      if (saved.library !== "cloud" || saved.ownerUid !== ownerUid || saved.workspaceId !== workspaceId) return false;
      return write({ ...saved, workspaceId: "" });
    },
    resolveRestore({ ownerUid = "", status = "", workspaces } = {}) {
      const identity = accountReady(ownerUid);
      if (identity?.status !== "waiting") return identity;
      if (status !== "ready" || !Array.isArray(workspaces)) return null;
      const target = pending;
      pending = null;
      const item = workspaces.find(item => item?.id === target.workspaceId && !item.deleting
        && String(item.ownerId || item.ownerUid || "") === target.ownerUid);
      if (item) return { status: "restore", item };
      write({ ...target, workspaceId: "" });
      return { status: "missing" };
    },
  });
}
