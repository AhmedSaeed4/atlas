// Presentation-only ordering. Relationship direction and saved coordinates are
// never rewritten to make a drawing look like a simpler workflow.
const uniqueLinks = edges => [...new Map(edges.filter(edge => edge.source !== edge.target)
  .map(edge => [JSON.stringify([edge.source, edge.target]), edge])).values()];

function orderCost(columns, links) {
  const slots = new Map();
  for (const [rank, items] of columns) items.forEach((node, index) => slots.set(node.id, { x: rank, y: (index + .5) / items.length }));
  let cost = 0;
  const segments = [];
  for (const edge of links) {
    const a = slots.get(edge.source), b = slots.get(edge.target);
    if (!a || !b || a.x === b.x) continue;
    cost += Math.abs(a.y - b.y);
    if (segments.length < 400) segments.push({ a, b, source: edge.source, target: edge.target });
  }
  for (let i = 0; i < segments.length; i++) for (let j = i + 1; j < segments.length; j++) {
    const a = segments[i], b = segments[j];
    if (a.source === b.source || a.target === b.target || a.source === b.target || a.target === b.source) continue;
    if (crosses(a.a, a.b, b.a, b.b)) cost += 4;
  }
  return cost;
}

function crosses(a, b, c, d) {
  const side = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  return side(a, b, c) * side(a, b, d) < -.001 && side(c, d, a) * side(c, d, b) < -.001;
}

export function orderLayoutColumns(columns, edges) {
  const links = uniqueLinks(edges), neighbours = new Map();
  for (const { source, target } of links) {
    if (!neighbours.has(source)) neighbours.set(source, new Set());
    if (!neighbours.has(target)) neighbours.set(target, new Set());
    neighbours.get(source).add(target); neighbours.get(target).add(source);
  }
  const ranks = [...columns.keys()].sort((a, b) => a - b);
  let best = new Map([...columns].map(([rank, items]) => [rank, [...items]])), bestCost = orderCost(columns, links);
  // A bounded pair of forward/backward barycentre sweeps keeps neighbours
  // aligned. Retain the best complete ordering, including the original.
  for (let pass = 0; pass < 6; pass++) {
    const order = pass % 2 ? [...ranks].reverse() : ranks;
    for (const rank of order) {
      const slots = new Map();
      for (const [otherRank, items] of columns) items.forEach((node, index) => slots.set(node.id, { rank: otherRank, y: (index + .5) / items.length }));
      const items = columns.get(rank), original = new Map(items.map((node, index) => [node.id, index]));
      const centre = node => {
        const neighboursHere = [...(neighbours.get(node.id) || [])].map(id => slots.get(id))
          .filter(slot => slot && (pass % 2 ? slot.rank > rank : slot.rank < rank));
        return neighboursHere.length ? neighboursHere.reduce((sum, slot) => sum + slot.y, 0) / neighboursHere.length : slots.get(node.id).y;
      };
      const centres = new Map(items.map(node => [node.id, centre(node)]));
      items.sort((a, b) => centres.get(a.id) - centres.get(b.id) || original.get(a.id) - original.get(b.id));
    }
    const cost = orderCost(columns, links);
    if (cost < bestCost - .001) { bestCost = cost; best = new Map([...columns].map(([rank, items]) => [rank, [...items]])); }
  }
  for (const [rank, items] of best) columns.set(rank, items);
}

// Cyclic/independent blocks may share a rank before wrapping. Keep connected
// neighbours together instead of letting their names decide separate columns.
export function connectedBlockOrder(items, edges) {
  if (items.length < 4) return items;
  const remaining = new Map(items.map(node => [node.id, node])), adjacent = new Map(items.map(node => [node.id, new Set()]));
  for (const edge of uniqueLinks(edges)) if (remaining.has(edge.source) && remaining.has(edge.target)) {
    adjacent.get(edge.source).add(edge.target); adjacent.get(edge.target).add(edge.source);
  }
  const ordered = [], queue = [];
  while (remaining.size) {
    if (!queue.length) queue.push(remaining.keys().next().value);
    const id = queue.shift(), node = remaining.get(id);
    if (!node) continue;
    remaining.delete(id); ordered.push(node);
    for (const neighbour of adjacent.get(id)) if (remaining.has(neighbour) && !queue.includes(neighbour)) queue.push(neighbour);
  }
  return ordered;
}

export function layoutConnectionCost(layout, edges) {
  const links = uniqueLinks(edges), segments = [];
  let length = 0, backwards = 0;
  for (const edge of links) {
    const a = layout.positions.get(edge.source), b = layout.positions.get(edge.target);
    if (!a || !b) continue;
    const sizeA = layout.dimensions.get(edge.source), sizeB = layout.dimensions.get(edge.target);
    const start = { x: a.x + sizeA.width / 2, y: a.y + sizeA.height / 2 };
    const end = { x: b.x + sizeB.width / 2, y: b.y + sizeB.height / 2 };
    length += Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    if (end.x < start.x) backwards++;
    if (segments.length < 400) segments.push({ a: start, b: end, source: edge.source, target: edge.target });
  }
  let crossings = 0;
  for (let i = 0; i < segments.length; i++) for (let j = i + 1; j < segments.length; j++) {
    const a = segments[i], b = segments[j];
    if (a.source === b.source || a.target === b.target || a.source === b.target || a.target === b.source) continue;
    if (crosses(a.a, a.b, b.a, b.b)) crossings++;
  }
  return crossings * 120 + backwards * 35 + length / Math.max(1, links.length) * .45;
}
