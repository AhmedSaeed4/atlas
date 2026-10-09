export function authInitializingInvalidatesMapSettingsTarget(target) {
  return target?.origin === "cloud";
}

export function hasUnresolvedLocalCloudCandidate(record, associationValue = "", attemptInFlight = false) {
  if (attemptInFlight) return true;
  // Local-only admissions also reserve an ID. These terminal states never
  // prepared an upload; a stored payload keeps any earlier submission guarded.
  const unsubmittedAdmission = record && typeof record === "object"
    && ["new", "import", "fragment"].includes(record.source)
    && ["local", "needs-sign-in", "needs-confirmation", "stale"].includes(record.admissionStatus)
    && record.committed !== true && !record.graphFingerprint;
  if (unsubmittedAdmission) return false;
  const value = typeof record === "string" ? record : String(record?.workspaceId || "");
  const association = String(associationValue || "");
  if ([value, association].some((item) => item.startsWith("pending:") || item.startsWith("verify:"))) return true;
  if (!record || typeof record !== "object") return false;
  return record.pending === true || record.confirmationRequired === true
    || (record.committed === false && Boolean(record.workspaceId));
}

export function reusableManualMoveCandidate(record, ownerUid) {
  const uid = String(ownerUid || "");
  if (!uid || record?.source !== "manual" || record.pending !== true
      || String(record.ownerUid || "") !== uid || !record.workspaceId) return null;
  const workspaceId = String(record.workspaceId);
  return Object.freeze({
    workspaceId,
    idempotencyKey: String(record.idempotencyKey || ("manual:" + uid + ":" + workspaceId)),
  });
}

export function reusableManualMoveAttempt(record, ownerUid) {
  const candidate = reusableManualMoveCandidate(record, ownerUid);
  if (!candidate || typeof record?.graphFingerprint !== "string") return null;
  try {
    const graph = JSON.parse(record.graphFingerprint);
    if (!graph || typeof graph !== "object" || Array.isArray(graph) || !graph.project || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return null;
    return Object.freeze({ ...candidate, graph, graphFingerprint: record.graphFingerprint });
  } catch { return null; }
}

export function commitManualMoveAssociation(associations, projectId, save) {
  const id = String(projectId || "");
  const current = id ? associations?.[id] : null;
  if (!id || !current || typeof save !== "function") return false;
  associations[id] = { ...current, pending: false, committed: true, admissionStatus: "ready", completedAt: Date.now() };
  let stored = false;
  try { stored = save() === true; } catch { stored = false; }
  if (!stored) associations[id] = current;
  return stored;
}

export function createManualMoveAttemptTracker() {
  const active = new Set();
  return Object.freeze({
    isActive(projectId) { return active.has(String(projectId || "")); },
    begin(projectId) {
      const id = String(projectId || "");
      if (!id || active.has(id)) return false;
      active.add(id);
      return true;
    },
    finish(projectId) { return active.delete(String(projectId || "")); },
  });
}
export function onlineStatusVisibility({ openSession = false, explicitViewRoute = false, routeUnavailable = false, status = "", hasGraph = false, dirty = false, pendingUpload = false } = {}) {
  if (!openSession) return Object.freeze({ current: false, banner: false, returnLocal: false });
  const unavailable = Boolean(routeUnavailable) || ["permission-denied", "revoked", "deleted", "not-found", "disabled", "invalid-link"].includes(String(status));

  const current = Boolean(pendingUpload) || ["offline", "conflict", "delete-incomplete"].includes(String(status))
    || (String(status) === "error" && Boolean(dirty));
  const banner = unavailable || (String(status) === "offline" && !hasGraph);
  return Object.freeze({ current, banner, returnLocal: Boolean(explicitViewRoute && unavailable) });
}

export function resolveMapSettingsTarget(target, { projects = [], workspaces = [], currentUid = "" } = {}) {
  const origin = String(target?.origin || "");
  const id = String(target?.id || "");
  if (!id || !["local", "cloud"].includes(origin)) return null;
  if (origin === "local") {
    const project = projects.find((entry) => String(entry?.id || "") === id);
    return project ? Object.freeze({ origin, id, ownerUid: "", project }) : null;
  }
  const ownerUid = String(target?.ownerUid || "");
  const uid = String(currentUid || "");
  if (!ownerUid || !uid || ownerUid !== uid) return null;
  const item = workspaces.find((entry) => String(entry?.id || "") === id
    && String(entry?.ownerId || entry?.ownerUid || "") === ownerUid);
  return item ? Object.freeze({ origin, id, ownerUid, item }) : null;
}

export function createMapSettingsTargetController({
  getContext = () => ({}),
  onChange = () => {},
} = {}) {
  let generation = 0;
  let active = null;

  const resolve = (context = active) => context ? resolveMapSettingsTarget(context, getContext()) : null;
  const current = (token) => Boolean(active && token && active.token === token.token
    && resolve(active));
  const clear = () => {
    generation += 1;
    active = null;
    onChange(null);
  };

  return Object.freeze({
    open(target) {
      const resolved = resolveMapSettingsTarget(target, getContext());
      if (!resolved) return null;
      const context = Object.freeze({
        origin: resolved.origin,
        id: resolved.id,
        ownerUid: resolved.ownerUid,
        token: ++generation,
      });
      active = context;
      const targetMap = resolve(context);
      if (!targetMap) { clear(); return null; }
      const result = Object.freeze({ ...targetMap, token: context.token });
      onChange(result);
      return result;
    },
    close() { clear(); },
    invalidate() {
      if (active && !resolve(active)) clear();
    },
    isCurrent(target) { return current(target); },
    getCurrent() {
      if (!active) return null;
      const targetMap = resolve(active);
      return targetMap ? Object.freeze({ ...targetMap, token: active.token }) : null;
    },
    async run(target, operation) {
      if (typeof operation !== "function") throw new TypeError("Map settings action must be a function.");
      if (!current(target)) return { cancelled: true };
      const captured = Object.freeze({ ...resolve(active), token: active.token });
      const value = await operation(captured);
      if (!current(target)) return { cancelled: true };
      return { cancelled: false, target: captured, value };
    },
  });
}

// Match local creation/import order without letting edits move existing rows.
// Service summaries are frozen, so sort a separate array using createdAt only.
export function sortCloudWorkspacesByCreation(workspaces) {
  return workspaces.map((item, index) => {
    const parsed = typeof item?.createdAt === "string" ? Date.parse(item.createdAt) : NaN;
    return { item, index, createdAt: Number.isFinite(parsed) ? parsed : -Infinity };
  }).sort((a, b) => b.createdAt - a.createdAt || a.index - b.index)
    .map(({ item }) => item);
}

// Only an authoritative server result replaces the list. Transient cache/loading
// events must not discard a same-account list already shown in the sidebar.
export function updateOnlineLibrarySnapshot(cache, result) {
  if (result?.status === "ready" && Array.isArray(result.workspaces)) cache.snapshot = sortCloudWorkspacesByCreation(result.workspaces);
  else if (["unauthenticated", "permission-denied", "revoked"].includes(result?.status)
      || result?.error?.code === "permission-denied") cache.snapshot = null;
  return cache.snapshot;
}

// A deliberate library switch selects once, after its owner's list is ready.
// Later refreshes must not replace a map the user has chosen themselves.
export function createCloudLibraryFirstSelection() {
  let sequence = 0;
  let pending = null;
  return Object.freeze({
    begin() { pending = { token: ++sequence, ownerUid: "" }; return pending.token; },
    bindOwner(token, ownerUid) {
      if (!pending || pending.token !== token || !ownerUid) return false;
      pending.ownerUid = String(ownerUid);
      return true;
    },
    cancel() { pending = null; },
    takeFirst({ mode, currentUid, workspaces } = {}) {
      if (!pending || !currentUid) return null;
      if (!pending.ownerUid) pending.ownerUid = String(currentUid);
      if (mode !== "cloud" || String(currentUid || "") !== pending.ownerUid) { pending = null; return null; }
      if (!Array.isArray(workspaces)) return null;
      const first = workspaces.find(item => String(item?.ownerId || item?.ownerUid || "") === pending.ownerUid);
      pending = null;
      return first || null;
    },
  });
}
