import { COLUMN_GAP, NODE_WIDTH, layoutGraph } from "./layout.js";
import { createChartFigure } from "./charts.js";

const stageLabel = (index) => "Step " + String(index + 1).padStart(2, "0");
const htmlNode = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);
  return node;
};
const nodeSummary = (node) => [node.label, node.type, node.description, node.source, node.group, node.chart?.label, node.chart?.evidence, ...(node.chart?.categories || []), ...Object.values(node.details || {}).flat()].filter(Boolean).join(" ").toLowerCase();
const timelineIcon = () => {
  const shell = htmlNode("span", "timeline-node-icon");
  shell.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 6 5 L 12 10 L 6 15 M 7 5 L 4 5 M 7 15 L 4 15");
  svg.append(path);
  for (const [cx, cy] of [[4, 5], [13, 10], [4, 15]]) {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", String(cx));
    dot.setAttribute("cy", String(cy));
    dot.setAttribute("r", "1.5");
    svg.append(dot);
  }
  shell.append(svg);
  return shell;
};

export function dependencyStages(graph) {
  if (!graph?.nodes?.length) return [];
  const structuralGraph = { ...graph, nodes: graph.nodes.map((node) => ({ ...node, position: null })) };
  const positions = layoutGraph(structuralGraph).positions;
  const stageMap = new Map();
  for (const node of graph.nodes) {
    const point = positions.get(node.id);
    const stage = Math.max(0, Math.round(point.x / (NODE_WIDTH + COLUMN_GAP)));
    if (!stageMap.has(stage)) stageMap.set(stage, []);
    stageMap.get(stage).push(node);
  }
  return [...stageMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([index, nodes]) => ({ index, label: stageLabel(index), nodes }));
}

function buildRelationshipIndex(graph) {
  const labels = new Map(graph.nodes.map((node) => [node.id, node.label]));
  const outgoing = new Map();
  const incoming = new Map();
  const add = (index, id, relation) => {
    if (!index.has(id)) index.set(id, []);
    index.get(id).push(relation);
  };
  for (const edge of graph.edges) {
    const label = edge.label || edge.type || "Unlabeled connection";
    add(outgoing, edge.source, {
      direction: "To",
      nodeId: edge.target,
      nodeLabel: labels.get(edge.target) || edge.target,
      label,
    });
    if (edge.source !== edge.target) {
      add(incoming, edge.target, {
        direction: "From",
        nodeId: edge.source,
        nodeLabel: labels.get(edge.source) || edge.source,
        label,
      });
    }
  }
  return { outgoing, incoming };
}

function relationshipsFromIndex(index, nodeId, perDirectionLimit = 4) {
  const limit = Math.max(0, Math.min(8, Number.isInteger(perDirectionLimit) ? perDirectionLimit : 4));
  const outgoing = index.outgoing.get(nodeId) || [];
  const incoming = index.incoming.get(nodeId) || [];
  const links = [...outgoing.slice(0, limit), ...incoming.slice(0, limit)];
  return { links, omitted: outgoing.length + incoming.length - links.length };
}

export function createRelationshipLookup(graph) {
  const index = buildRelationshipIndex(graph);
  return (nodeId, perDirectionLimit = 4) => relationshipsFromIndex(index, nodeId, perDirectionLimit);
}

export function relationshipsForNode(graph, nodeId, perDirectionLimit = 4) {
  return createRelationshipLookup(graph)(nodeId, perDirectionLimit);
}
export function renderTimeline(graph, { onSelectNode = () => {}, selectedNodeId = null, excludedTypes = new Set(), searchTerm = "", focusedType = "" } = {}) {
  const surface = htmlNode("div", "timeline-surface");
  const intro = htmlNode("div", "timeline-intro");
  intro.append(htmlNode("span", "timeline-kicker", "DEPENDENCY FLOW"));
  intro.append(htmlNode("p", "timeline-note", "Ordered from upstream components. Step numbers do not represent calendar dates."));
  const overview = htmlNode("nav", "timeline-overview");
  overview.setAttribute("aria-label", "Dependency steps");
  const scroller = htmlNode("div", "timeline-scroller");
  scroller.tabIndex = 0;
  scroller.setAttribute("aria-label", "Software architecture dependency stages");
  const rail = htmlNode("div", "timeline-rail");
  const stages = dependencyStages(graph);
  const relationshipsFor = createRelationshipLookup(graph);
  let visibleStageCount = 0;

  for (const stage of stages) {
    const visibleNodes = stage.nodes.filter((node) => !excludedTypes.has(node.type) && (!searchTerm || nodeSummary(node).includes(searchTerm.toLowerCase())));
    if (!visibleNodes.length) continue;
    visibleStageCount += 1;
    const stageId = "atlas-dependency-step-" + (stage.index + 1);
    const section = htmlNode("section", "timeline-stage");
    section.id = stageId;
    section.setAttribute("aria-labelledby", stageId + "-title");
    const head = htmlNode("div", "timeline-stage-head");
    head.append(htmlNode("span", "timeline-stage-dot"));
    const headCopy = htmlNode("div", "timeline-stage-copy");
    const title = htmlNode("h3", "timeline-stage-title", stage.label);
    title.id = stageId + "-title";
    headCopy.append(title, htmlNode("p", "timeline-stage-count", visibleNodes.length + (visibleNodes.length === 1 ? " component" : " components")));
    head.append(headCopy);
    section.append(head);

    for (const node of visibleNodes) {
      const card = htmlNode("article", "timeline-node-card" + (node.id === selectedNodeId ? " selected" : ""));
      card.dataset.nodeId = node.id;
      card.dataset.nodeType = node.type;
      if (focusedType && node.type !== focusedType) card.classList.add("focus-dimmed");
      const select = htmlNode("button", "timeline-node-select");
      select.type = "button";
      select.dataset.focusNodeId = node.id;
      select.dataset.focusKind = "card";
      select.setAttribute("aria-pressed", String(node.id === selectedNodeId));
      select.setAttribute("aria-label", "Select " + node.label + ", " + node.type);
      const cardHeader = htmlNode("span", "timeline-node-heading");
      cardHeader.append(htmlNode("span", "timeline-node-type", node.type), timelineIcon());
      select.append(cardHeader);
      select.append(htmlNode("strong", "timeline-node-title", node.label));
      select.addEventListener("click", () => onSelectNode(node.id));
      card.append(select);
      if (node.description) card.append(htmlNode("p", "timeline-node-description", node.description));
      if (node.source) {
        const source = htmlNode("code", "timeline-node-source", node.source);
        card.append(source);
      }
      const relations = relationshipsFor(node.id);
      if (relations.links.length) {
        const relationList = htmlNode("ul", "timeline-connection-list");
        relationList.setAttribute("aria-label", "Connections for " + node.label);
        for (const relation of relations.links) {
          const item = htmlNode("li", "timeline-connection");
          item.append(htmlNode("span", "timeline-direction", relation.direction));
          const neighbor = htmlNode("button", "timeline-neighbor", relation.nodeLabel);
          neighbor.type = "button";
          neighbor.dataset.focusNodeId = relation.nodeId;
          neighbor.dataset.focusKind = "relationship";
          neighbor.setAttribute("aria-label", "Select " + relation.nodeLabel + " through " + relation.label);
          neighbor.addEventListener("click", () => onSelectNode(relation.nodeId));
          item.append(neighbor, htmlNode("span", "timeline-relation", relation.label));
          relationList.append(item);
        }
        if (relations.omitted) relationList.append(htmlNode("li", "timeline-connection-more", relations.omitted + " more connections"));
        card.append(relationList);
      }
      if (node.chart) card.append(createChartFigure(node.chart));
      section.append(card);
    }
    rail.append(section);

    const jump = htmlNode("button", "timeline-step-button", stage.label);
    jump.type = "button";
    jump.setAttribute("aria-controls", stageId);
    jump.addEventListener("click", () => section.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest", inline: "start" }));
    overview.append(jump);
  }

  if (!visibleStageCount) {
    surface.append(htmlNode("p", "timeline-empty", graph.nodes.length ? "No components match the current search and filters." : "Add a component to see dependency stages."));
    return surface;
  }
  scroller.append(rail);
  surface.append(intro, overview, scroller);
  return surface;
}
