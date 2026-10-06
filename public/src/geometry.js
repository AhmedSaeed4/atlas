import { NODE_HEIGHT, NODE_WIDTH, nodeDimensions } from "./layout.js";

const LABEL_LIMIT = 18;
export const edgeLabelText = (edge) => {
  const text = String(edge.label || edge.type || "connects");
  return text.length > LABEL_LIMIT ? text.slice(0, LABEL_LIMIT - 3) + "..." : text;
};
const midpoint = (p0, p1, p2, p3) => ({
  x: .125 * p0.x + .375 * p1.x + .375 * p2.x + .125 * p3.x,
  y: .125 * p0.y + .375 * p1.y + .375 * p2.y + .125 * p3.y,
});
const nodeSize = (sizes, id, node = null) => sizes?.get?.(id) || (node ? nodeDimensions(node) : { width: NODE_WIDTH, height: NODE_HEIGHT });

export function edgeRoutingLanes(edges) {
  const groups = new Map();
  if (!Array.isArray(edges)) return new Map();
  edges.forEach((edge, index) => {
    const key = JSON.stringify([edge.source, edge.target]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(index);
  });
  const lanes = new Map();
  for (const indexes of groups.values()) {
    const count = indexes.length;
    const spacing = count > 1 ? Math.min(24, 160 / (count - 1)) : 0;
    indexes.forEach((edgeIndex, slot) => {
      lanes.set(edgeIndex, (slot - (count - 1) / 2) * spacing);
    });
  }
  return lanes;
}
export function edgeGeometry(edge, index, positions, nodeSizes = null, laneOffset = 0) {
  const startNode = positions.get(edge.source);
  const endNode = positions.get(edge.target);
  if (!startNode || !endNode) return null;
  const startSize = nodeSize(nodeSizes, edge.source);
  const endSize = nodeSize(nodeSizes, edge.target);
  let p0;
  let p1;
  let p2;
  let p3;
  const offset = 58 + (index % 4) * 15;
  const lane = Number.isFinite(laneOffset) ? laneOffset : 0;
  if (edge.source === edge.target) {
    p0 = { x: startNode.x + startSize.width, y: startNode.y + Math.min(34, startSize.height * .32) };
    p1 = { x: startNode.x + startSize.width + offset + Math.abs(lane) * .35, y: startNode.y - offset - lane };
    p2 = { x: startNode.x + startSize.width + offset + 15 + Math.abs(lane) * .35, y: startNode.y + Math.min(30, startSize.height * .28) - offset - lane };
    p3 = { x: startNode.x + startSize.width + 3, y: startNode.y + Math.min(22, startSize.height * .2) };
  } else {
    p0 = { x: startNode.x + startSize.width, y: startNode.y + startSize.height / 2 };
    p3 = { x: endNode.x, y: endNode.y + endSize.height / 2 };
    if (p3.x <= p0.x) {
      const routeY = Math.min(startNode.y, endNode.y) - offset - 22 + lane;
      p1 = { x: p0.x + offset, y: routeY };
      p2 = { x: p3.x - offset, y: routeY };
    } else {
      const bend = Math.max(36, (p3.x - p0.x) * .42);
      p1 = { x: p0.x + bend, y: p0.y + lane };
      p2 = { x: p3.x - bend, y: p3.y + lane };
    }
  }
  const point = midpoint(p0, p1, p2, p3);
  const angle = Math.atan2(p3.y - p2.y, p3.x - p2.x);
  const arrowSize = 7;
  const arrowHalfAngle = .48;
  const arrowPoint = (rotation) => ({
    x: p3.x - arrowSize * Math.cos(angle + rotation),
    y: p3.y - arrowSize * Math.sin(angle + rotation),
  });
  const arrowA = arrowPoint(arrowHalfAngle);
  const arrowB = arrowPoint(-arrowHalfAngle);
  const arrowPath = "M " + arrowA.x + " " + arrowA.y + " L " + p3.x + " " + p3.y + " L " + arrowB.x + " " + arrowB.y;
  const labelY = point.y - 9;
  const fullLabel = String(edge.label || edge.type || "connects");
  const label = edgeLabelText(edge);
  const labelWidth = Math.max(44, label.length * 5.3 + 14);
  return {
    points: [p0, p1, p2, p3],
    arrowPoints: [arrowA, p3, arrowB],
    path: "M " + p0.x + " " + p0.y + " C " + p1.x + " " + p1.y + " " + p2.x + " " + p2.y + " " + p3.x + " " + p3.y,
    arrowPath,
    label, fullLabel, labelX: point.x, labelY, labelWidth,
  };
}

export function graphBounds(graph, positions, nodeSizes = null) {
  if (!graph.nodes.length) return { x: 0, y: 0, width: 1, height: 1 };
  const sizes = nodeSizes || new Map(graph.nodes.map((node) => [node.id, nodeDimensions(node)]));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const include = (x, y) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };
  for (const node of graph.nodes) {
    const point = positions.get(node.id);
    if (!point) continue;
    const size = nodeSize(sizes, node.id, node);
    include(point.x, point.y);
    include(point.x + size.width, point.y + size.height);
  }
  const routingLanes = edgeRoutingLanes(graph.edges);
  graph.edges.forEach((edge, index) => {
    const geometry = edgeGeometry(edge, index, positions, sizes, routingLanes.get(index));
    if (!geometry) return;
    for (const point of geometry.points) include(point.x, point.y);
    for (const point of geometry.arrowPoints) include(point.x, point.y);
    include(geometry.labelX - geometry.labelWidth / 2, geometry.labelY - 11);
    include(geometry.labelX + geometry.labelWidth / 2, geometry.labelY + 8);
  });
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return { x: 0, y: 0, width: 1, height: 1 };
  return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
}
