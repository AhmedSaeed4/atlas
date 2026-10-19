export function traceRoutes(graph, rootId, mode = "downstream") {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const nodes = new Set();
  const edges = new Set();
  if (!rootId || !nodeIds.has(rootId)) return { nodes, edges };

  if (mode === "all")
    return {
      nodes: nodeIds,
      edges: new Set(graph.edges.map((_, index) => index)),
    };
  const outgoing = new Map(graph.nodes.map((node) => [node.id, []]));
  graph.edges.forEach((edge, index) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return;
    if (mode === "upstream")
      outgoing.get(edge.target).push({ nodeId: edge.source, edgeIndex: index });
    else if (mode === "neighbours") {
      outgoing.get(edge.source).push({ nodeId: edge.target, edgeIndex: index });
      outgoing.get(edge.target).push({ nodeId: edge.source, edgeIndex: index });
    } else
      outgoing.get(edge.source).push({ nodeId: edge.target, edgeIndex: index });
  });

  function walkDownstream(startId) {
    const visited = new Set([startId]);
    const queue = [startId];
    nodes.add(startId);
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      for (const route of outgoing.get(current) || []) {
        edges.add(route.edgeIndex);
        nodes.add(route.nodeId);
        if (mode !== "neighbours" && !visited.has(route.nodeId)) {
          visited.add(route.nodeId);
          queue.push(route.nodeId);
        }
      }
    }
  }

  walkDownstream(rootId);
  return { nodes, edges };
}
