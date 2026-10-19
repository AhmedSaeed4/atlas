import { layoutGraph, nodeDimensions } from "./layout.js";
import { edgeGeometry, edgeRoutingLanes, graphBounds } from "./geometry.js";

const geometryKey = (graph) =>
  JSON.stringify([
    graph.nodes.map((node) => [
      node.id,
      node.position?.x,
      node.position?.y,
      nodeDimensions(node).height,
    ]),
    graph.edges.map((edge) => [
      edge.id,
      edge.source,
      edge.target,
      edge.label,
      edge.type,
    ]),
  ]);

// Cache structural geometry independently of descriptions, evidence, selection,
// search and camera. Dragging changes only one position and incident routes.
export function createGraphGeometryCache({
  layout = layoutGraph,
  route = edgeGeometry,
  bounds = graphBounds,
} = {}) {
  const entries = new WeakMap();
  const get = (graph) => {
    const key = geometryKey(graph);
    let entry = entries.get(graph);
    if (entry?.key === key) return entry;
    const incident = new Map(graph.nodes.map((node) => [node.id, new Set()]));
    graph.edges.forEach((edge, index) => {
      incident.get(edge.source)?.add(index);
      incident.get(edge.target)?.add(index);
    });
    entry = {
      key,
      layout: layout(graph),
      lanes: edgeRoutingLanes(graph.edges),
      incident,
      geometry: new Map(),
      bounds: null,
    };
    entries.set(graph, entry);
    return entry;
  };
  return Object.freeze({
    get,
    edge(graph, index, entry = get(graph)) {
      if (!entry.geometry.has(index))
        entry.geometry.set(
          index,
          route(
            graph.edges[index],
            index,
            entry.layout.positions,
            entry.layout.dimensions,
            entry.lanes.get(index),
          ),
        );
      return entry.geometry.get(index);
    },
    bounds(graph) {
      const entry = get(graph);
      return (entry.bounds ||= bounds(
        graph,
        entry.layout.positions,
        entry.layout.dimensions,
      ));
    },
    move(graph, nodeId, position) {
      if (!Number.isFinite(position?.x) || !Number.isFinite(position?.y))
        return null;
      const entry = entries.get(graph) || get(graph);
      if (!entry.layout.positions.has(nodeId)) return null;
      entry.layout.positions.set(nodeId, { x: position.x, y: position.y });
      entry.key = geometryKey(graph);
      entry.bounds = null;
      const affected = entry.incident.get(nodeId) || new Set();
      for (const index of affected) entry.geometry.delete(index);
      return { entry, affected };
    },
    invalidate(graph) {
      entries.delete(graph);
    },
  });
}

export function createFrameBatch(
  paint,
  {
    request = (callback) => requestAnimationFrame(callback),
    cancel = (id) => cancelAnimationFrame(id),
  } = {},
) {
  let frame = null,
    latest = null;
  const flush = () => {
    if (frame !== null) cancel(frame);
    frame = null;
    const next = latest;
    latest = null;
    if (next !== null) paint(next);
  };
  return Object.freeze({
    schedule(value) {
      latest = value;
      if (frame === null)
        frame = request(() => {
          frame = null;
          const next = latest;
          latest = null;
          if (next !== null) paint(next);
        });
    },
    flush,
    cancel() {
      if (frame !== null) cancel(frame);
      frame = null;
      latest = null;
    },
  });
}

export function updateDraggedGraph({
  graph,
  nodeId,
  position,
  cache,
  cards,
  edges,
}) {
  const update = cache.move(graph, nodeId, position),
    card = cards.get(nodeId);
  if (!update || !card) return false;
  card.classList.remove("entering");
  card.setAttribute(
    "transform",
    "translate(" + position.x + " " + position.y + ")",
  );
  for (const index of update.affected) {
    const group = edges.get(index),
      geometry = cache.edge(graph, index, update.entry);
    if (!group || !geometry) continue;
    for (const path of group.querySelectorAll(".edge-path,.edge-hit-target"))
      path.setAttribute("d", geometry.path);
    group.querySelector(".edge-arrow")?.setAttribute("d", geometry.arrowPath);
    const label = group.querySelector(".edge-label");
    label?.setAttribute("x", geometry.labelX);
    label?.setAttribute("y", geometry.labelY + 2);
    const background = group.querySelector(".edge-label-bg");
    background?.setAttribute("x", geometry.labelX - geometry.labelWidth / 2);
    background?.setAttribute("y", geometry.labelY - 10);
    for (const motion of group.querySelectorAll("animateMotion"))
      motion.setAttribute("path", geometry.path);
  }
  return true;
}
