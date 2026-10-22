import { categoryBounds, CATEGORY_HEADER } from './map-categories.js';
import { routeObstacleCurve } from './category-routing.js';

const owner = node => JSON.stringify([node.group ? 'group' : 'node', node.group || node.id]);
const rect = (box, margin = 0) => ({ left: box.x - margin, right: box.x + box.width + margin, top: box.y - margin, bottom: box.y + box.height + margin });

function wireGeometry(start, end, index, obstacles, occupied = null) {
  start = { x: start.x, y: start.y }; end = { x: end.x, y: end.y };
  if (occupied?.length) {
    const left=Math.min(start.x,end.x)-180,right=Math.max(start.x,end.x)+180,top=Math.min(start.y,end.y)-180,bottom=Math.max(start.y,end.y)+180;
    occupied = occupied.filter(([a,b])=>Math.max(a.x,b.x)>=left&&Math.min(a.x,b.x)<=right&&Math.max(a.y,b.y)>=top&&Math.min(a.y,b.y)<=bottom).slice(-8);
  }
  const bend = Math.max(36, (end.x - start.x) * .42), offset = 58 + (index % 4) * 15;
  const backwards = end.x <= start.x, routeY = Math.min(start.y, end.y) - offset - 22;
  const p1 = { x: start.x + (backwards ? offset : bend), y: backwards ? routeY : start.y };
  const p2 = { x: end.x - (backwards ? offset : bend), y: backwards ? routeY : end.y };
  const points = [start, p1, p2, end], routed = routeObstacleCurve(points, obstacles, false, { force: Boolean(occupied), occupied: occupied || [] });
  const midpoint = routed?.labelPoint || { x: .125 * start.x + .375 * p1.x + .375 * p2.x + .125 * end.x, y: .125 * start.y + .375 * p1.y + .375 * p2.y + .125 * end.y };
  return { points: routed?.points || points,
    path: routed?.path || `M ${start.x} ${start.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${end.x} ${end.y}`,
    labelX: midpoint.x, labelY: midpoint.y - 9, orthogonal: Boolean(routed) };
}

// A drawing plan, never a replacement graph. Every shared segment retains the
// indexes of the original relationships, for tracing, filtering and inspection.
export function buildGroupConnections(graph, layout, excludedTypes = new Set()) {
  const allNodes = new Map(graph.nodes.map(node => [node.id, node]));
  const nodes = new Map(graph.nodes.filter(node => !excludedTypes.has(node.type)).map(node => [node.id, node]));
  const boxes = categoryBounds(graph, layout.positions, layout.dimensions, excludedTypes);
  const byGroup = new Map(boxes.map(box => [box.name, box]));
  const bundles = new Map(), branches = new Map(), ports = new Map(), crossEdges = new Set();
  // Suppress hidden cross-edges too; otherwise a filtered group can retain a
  // direct wire behind the shared drawing.
  graph.edges.forEach((edge, index) => {
    const source = allNodes.get(edge.source), target = allNodes.get(edge.target);
    if (!source || !target || owner(source) === owner(target) || (!source.group && !target.group)) return;
    crossEdges.add(index);
    if (!nodes.has(source.id) || !nodes.has(target.id)) return;
    const key = JSON.stringify([owner(source), owner(target)]);
    if (!bundles.has(key)) bundles.set(key, { id: 'trunk:' + key, kind: 'trunk', source, target, edgeIndexes: [] });
    bundles.get(key).edgeIndexes.push(index);
  });
  function endpoint(node, direction) {
    const point = layout.positions.get(node.id), size = layout.dimensions.get(node.id);
    const nodePort = { x: point.x + (direction === 'out' ? size.width : 0), y: point.y + size.height / 2 };
    if (!node.group) return nodePort;
    const box = byGroup.get(node.group), id = JSON.stringify([node.group, direction]);
    if (!ports.has(id)) ports.set(id, { id, group: node.group, direction, x: box.x + (direction === 'out' ? box.width : 0), y: box.y + CATEGORY_HEADER + (box.height - CATEGORY_HEADER) / 2 });
    return ports.get(id);
  }
  for (const bundle of bundles.values()) {
    bundle.start = endpoint(bundle.source, 'out'); bundle.end = endpoint(bundle.target, 'in');
    bundle.label = bundle.edgeIndexes.length > 1 ? bundle.edgeIndexes.length + ' connections' : '';
    bundle.title = (bundle.source.group || bundle.source.label) + ' → ' + (bundle.target.group || bundle.target.label);
    for (const index of bundle.edgeIndexes) {
      const edge = graph.edges[index];
      for (const [id, direction] of [[edge.source, 'out'], [edge.target, 'in']]) {
        const node = nodes.get(id);
        if (!node.group) continue;
        const key = JSON.stringify([id, direction]);
        if (!branches.has(key)) {
          const point = layout.positions.get(id), size = layout.dimensions.get(id);
          const nodePort = { x: point.x + (direction === 'out' ? size.width : 0), y: point.y + size.height / 2 };
          const port = endpoint(node, direction);
          branches.set(key, { id: 'branch:' + key, kind: 'branch', nodeId: id, group: node.group, direction,
            start: direction === 'out' ? nodePort : port, end: direction === 'out' ? port : nodePort,
            edgeIndexes: [], title: node.label + (direction === 'out' ? ' → group output' : ' ← group input') });
        }
        branches.get(key).edgeIndexes.push(index);
      }
    }
  }
  const nodeObstacles = [...nodes.values()].map(node => ({ id: node.id, group: node.group, ...rect({ ...layout.positions.get(node.id), ...layout.dimensions.get(node.id) }, 10) }));
  const wires = [...branches.values(), ...bundles.values()];
  const occupied = [], labels = [];
  wires.forEach((wire, index) => {
    const obstacles = wire.kind === 'branch'
      ? nodeObstacles.filter(box => box.group === wire.group && box.id !== wire.nodeId)
      : [...boxes.map(box => rect(box, box.name === wire.source.group || box.name === wire.target.group ? 0 : 14)),
        ...nodeObstacles.filter(box => !box.group && box.id !== wire.source.id && box.id !== wire.target.id)];
    wire.geometry = wireGeometry(wire.start, wire.end, index, obstacles, wire.kind === 'trunk' ? occupied : null);
    if (wire.kind === 'trunk' && wire.geometry.orthogonal) {
      const points = wire.geometry.points;
      for (let i = 1; i < points.length; i++) {
        let a = points[i - 1], b = points[i];
        // Shared port stubs are intentional; separate the routes beyond them.
        const length = Math.hypot(b.x-a.x,b.y-a.y);
        if ((i === 1 || i === points.length - 1) && length <= 48) continue;
        const originalA = a;
        if (i === 1) a = { x:a.x+(b.x-a.x)*24/length,y:a.y+(b.y-a.y)*24/length };
        if (i === points.length - 1) b = { x:b.x+(originalA.x-b.x)*24/length,y:b.y+(originalA.y-b.y)*24/length };
        if (occupied.length < 500) occupied.push([a, b]);
      }
    }
    if (wire.kind === 'trunk' && wire.label) {
      const width = wire.label.length * 5.3 + 18, points = wire.geometry.points;
      const segments = points.slice(1).map((point, i) => [points[i], point]).sort((a,b) => Math.hypot(b[1].x-b[0].x,b[1].y-b[0].y)-Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y));
      let placed = false;
      for (const [a,b] of segments) {
        if (Math.hypot(b.x-a.x,b.y-a.y) < 48) continue;
        for (const t of [.5,.3,.7]) {
          const x = a.x + (b.x-a.x)*t, y = a.y+(b.y-a.y)*t - 9;
          const candidate = { left:x-width/2-6,right:x+width/2+6,top:y-14,bottom:y+10 };
          if ([...boxes.map(box=>rect(box,4)), ...labels].some(box=>candidate.left<box.right&&candidate.right>box.left&&candidate.top<box.bottom&&candidate.bottom>box.top)) continue;
          wire.geometry.labelX=x; wire.geometry.labelY=y; labels.push(candidate); placed=true; break;
        }
        if (placed) break;
      }
      if (!placed) wire.label = ''; // Full relationship count remains in title/Inspector.
    }
  });
  return { crossEdges, wires, ports: [...ports.values()] };
}

export function groupConnectionPlan(graph, entry, excludedTypes = new Set()) {
  const key = JSON.stringify([...excludedTypes].sort());
  if (!entry.groupConnections || entry.groupConnections.key !== key) entry.groupConnections = { key, plan: buildGroupConnections(graph, entry.layout, excludedTypes) };
  return entry.groupConnections.plan;
}
