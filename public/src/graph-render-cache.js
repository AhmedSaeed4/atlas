import { layoutGraph, nodeDimensions } from "./layout.js";
import { edgeGeometry, edgeRoutingLanes, graphBounds } from "./geometry.js";
import { createCategoryRouting } from './category-routing.js';

const geometryKey = (graph) =>
  JSON.stringify([
    graph.nodes.map((node) => [
      node.id,
      node.group,
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
// search and camera. Category drags also recheck routes near changed obstacles.
export function createGraphGeometryCache({
  layout = layoutGraph,
  route = edgeGeometry,
  bounds = graphBounds,
  categoryFrames = false,
} = {}) {
  const entries = new WeakMap();
  const get = (graph) => {
    const framesEnabled = Boolean(typeof categoryFrames === 'function' ? categoryFrames() : categoryFrames);
    const key = JSON.stringify([framesEnabled, geometryKey(graph)]);
    let entry = entries.get(graph);
    if (entry?.key === key) return entry;
    const incident = new Map(graph.nodes.map((node) => [node.id, new Set()]));
    graph.edges.forEach((edge, index) => {
      incident.get(edge.source)?.add(index);
      incident.get(edge.target)?.add(index);
    });
    entry = {
      key,
      layout: layout(graph, { categoryFrames: framesEnabled }),
      categoryFrames: framesEnabled,
      lanes: edgeRoutingLanes(graph.edges),
      incident,
      geometry: new Map(),
      bounds: null,
    };
    entry.routing = framesEnabled ? createCategoryRouting(graph, entry.layout.positions, entry.layout.dimensions) : null;
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
            entry.routing,
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
        entry.routing,
        { categoryFrames: entry.categoryFrames },
      ));
    },
    move(graph, nodeId, position) {
      if (!Number.isFinite(position?.x) || !Number.isFinite(position?.y))
        return null;
      const entry = entries.get(graph) || get(graph);
      if (!entry.layout.positions.has(nodeId)) return null;
      entry.layout.positions.set(nodeId, { x: position.x, y: position.y });
      entry.key = JSON.stringify([entry.categoryFrames, geometryKey(graph)]);
      entry.bounds = null;
      const affected = new Set(entry.incident.get(nodeId) || []);
      if (entry.routing) {
        const previousRouting = entry.routing;
        entry.routing = createCategoryRouting(graph, entry.layout.positions, entry.layout.dimensions);
        const nextByKey = new Map(entry.routing.obstacles.map(rect => [rect.key, rect]));
        const changed = [];
        for (const previous of previousRouting.obstacles) {
          const next = nextByKey.get(previous.key);
          if (!next || ['left', 'right', 'top', 'bottom'].some(key => previous[key] !== next[key])) { changed.push(previous); if (next) changed.push(next); }
        }
        // A new/moved obstacle can affect a non-incident edge. Cached control
        // hulls conservatively bound curves and rounded detours; routes far
        // from the changed area retain their geometry and mounted SVG paths.
        for (const [index, geometry] of entry.geometry) {
          if (affected.has(index)) continue;
          const edge = graph.edges[index], source = entry.routing.owners.get(edge.source), target = entry.routing.owners.get(edge.target);
          const relevant = changed.filter(rect => rect.key !== source && rect.key !== target && rect.key !== 'node:' + edge.source && rect.key !== 'node:' + edge.target && (!rect.owner || rect.owner === source || rect.owner === target));
          if (!relevant.length) continue;
          const left = Math.min(...geometry.points.map(point => point.x)), right = Math.max(...geometry.points.map(point => point.x));
          const top = Math.min(...geometry.points.map(point => point.y)), bottom = Math.max(...geometry.points.map(point => point.y));
          if (relevant.some(rect => rect.left <= right && rect.right >= left && rect.top <= bottom && rect.bottom >= top)) affected.add(index);
        }
      }
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
