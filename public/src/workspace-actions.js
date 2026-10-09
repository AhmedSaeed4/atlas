const READABLE_STATUSES = new Set(["ready", "saving", "conflict", "offline"]);

// Reading or forwarding a confirmed shared map does not grant edit authority.
export function workspaceActionAvailability({ hasProject = false, online = false, state = {}, graphWorkspaceId = "", unavailable = false, sharedView = false } = {}) {
  const ownerMatches = Boolean(state.userUid && state.userUid === state.ownerUid);
  const hideEditing = Boolean(online && state.mode === "viewer" && !ownerMatches
    && (sharedView || state.sharedId || state.workspace));
  const confirmed = Boolean(hasProject && !unavailable && !state.routeUnavailable && !state.stalePreview
    && state.workspaceId && graphWorkspaceId === state.workspaceId
    && state.workspace?.id === state.workspaceId && !state.workspace.deleting
    && (ownerMatches || state.workspace.shared === true)
    && READABLE_STATUSES.has(state.status));
  const canExport = Boolean(hasProject && (!online || confirmed));
  const canShare = canExport && (!online || state.canEdit === true
    || Boolean(state.sharedId === state.workspaceId && state.workspace?.shared));
  return { hideEditing, canExport, canShare };
}

// Raster generation can finish after navigation or a revoked viewer subscription.
export function workspaceReadSnapshotIsCurrent(snapshot, current) {
  return Boolean(current.canExport && snapshot.projectId === current.projectId
    && snapshot.graph === current.graph && snapshot.workspaceId === current.workspaceId);
}

// Shared recipients see the introduction; a confirmed owner keeps their library.
export function isSharedViewer({ sharedView = false, state = {} } = {}) {
  const owner = state.mode === "owner" && Boolean(state.userUid && state.userUid === state.ownerUid);
  return Boolean(sharedView && !owner);
}

// Empty initial controller state is not an active owner save retry.
export function isCurrentSaveRetry(pending, { workspaceId = "", userUid = "", openSession = false } = {}) {
  return Boolean(pending && openSession && workspaceId && userUid
    && pending.workspaceId === workspaceId && pending.ownerUid === userUid);
}
