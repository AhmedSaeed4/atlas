const MAX_MOTION_NODES = 600;
const MAX_MOTION_COST = 800;
const EDGE_MOTION_COST = 5;

export function graphMotionAllowed(graph) {
  const nodeCount = Array.isArray(graph?.nodes) ? graph.nodes.length : 0;
  const edgeCount = Array.isArray(graph?.edges) ? graph.edges.length : 0;
  return nodeCount <= MAX_MOTION_NODES && nodeCount + edgeCount * EDGE_MOTION_COST <= MAX_MOTION_COST;
}
export function clearEdgeEntranceState({ group, path, arrow } = {}) {
  if (path) {
    // The forwards-filled CSS animation can mask stale inline values. Clear the
    // values before removing its class so cancellation always leaves a solid path.
    path.style.removeProperty("stroke-dasharray");
    path.style.removeProperty("stroke-dashoffset");
    path.classList.remove("draw-in");
  }
  if (arrow) arrow.classList.remove("show-after");
  if (group) {
    group.classList.remove("label-delayed");
    group.style.removeProperty("--draw-delay");
  }
}

export function setEdgeTraceState(group, path, arrow, connected) {
  if (connected) clearEdgeEntranceState({ group, path, arrow });
  group.classList.toggle("trace-label", connected);
  path?.classList.toggle("connected", connected);
  arrow?.classList.toggle("connected", connected);
}