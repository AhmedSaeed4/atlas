import { categoryBounds, CATEGORY_PADDING, CATEGORY_HEADER, CATEGORY_MIN_WIDTH } from './map-categories.js';

export const NODE_WIDTH = 204;
export const NODE_HEIGHT = 108;
export const NODE_CHART_HEIGHT = 176;
export const NODE_CHART_LABEL_HEIGHT = 200;
export const NODE_JUNCTION_SIZE = 36;
export const COLUMN_GAP = 118;
export const ROW_GAP = 34;

export function nodeDimensions(node) {
  if (node?.junction === true) return { width: NODE_JUNCTION_SIZE, height: NODE_JUNCTION_SIZE };
  const labelsFit = Boolean(node?.chart)
    && Array.isArray(node.chart.categories)
    && Array.isArray(node.chart.values)
    && node.chart.categories.length === node.chart.values.length
    && node.chart.values.length <= 5;
  return { width: NODE_WIDTH, height: node?.chart ? (labelsFit ? NODE_CHART_LABEL_HEIGHT : NODE_CHART_HEIGHT) : NODE_HEIGHT };
}

function layoutPlain(graph, dimensions = new Map(graph.nodes.map(node => [node.id, nodeDimensions(node)])), { maxColumns = Infinity, columnGap = COLUMN_GAP, rowGap = ROW_GAP, wrapColumns = false, balancedRanks = false, wrapHeightFactor = .7 } = {}) {
  const { nodes, edges } = graph;
  if (!nodes.length) return { positions: new Map(), dimensions, bounds: { x: 0, y: 0, width: 1, height: 1 } };
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const adjacency = new Map(nodes.map((node) => [node.id, []]));
  for (const edge of edges) {
    if (nodeById.has(edge.source) && nodeById.has(edge.target)) adjacency.get(edge.source).push(edge.target);
  }

  let nextIndex = 0;
  const indexById = new Map();
  const lowById = new Map();
  const stack = [];
  const onStack = new Set();
  const components = [];
  const componentById = new Map();
  function visit(id) {
    indexById.set(id, nextIndex);
    lowById.set(id, nextIndex);
    nextIndex += 1;
    stack.push(id);
    onStack.add(id);
    for (const target of adjacency.get(id)) {
      if (!indexById.has(target)) {
        visit(target);
        lowById.set(id, Math.min(lowById.get(id), lowById.get(target)));
      } else if (onStack.has(target)) {
        lowById.set(id, Math.min(lowById.get(id), indexById.get(target)));
      }
    }
    if (lowById.get(id) === indexById.get(id)) {
      const component = [];
      let member;
      do {
        member = stack.pop();
        onStack.delete(member);
        componentById.set(member, components.length);
        component.push(member);
      } while (member !== id);
      components.push(component);
    }
  }
  for (const node of nodes) if (!indexById.has(node.id)) visit(node.id);

  const componentEdges = components.map(() => new Set());
  const indegree = components.map(() => 0);
  for (const edge of edges) {
    if (!nodeById.has(edge.source) || !nodeById.has(edge.target)) continue;
    const source = componentById.get(edge.source);
    const target = componentById.get(edge.target);
    if (source !== target && !componentEdges[source].has(target)) {
      componentEdges[source].add(target);
      indegree[target] += 1;
    }
  }
  const ranks = components.map(() => 0);
  const queue = [];
  indegree.forEach((count, index) => { if (count === 0) queue.push(index); });
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const source = queue[cursor];
    for (const target of componentEdges[source]) {
      ranks[target] = Math.max(ranks[target], ranks[source] + 1);
      indegree[target] -= 1;
      if (indegree[target] === 0) queue.push(target);
    }
  }

  const columns = new Map();
  const rankCount = Math.max(...ranks) + 1;
  for (const node of nodes) {
    const rank = balancedRanks && rankCount > maxColumns ? Math.floor(ranks[componentById.get(node.id)] * maxColumns / rankCount) : Math.floor(ranks[componentById.get(node.id)] / Math.max(1, Math.ceil(rankCount / maxColumns)));
    if (!columns.has(rank)) columns.set(rank, []);
    columns.get(rank).push(node);
  }
  const positions = new Map();
  let columnX = 0;
  for (const [, items] of [...columns.entries()].sort((a, b) => a[0] - b[0])) {
    items.sort((a, b) => {
      const byGroup = (a.group || a.type).localeCompare(b.group || b.type);
      return byGroup || a.label.localeCompare(b.label);
    });
    // Independent/cyclic category blocks can share a rank. Wrap those blocks
    // into balanced columns rather than building a very tall, unreadable stack.
    const targetHeight = wrapColumns && items.length > 3 ? Math.max(Math.max(...items.map(node => dimensions.get(node.id).height)) * 2 + rowGap, Math.sqrt(items.reduce((area, node) => {
      const size = dimensions.get(node.id);
      return area + (size.width + columnGap) * (size.height + rowGap);
    }, 0) * wrapHeightFactor)) : Infinity;
    const batches = [[]];
    let batchHeight = 0;
    for (const node of items) {
      const height = dimensions.get(node.id).height;
      if (batchHeight && batchHeight + rowGap + height > targetHeight) { batches.push([]); batchHeight = 0; }
      batches.at(-1).push(node);
      batchHeight += (batchHeight ? rowGap : 0) + height;
    }
    for (const batch of batches) {
      const columnHeight = batch.reduce((sum, node) => sum + dimensions.get(node.id).height, 0) + Math.max(0, batch.length - 1) * rowGap;
      let cursorY = -columnHeight / 2;
      for (const node of batch) {
        const computed = { x: columnX, y: cursorY };
        const hasPosition = node.position && Number.isFinite(node.position.x) && Number.isFinite(node.position.y);
        positions.set(node.id, hasPosition ? { x: node.position.x, y: node.position.y } : computed);
        cursorY += dimensions.get(node.id).height + rowGap;
      }
      columnX += Math.max(NODE_WIDTH, ...batch.map(node => dimensions.get(node.id).width)) + columnGap;
    }
  }
  const values = [...positions.values()];
  const minX = Math.min(...values.map((point) => point.x));
  const minY = Math.min(...values.map((point) => point.y));
  const maxX = Math.max(...nodes.map((node) => positions.get(node.id).x + dimensions.get(node.id).width));
  const maxY = Math.max(...nodes.map((node) => positions.get(node.id).y + dimensions.get(node.id).height));
  return { positions, dimensions, bounds: { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) } };
}

export function layoutGraph(graph, { categoryFrames = false } = {}) {
  if (!categoryFrames) return layoutPlain(graph);
  if (!graph.nodes.some(node => node.group && !node.viewGroup)) return layoutPlain({ ...graph, nodes: graph.nodes.map(node => ({ ...node, position: node.framePosition || node.position })) }, undefined, { wrapColumns: graph.nodes.some(node => node.viewGroup) });
  const dimensions = new Map(graph.nodes.map(node => [node.id, nodeDimensions(node)]));
  const buckets = new Map(), membership = new Map(), blocks = [], sizes = new Map(), interiors = new Map();
  for (const node of graph.nodes) {
    const key = node.group && !node.viewGroup ? 'category:' + node.group : 'node:' + node.id;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(node);
    membership.set(node.id, key);
  }
  for (const [id, members] of buckets) {
    const grouped = id.startsWith('category:');
    blocks.push({ id, label: grouped ? members[0].group : members[0].label, type: '', group: '' });
    if (!grouped) { sizes.set(id, dimensions.get(members[0].id)); continue; }
    const ids = new Set(members.map(node => node.id));
    const inner = layoutPlain({ nodes: members.map(node => ({ ...node, position: undefined })), edges: graph.edges.filter(edge => ids.has(edge.source) && ids.has(edge.target)) }, dimensions, { maxColumns: 3, columnGap: 100, rowGap: 48 });
    interiors.set(id, inner);
    sizes.set(id, { width: Math.max(CATEGORY_MIN_WIDTH, inner.bounds.width + CATEGORY_PADDING * 2), height: inner.bounds.height + CATEGORY_HEADER + CATEGORY_PADDING });
  }
  const edges = graph.edges.map(edge => ({ source: membership.get(edge.source), target: membership.get(edge.target) })).filter(edge => edge.source && edge.target && edge.source !== edge.target);
  const options = { maxColumns: blocks.length > 8 ? 4 : Infinity, rowGap: 144, columnGap: 208, wrapColumns: true, balancedRanks: true };
  const candidates = (blocks.length > 8 ? [.7, 1.4, 2.8] : [.7]).map(wrapHeightFactor => layoutPlain({ nodes: blocks, edges }, sizes, { ...options, wrapHeightFactor }));
  const score = ({ bounds }) => Math.max(bounds.width / 1.65, bounds.height) + bounds.width * bounds.height / 200000;
  const outer = candidates.sort((a, b) => score(a) - score(b))[0];
  const positions = new Map();
  for (const [id, members] of buckets) {
    const origin = outer.positions.get(id), inner = interiors.get(id);
    for (const node of members) {
      const point = inner?.positions.get(node.id);
      const computed = point ? { x: origin.x + CATEGORY_PADDING + point.x - inner.bounds.x, y: origin.y + CATEGORY_HEADER + point.y - inner.bounds.y } : origin;
      positions.set(node.id, node.framePosition && Number.isFinite(node.framePosition.x) && Number.isFinite(node.framePosition.y) ? { ...node.framePosition } : { ...computed });
    }
  }
  const rectangles = [...graph.nodes.map(node => ({ ...positions.get(node.id), ...dimensions.get(node.id) })), ...categoryBounds(graph, positions, dimensions)];
  const x = Math.min(...rectangles.map(rect => rect.x)), y = Math.min(...rectangles.map(rect => rect.y));
  return { positions, dimensions, bounds: { x, y, width: Math.max(...rectangles.map(rect => rect.x + rect.width)) - x, height: Math.max(...rectangles.map(rect => rect.y + rect.height)) - y } };
}

export function centerLayout(graph, options) {
  const layout = layoutGraph(graph, options);
  const { x, y, width, height } = layout.bounds;
  const positions = new Map();
  for (const [id, point] of layout.positions) positions.set(id, { x: point.x - x - width / 2, y: point.y - y - height / 2 });
  return { positions, dimensions: layout.dimensions, bounds: { x: -width / 2, y: -height / 2, width, height } };
}
