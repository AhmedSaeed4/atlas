// Presentation only: never changes access, saves, routes or database subscriptions.
export function workspaceLoadingPresentation({ online = false, navigationPending = true, status = "", unavailable = false, workspaceId = "", graphWorkspaceId = "", hasGraph = false } = {}) {
  const busy = Boolean(online && navigationPending && status === "loading" && !unavailable);
  const id = String(workspaceId || "");
  const matchingGraph = Boolean(hasGraph && id && String(graphWorkspaceId || "") === id);
  return Object.freeze({ busy, surface: busy ? (matchingGraph ? "preview" : "skeleton") : "idle", rowId: busy ? id : "" });
}

/**
 * Keep an unchanged confirmed/preview graph mounted, so account validation and
 * save acknowledgements cannot cancel its card/connector entrance or gestures.
 * Inputs are already validated graph snapshots; a different workspace always
 * gets a fresh entrance even if its graph happens to have the same contents.
 */
export function workspaceGraphPresentation({ previousProject = null, workspaceId = "", graph } = {}) {
  const sameWorkspace = Boolean(workspaceId && previousProject?.onlineWorkspaceId === workspaceId);
  const previous = sameWorkspace ? previousProject.graph : null;
  const preserveGraph = Boolean(previous && (previous === graph || JSON.stringify(previous) === JSON.stringify(graph)));
  return { graph: preserveGraph ? previous : graph, firstLoad: !sameWorkspace, preserveGraph };
}
