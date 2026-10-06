import { LIMITS, newEdgeId, newNodeId, normalizeEditableGraph } from "./schema.js";

export function canStartPointerGesture(activeGesture) {
  return activeGesture === null || activeGesture === undefined;
}

export function screenToWorld(clientX, clientY, rect, transform) {
  const values = [clientX, clientY, rect?.left, rect?.top, transform?.x, transform?.y, transform?.scale];
  if (!values.every(Number.isFinite) || transform.scale <= 0) throw new Error("Canvas coordinates are unavailable.");
  return {
    x: (clientX - rect.left - transform.x) / transform.scale,
    y: (clientY - rect.top - transform.y) / transform.scale,
  };
}

export function nodeContextIsCurrent(project, node, context) {
  if (!project || !node || !context) return false;
  if (project.id !== context.projectId || project.graph !== context.graphRef || node.id !== context.nodeId) return false;
  return typeof context.nodeSnapshot === "string" && JSON.stringify(node) === context.nodeSnapshot;
}

export function connectionPreviewPath(start, end) {
  if (![start?.x, start?.y, end?.x, end?.y].every(Number.isFinite)) return "";
  if ([start.x, start.y, end.x, end.y].some((value) => Math.abs(value) > 1000000)) return "";
  const bend = Math.max(28, Math.abs(end.x - start.x) * .42);
  const controls = [start.x + bend, start.y, end.x - bend, end.y];
  if (!controls.every(Number.isFinite)) return "";
  return "M " + start.x + " " + start.y + " C " + controls[0] + " " + controls[1] + " " + controls[2] + " " + controls[3] + " " + end.x + " " + end.y;
}

export function branchEdgeCandidate(graph, {
  edgeId,
  expectedEdge = null,
  branchTargetId,
  junctionLabel,
  relationship = "",
  relationshipType = "",
  position,
  ids = null,
} = {}) {
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) throw new Error("The current map is unavailable.");
  if (graph.nodes.length >= LIMITS.nodes) throw new Error("This map has reached its component limit.");
  if (graph.edges.length + 2 > LIMITS.edges) throw new Error("A branch needs two additional connections; this map is at its connection limit.");
  const sourceEdge = graph.edges.find((edge) => edge.id === edgeId);
  if (!sourceEdge) throw new Error("That connection no longer exists. Reopen its menu and try again.");
  if (!expectedEdge || sourceEdge.id !== expectedEdge.id || sourceEdge.source !== expectedEdge.source || sourceEdge.target !== expectedEdge.target || sourceEdge.label !== expectedEdge.label || sourceEdge.type !== expectedEdge.type) throw new Error("That connection changed while the branch form was open. Reopen its menu and try again.");
  if (!graph.nodes.some((node) => node.id === branchTargetId)) throw new Error("Choose a component that still exists in this map.");
  const label = String(junctionLabel || "").trim();
  if (!label) throw new Error("A junction name is required.");
  if (label.length > 120) throw new Error("The junction name must be 120 characters or fewer.");
  if (![position?.x, position?.y].every(Number.isFinite) || Math.abs(position.x) > 99999 || Math.abs(position.y) > 99999) {
    throw new Error("The junction position is outside the supported canvas range.");
  }

  const existingNodeIds = new Set(graph.nodes.map((node) => node.id));
  const existingEdgeIds = new Set(graph.edges.map((edge) => edge.id));
  const junctionId = ids?.junctionId ?? newNodeId(graph.nodes);
  const continuationId = ids?.continuationId ?? newEdgeId(graph.edges);
  const branchId = ids?.branchId ?? newEdgeId([...graph.edges, { id: continuationId }]);
  if (typeof junctionId !== "string" || !junctionId || existingNodeIds.has(junctionId)) throw new Error("A unique junction ID could not be created.");
  if (typeof continuationId !== "string" || !continuationId || existingEdgeIds.has(continuationId)) throw new Error("A unique continuation ID could not be created.");
  if (typeof branchId !== "string" || !branchId || existingEdgeIds.has(branchId) || branchId === continuationId) throw new Error("A unique branch connection ID could not be created.");

  const junction = {
    id: junctionId,
    label,
    type: "Junction",
    description: "A circular branch point inserted into a connection.",
    source: "",
    group: "",
    junction: true,
    position: { x: position.x, y: position.y },
  };
  const edges = graph.edges.flatMap((edge) => edge.id !== sourceEdge.id ? [edge] : [
    { ...edge, target: junctionId },
    { id: continuationId, source: junctionId, target: sourceEdge.target, label: "", type: "" },
    { id: branchId, source: junctionId, target: branchTargetId, label: String(relationship || "").trim(), type: String(relationshipType || "").trim() },
  ]);
  return normalizeEditableGraph({
    schemaVersion: graph.schemaVersion,
    project: graph.project,
    nodes: [...graph.nodes, junction],
    edges,
  });
}
