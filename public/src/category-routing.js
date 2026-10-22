import { categoryBounds } from './map-categories.js';

const CLEARANCE = 14;
const inside = (point, rect) => point.x > rect.left + .01 && point.x < rect.right - .01 && point.y > rect.top + .01 && point.y < rect.bottom - .01;
export function segmentCrossesRectangle(a, b, rect) {
  let lower = 0, upper = 1;
  for (const [start, delta, min, max] of [[a.x, b.x - a.x, rect.left + .01, rect.right - .01], [a.y, b.y - a.y, rect.top + .01, rect.bottom - .01]]) {
    if (Math.abs(delta) < .00001) { if (start < min || start > max) return false; }
    else {
      const first = (min - start) / delta, last = (max - start) / delta;
      lower = Math.max(lower, Math.min(first, last));
      upper = Math.min(upper, Math.max(first, last));
      if (lower > upper) return false;
    }
  }
  return true;
}

export function createCategoryRouting(graph, positions, dimensions) {
  if (!graph.nodes.some(node => node.group || node.viewGroup)) return null;
  const boxes = categoryBounds(graph, positions, dimensions);
  const rectangle = (box, key) => ({ key, left: box.x - CLEARANCE, top: box.y - CLEARANCE, right: box.x + box.width + CLEARANCE, bottom: box.y + box.height + CLEARANCE });
  const owners = new Map(graph.nodes.map(node => [node.id, node.group ? 'category:' + node.group : 'node:' + node.id]));
  const obstacles = boxes.map(box => rectangle(box, 'category:' + box.name));
  for (const node of graph.nodes) {
    const point = positions.get(node.id), size = dimensions.get(node.id);
    if (point && size) obstacles.push({ ...rectangle({ ...point, ...size }, 'node:' + node.id), owner: node.group ? 'category:' + node.group : null });
  }
  return { owners, obstacles };
}

// A lazy rectilinear visibility grid: only visited intersections are allocated.
// Grid lines follow obstacle margins, so routes can go around several boxes
// without introducing layout nodes, changing map data, or using a dependency.
function detour(start, end, obstacles) {
  if (obstacles.some(rect => inside(start, rect) || inside(end, rect))) return null;
  const xs = [...new Set([start.x, end.x, ...obstacles.flatMap(rect => [rect.left, rect.right])])].sort((a, b) => a - b);
  const ys = [...new Set([start.y, end.y, ...obstacles.flatMap(rect => [rect.top, rect.bottom])])].sort((a, b) => a - b);
  const width = xs.length, startX = xs.indexOf(start.x), startY = ys.indexOf(start.y), endX = xs.indexOf(end.x), endY = ys.indexOf(end.y);
  const heap = [], costs = new Map(), previous = new Map();
  const push = value => {
    heap.push(value); let i = heap.length - 1;
    while (i) { const parent = (i - 1) >> 1; if (heap[parent].score <= value.score) break; heap[i] = heap[parent]; i = parent; }
    heap[i] = value;
  };
  const pop = () => {
    const first = heap[0], last = heap.pop();
    if (heap.length) { let i = 0; while (i * 2 + 1 < heap.length) { let child = i * 2 + 1; if (child + 1 < heap.length && heap[child + 1].score < heap[child].score) child++; if (last.score <= heap[child].score) break; heap[i] = heap[child]; i = child; } heap[i] = last; }
    return first;
  };
  const key = (x, y, direction) => (y * width + x) * 3 + direction;
  const initial = key(startX, startY, 0);
  costs.set(initial, 0);
  push({ x: startX, y: startY, direction: 0, cost: 0, key: initial, score: Math.abs(start.x - end.x) + Math.abs(start.y - end.y) });
  const vertical = new Map(), horizontal = new Map();
  const candidates = (axis, value) => {
    const cache = axis === 'x' ? vertical : horizontal;
    if (!cache.has(value)) cache.set(value, obstacles.filter(rect => axis === 'x' ? value > rect.left + .01 && value < rect.right - .01 : value > rect.top + .01 && value < rect.bottom - .01));
    return cache.get(value);
  };
  let visits = 0;
  while (heap.length && visits++ < 50000) {
    const current = pop();
    if (current.cost !== costs.get(current.key)) continue;
    if (current.x === endX && current.y === endY) {
      const points = []; let at = current;
      while (at) { points.push({ x: xs[at.x], y: ys[at.y] }); at = previous.get(at.key); }
      return points.reverse();
    }
    const from = { x: xs[current.x], y: ys[current.y] };
    for (const [dx, dy, direction] of [[1, 0, 1], [-1, 0, 1], [0, 1, 2], [0, -1, 2]]) {
      const x = current.x + dx, y = current.y + dy;
      if (current.key === initial && dx < 0) continue;
      if (x === endX && y === endY && dx < 0) continue;
      if (x < 0 || y < 0 || x >= xs.length || y >= ys.length) continue;
      const to = { x: xs[x], y: ys[y] };
      const possible = dx ? candidates('y', from.y) : candidates('x', from.x);
      if (possible.some(rect => segmentCrossesRectangle(from, to, rect))) continue;
      const cost = current.cost + Math.abs(to.x - from.x) + Math.abs(to.y - from.y) + (current.direction && direction !== current.direction ? 18 : 0);
      const nextKey = key(x, y, direction);
      if (cost >= (costs.get(nextKey) ?? Infinity)) continue;
      costs.set(nextKey, cost); previous.set(nextKey, current);
      push({ x, y, direction, key: nextKey, cost, score: cost + Math.abs(to.x - end.x) + Math.abs(to.y - end.y) });
    }
  }
  return null;
}

function compact(points) {
  const result = [];
  for (const point of points) {
    if (result.length && result.at(-1).x === point.x && result.at(-1).y === point.y) continue;
    while (result.length > 1) {
      const a = result.at(-2), b = result.at(-1);
      if ((a.x === b.x && b.x === point.x) || (a.y === b.y && b.y === point.y)) result.pop(); else break;
    }
    result.push(point);
  }
  return result;
}

export function routeCategoryEdge(edge, curve, context, lane = 0) {
  if (!context) return null;
  const source = context.owners.get(edge.source), target = context.owners.get(edge.target);
  let obstacles = context.obstacles.filter(rect => rect.key !== source && rect.key !== target && rect.key !== 'node:' + edge.source && rect.key !== 'node:' + edge.target && (!rect.owner || rect.owner === source || rect.owner === target));
  if (lane) {
    const extra = 1 + (Math.max(-80, Math.min(80, lane)) + 80) / 32;
    obstacles = obstacles.map(rect => ({ ...rect, left: rect.left - extra, right: rect.right + extra, top: rect.top - extra, bottom: rect.bottom + extra }));
  }
  if (!obstacles.length) return null;
  const [p0, p1, p2, p3] = curve;
  const near = obstacles.filter(rect => rect.left < Math.max(...curve.map(point => point.x)) && rect.right > Math.min(...curve.map(point => point.x)) && rect.top < Math.max(...curve.map(point => point.y)) && rect.bottom > Math.min(...curve.map(point => point.y)));
  if (!near.length) return null;
  let before = p0, blocked = false;
  for (let i = 1; i <= 40 && !blocked; i++) {
    const t = i / 40, u = 1 - t;
    const point = { x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x, y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y };
    blocked = near.some(rect => segmentCrossesRectangle(before, point, rect)); before = point;
  }
  if (!blocked) return null;
  const start = { x: p0.x + 18, y: p0.y }, end = { x: p3.x + (edge.source === edge.target ? 18 : -18), y: p3.y };
  if (obstacles.some(rect => segmentCrossesRectangle(p0, start, rect) || segmentCrossesRectangle(end, p3, rect))) return null;
  const route = detour(start, end, obstacles);
  if (!route) return null; // Overlapping manual boxes can leave no safe corridor.
  const points = compact([p0, ...route, p3]);
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    if (i === points.length - 1) { path += ` L ${points[i].x} ${points[i].y}`; continue; }
    const a = points[i - 1], b = points[i], c = points[i + 1];
    const radius = Math.min(8, Math.hypot(b.x - a.x, b.y - a.y) / 2, Math.hypot(c.x - b.x, c.y - b.y) / 2);
    const approach = { x: b.x + Math.sign(a.x - b.x) * radius, y: b.y + Math.sign(a.y - b.y) * radius };
    const leave = { x: b.x + Math.sign(c.x - b.x) * radius, y: b.y + Math.sign(c.y - b.y) * radius };
    path += ` L ${approach.x} ${approach.y} Q ${b.x} ${b.y} ${leave.x} ${leave.y}`;
  }
  let labelFrom = points[0], labelTo = points[1], longest = 0;
  for (let i = 1; i < points.length; i++) { const length = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y); if (length > longest) { longest = length; labelFrom = points[i - 1]; labelTo = points[i]; } }
  return { points, path, labelPoint: { x: (labelFrom.x + labelTo.x) / 2, y: (labelFrom.y + labelTo.y) / 2 } };
}
