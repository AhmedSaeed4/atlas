export const nodeSearchText = (node) =>
  [
    node.label,
    node.type,
    node.description,
    node.source,
    node.group,
    node.viewSearchText,
    node.chart?.label,
    node.chart?.evidence,
    ...(node.chart?.categories || []),
    ...Object.values(node.details || {}).flat(),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
export const nodeMatchesQuery = (node, query) =>
  String(query || "")
    .slice(0, 200)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => nodeSearchText(node).includes(token));
export function searchComponents(
  graph,
  query,
  { limit = 10, excludedTypes = new Set(), collapsedGroups = new Set() } = {},
) {
  const term = String(query || "")
    .trim()
    .toLowerCase();
  if (!term) return { total: 0, results: [] };
  const matched = graph.nodes
    .filter((node) => nodeMatchesQuery(node, term))
    .map((node, index) => ({
      node,
      index,
      hidden: excludedTypes.has(node.type) || collapsedGroups.has(node.group),
      rank:
        node.label.toLowerCase() === term
          ? 0
          : node.label.toLowerCase().startsWith(term)
            ? 1
            : node.label.toLowerCase().includes(term)
              ? 2
              : 3,
    }));
  matched.sort((a, b) => a.rank - b.rank || a.index - b.index);
  return {
    total: matched.length,
    results: matched.slice(0, Math.max(1, Math.min(50, limit))),
  };
}

// This is a presentation projection only. Canonical graph data, exports, edits
// and cloud saves always use the original graph and its stable component IDs.
export function projectCollapsedGroups(
  graph,
  collapsed = new Set(),
  { excludedTypes = new Set() } = {},
) {
  if (!collapsed.size) return graph;
  const groups = new Map();
  for (const node of graph.nodes)
    if (
      node.group &&
      collapsed.has(node.group) &&
      !excludedTypes.has(node.type)
    ) {
      if (!groups.has(node.group)) groups.set(node.group, []);
      groups.get(node.group).push(node);
    }
  if (!groups.size) return graph;
  const used = new Set(graph.nodes.map((node) => node.id)),
    mapped = new Map(),
    summaries = [];
  for (const [name, members] of groups) {
    let id = "@atlas-group:" + summaries.length;
    while (used.has(id)) id += ":";
    used.add(id);
    for (const member of members) mapped.set(member.id, id);
    const memberIds = new Set(members.map((node) => node.id));
    const internal = graph.edges.filter(
      (edge) => memberIds.has(edge.source) && memberIds.has(edge.target),
    ).length;
    summaries.push({
      id,
      label: name,
      type: "Group",
      description:
        members.length +
        " components · " +
        internal +
        " internal " +
        (internal === 1 ? "connection" : "connections"),
      source: "Select to expand this group",
      group: "",
      viewGroup: name,
      memberCount: members.length,
      viewSearchText: members.map(nodeSearchText).join(" "),
    });
  }
  const combined = new Map(),
    edges = [];
  for (const edge of graph.edges) {
    const source = mapped.get(edge.source) || edge.source,
      target = mapped.get(edge.target) || edge.target;
    if (
      source === target &&
      (mapped.has(edge.source) || mapped.has(edge.target))
    )
      continue;
    if (source === edge.source && target === edge.target) {
      edges.push(edge);
      continue;
    }
    const key = JSON.stringify([source, target]);
    if (!combined.has(key)) combined.set(key, []);
    combined.get(key).push(edge);
  }
  const edgeIds = new Set(graph.edges.map((edge) => edge.id));
  let next = 0;
  for (const [key, originals] of combined) {
    const [source, target] = JSON.parse(key);
    let id = originals[0].id;
    if (originals.length > 1) {
      id = "@atlas-group-edge:" + next++;
      while (edgeIds.has(id)) id += ":";
      edgeIds.add(id);
    }
    edges.push({
      ...originals[0],
      id,
      source,
      target,
      label:
        originals.length > 1
          ? originals.length + " connections"
          : originals[0].label,
      viewAggregate: originals.length > 1,
      viewEdgeIds: originals.map((edge) => edge.id),
    });
  }
  return {
    ...graph,
    nodes: [
      ...graph.nodes.filter((node) => !mapped.has(node.id)),
      ...summaries,
    ],
    edges,
  };
}
