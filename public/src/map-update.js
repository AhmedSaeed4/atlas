import {
  normalizeEditableGraph,
  assertGraphJsonWithinLimit,
} from "./schema.js";
const withoutPosition = (node) => {
  const { position, ...rest } = node;
  return rest;
};
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function changes(before, after, content = (value) => value) {
  const old = new Map(before.map((item) => [item.id, item])),
    fresh = new Map(after.map((item) => [item.id, item]));
  return {
    added: after.filter((item) => !old.has(item.id)),
    removed: before.filter((item) => !fresh.has(item.id)),
    changed: after.filter(
      (item) =>
        old.has(item.id) && !equal(content(old.get(item.id)), content(item)),
    ),
  };
}
export function compareGraphVersions(before, after) {
  const nodes = changes(before.nodes, after.nodes, withoutPosition),
    edges = changes(before.edges, after.edges);
  const projectChanged = !equal(before.project, after.project);
  const previous = new Map(
    before.nodes.map((node) => [node.id, node.position]),
  );
  const moved = after.nodes.filter(
    (node) =>
      previous.has(node.id) && !equal(previous.get(node.id), node.position),
  );
  return {
    nodes,
    edges,
    projectChanged,
    moved,
    hasContentChanges:
      projectChanged ||
      [nodes, edges].some(
        (group) =>
          group.added.length || group.removed.length || group.changed.length,
      ),
  };
}
export function prepareMapUpdate(
  current,
  input,
  { preservePositions = true, positions } = {},
) {
  let graph = normalizeEditableGraph(input);
  const comparison = compareGraphVersions(current, graph);
  if (preservePositions && !comparison.hasContentChanges)
    return {
      graph: structuredClone(current),
      comparison: compareGraphVersions(current, current),
    };
  if (preservePositions) {
    const old = new Map(current.nodes.map((node) => [node.id, node]));
    graph = {
      ...graph,
      nodes: graph.nodes.map((node) => {
        const previous = old.get(node.id);
        if (!previous) return node;
        const point = previous.position || positions?.get(node.id);
        if (!point) {
          const { position, ...rest } = node;
          return rest;
        }
        return { ...node, position: { x: point.x, y: point.y } };
      }),
    };
  }
  assertGraphJsonWithinLimit(graph, { baselineGraph: current });
  const result = compareGraphVersions(current, graph);
  if (preservePositions)
    result.preservedPositions = graph.nodes.filter((node) =>
      current.nodes.some((previous) => previous.id === node.id),
    ).length;
  return { graph, comparison: result };
}
export function sameMapContext(captured, current) {
  return Boolean(
    captured &&
    current &&
    current.canEdit &&
    captured.key === current.key &&
    captured.graph === current.graph &&
    captured.ownerUid === current.ownerUid,
  );
}
