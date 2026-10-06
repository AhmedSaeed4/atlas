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

export function layoutGraph(graph) {
  const { nodes, edges } = graph;
  const dimensions = new Map(nodes.map((node) => [node.id, nodeDimensions(node)]));
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
  for (const node of nodes) {
    const rank = ranks[componentById.get(node.id)];
    if (!columns.has(rank)) columns.set(rank, []);
    columns.get(rank).push(node);
  }
  const positions = new Map();
  for (const [column, items] of [...columns.entries()].sort((a, b) => a[0] - b[0])) {
    items.sort((a, b) => {
      const byGroup = (a.group || a.type).localeCompare(b.group || b.type);
      return byGroup || a.label.localeCompare(b.label);
    });
    const columnHeight = items.reduce((sum, node) => sum + dimensions.get(node.id).height, 0) + Math.max(0, items.length - 1) * ROW_GAP;
    let cursorY = -columnHeight / 2;
    items.forEach((node) => {
      const computed = { x: column * (NODE_WIDTH + COLUMN_GAP), y: cursorY };
      const hasPosition = node.position && Number.isFinite(node.position.x) && Number.isFinite(node.position.y);
      positions.set(node.id, hasPosition ? { x: node.position.x, y: node.position.y } : computed);
      cursorY += dimensions.get(node.id).height + ROW_GAP;
    });
  }
  const values = [...positions.values()];
  const minX = Math.min(...values.map((point) => point.x));
  const minY = Math.min(...values.map((point) => point.y));
  const maxX = Math.max(...nodes.map((node) => positions.get(node.id).x + dimensions.get(node.id).width));
  const maxY = Math.max(...nodes.map((node) => positions.get(node.id).y + dimensions.get(node.id).height));
  return { positions, dimensions, bounds: { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) } };
}

export function centerLayout(graph) {
  const layout = layoutGraph(graph);
  const { x, y, width, height } = layout.bounds;
  const positions = new Map();
  for (const [id, point] of layout.positions) positions.set(id, { x: point.x - x - width / 2, y: point.y - y - height / 2 });
  return { positions, dimensions: layout.dimensions, bounds: { x: -width / 2, y: -height / 2, width, height } };
}
