// Presentation only: never changes access, saves, routes or database subscriptions.
export function workspaceLoadingPresentation({ online = false, navigationPending = true, status = "", unavailable = false, workspaceId = "", graphWorkspaceId = "", hasGraph = false } = {}) {
  const busy = Boolean(online && navigationPending && status === "loading" && !unavailable);
  const id = String(workspaceId || "");
  const matchingGraph = Boolean(hasGraph && id && String(graphWorkspaceId || "") === id);
  return Object.freeze({ busy, surface: busy ? (matchingGraph ? "preview" : "skeleton") : "idle", rowId: busy ? id : "" });
}
