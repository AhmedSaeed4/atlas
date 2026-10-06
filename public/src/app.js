import { normalizeGraph, normalizeEditableGraph, assertGraphJsonWithinLimit, serializeGraphJson, MAX_IMPORT_BYTES, LIMITS, newEdgeId, newNodeId } from "./schema.js";
import { traceRoutes } from "./traces.js";
import { layoutGraph } from "./layout.js";
import { edgeGeometry, edgeRoutingLanes, graphBounds } from "./geometry.js";
import { SAMPLE_GRAPHS } from "./samples.js";
import { clearLibrary, createProjectId, readLibrary, writeLibrary } from "./storage.js";
import { buildSvg, copyPng, downloadBlob, downloadText, exportJson, safeFilename, svgToPngBlob } from "./exports.js";
import { buildAgentPrompt } from "./prompt.js";
import { chartCompactReadout, chartDescription, chartGeometry, chartPresentation, chartValueLabel, createChartFigure } from "./charts.js";
import { renderTimeline } from "./timeline.js";
import { clearEdgeEntranceState, graphMotionAllowed, setEdgeTraceState } from "./edge-motion.js";
import { createShareUrl, decodeShareHash, findSharedProject, isLocalShareHost, shareKey, shouldClearShareFragmentForDeletedProject } from "./share.js";
import { addOrReuseExampleProject, clearLocalDataRoute, clearRejectedShareRoute, consumeFlowExampleQuery, createRevisionGate, createShareLoadTracker, fitScaleForBounds, isFlowExampleRoute, shareFailureContext, readImportSource, removeProjectSnapshot, shouldSaveOnEnter } from "./controller-utils.js";
import { INSPECTOR_DEFAULT_WIDTH, clampInspectorWidth, inspectorWidthLimits, isNamedLinkSnapshotCurrent, namedLinkPayload, readInspectorExpanded, readInspectorWidthPreference, writeInspectorExpanded, writeInspectorWidth, writeNamedLinkClipboard } from "./refinement-ui.js";
import { branchEdgeCandidate, canStartPointerGesture, connectionPreviewPath, nodeContextIsCurrent, screenToWorld } from "./refinement-graph.js";
import { isCurrentTouchEdgeSelection, isTouchClick, transitionTypeInteractions } from "./filter-interaction.js";

const byId = (id) => document.getElementById(id);
const svgNS = "http://www.w3.org/2000/svg";
const FLOW_EXAMPLE_ID = "request-flow";
const FLOW_EXAMPLE_NAME = "Request flow demo";
const isFlowExample = (project) => project?.exampleId === FLOW_EXAMPLE_ID;
const stored = readLibrary(normalizeGraph);
let recoveryMode = !stored.writable;
let recoveryText = stored.rawBackup || "";
let projects = stored.projects ?? [];
let activeId = projects.some((project) => project.id === stored.activeId) ? stored.activeId : (projects[0]?.id || "");
let selectedNodeId = null;
let focusedType = "";
let excludedTypes = new Set();
let filterPointerActivation = null;
let filterInputModality = "";
let touchInteractionActive = false;
let touchSelectedEdge = null;
let searchTerm = "";
let editingNodeId = null;
let editingEdgeId = null;
let nodeEditContext = null;
let edgeEditContext = null;
let branchEditContext = null;
let projectEditContext = null;
let selectedEdgeId = null;
let edgeMenuContext = null;
let canvasMenuContext = null;
let nodeMenuContext = null;
let menuReturnFocus = null;
const dialogFocusTargets = new Map();
let selectedFile = null;
let confirmAction = null;
let dragState = null;
let motionPaused = false;
const shareLoadTracker = createShareLoadTracker();
let incomingShareFailure = null;
let confirmResumeShareLoad = null;
let projectEditResumeShareLoad = null;
let shareDialogSequence = 0;
let shareDialogProjectId = "";
let shareDialogProjectName = "";
let inspectorWidth = INSPECTOR_DEFAULT_WIDTH;
let inspectorPreferredWidth = INSPECTOR_DEFAULT_WIDTH;
let inspectorRestoreWidth = INSPECTOR_DEFAULT_WIDTH;
let inspectorExpanded = false;
let inspectorResizePointer = null;
const importReadGate = createRevisionGate();
const droppedFileGate = createRevisionGate();
let fitAnimationFrame = 0;
let fitAnimationSequence = 0;
let animateStructure = true;
let lastStorageError = "";
let transform = { x: 0, y: 0, scale: 1 };
let viewMode = "graph";
const activeProject = () => projects.find((project) => project.id === activeId) || null;
const emptyGraph = () => ({ schemaVersion: 1, project: { name: "No project selected", description: "", type: "Software project" }, nodes: [], edges: [] });
const currentGraph = () => activeProject()?.graph || emptyGraph();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const truncate = (value, limit) => {
  const text = String(value || "");
  return text.length > limit ? text.slice(0, limit - 1) + "..." : text;
};
const nodeSearchText = (node) => [node.label, node.type, node.description, node.source, node.group, node.chart?.label, node.chart?.evidence, ...(node.chart?.categories || []), ...Object.values(node.details || {}).flat()].filter(Boolean).join(" ").toLowerCase();
const plain = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = String(text);
  return element;
};
const svgElement = (tag, attrs = {}) => {
  const element = document.createElementNS(svgNS, tag);
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, String(value));
  return element;
};
const UI_ICON_PARTS = {
  component: [
    ["rect", { x: 3.5, y: 4.5, width: 13, height: 11, rx: 2 }],
    ["path", { d: "M7 8h6M7 11h4" }],
  ],
  connection: [
    ["path", { d: "M7 10h6m-2.5-2.5L13 10l-2.5 2.5" }],
    ["circle", { cx: 4.5, cy: 10, r: 1.5 }],
    ["circle", { cx: 15.5, cy: 10, r: 1.5 }],
  ],
  trash: [["path", { d: "M4 6h12M8 6V4h4v2m-7 0 .8 10h8.4L15 6M8.5 9v4.5M11.5 9v4.5" }]],
};
const uiIcon = (name) => {
  const icon = svgElement("svg", { class: "ui-icon", viewBox: "0 0 20 20", "aria-hidden": "true", focusable: "false" });
  for (const [tag, attributes] of UI_ICON_PARTS[name] || []) icon.append(svgElement(tag, attributes));
  return icon;
};
function showToast(message, kind = "") {
  const toast = plain("div", "toast" + (kind ? " " + kind : ""), message);
  byId("toast-region").append(toast);
  setTimeout(() => toast.remove(), 4600);
}
function inspectorWorkspaceWidth() {
  const workspace = document.querySelector(".graph-workspace");
  if (!workspace) return 0;
  const rect = workspace.getBoundingClientRect();
  const style = window.getComputedStyle(workspace);
  return rect.width - (Number.parseFloat(style.paddingLeft) || 0) - (Number.parseFloat(style.paddingRight) || 0);
}
function currentInspectorLimits() {
  return inspectorWidthLimits(inspectorWorkspaceWidth());
}
function applyInspectorWidth(value, { persist = false, expanded = false } = {}) {
  const workspace = document.querySelector(".graph-workspace");
  const limits = currentInspectorLimits();
  inspectorWidth = clampInspectorWidth(value, limits);
  inspectorExpanded = Boolean(expanded);
  if (workspace) workspace.style.setProperty("--inspector-width", inspectorWidth + "px");
  const separator = byId("inspector-resize");
  const expandButton = byId("expand-inspector");
  if (separator) {
    separator.setAttribute("aria-valuemin", String(limits.min));
    separator.setAttribute("aria-valuemax", String(limits.max));
    separator.setAttribute("aria-valuenow", String(inspectorWidth));
    separator.setAttribute("aria-valuetext", inspectorWidth + " pixels");
  }
  if (expandButton) {
    expandButton.setAttribute("aria-label", inspectorExpanded ? "Restore inspector width" : "Expand inspector");
    expandButton.title = inspectorExpanded ? "Restore inspector width" : "Expand inspector";
    expandButton.setAttribute("aria-expanded", String(inspectorExpanded));
    expandButton.disabled = !inspectorExpanded && limits.max <= inspectorWidth;
  }
  if (persist) {
    if (inspectorExpanded) {
      writeInspectorExpanded(() => window.localStorage, true);
    } else {
      writeInspectorWidth(() => window.localStorage, inspectorWidth, inspectorWorkspaceWidth());
      writeInspectorExpanded(() => window.localStorage, false);
      inspectorPreferredWidth = inspectorWidth;
    }
  }
  return inspectorWidth;
}

function bindInspectorResize() {
  const separator = byId("inspector-resize");
  if (!separator) return;
  inspectorPreferredWidth = readInspectorWidthPreference(() => window.localStorage);
  inspectorExpanded = readInspectorExpanded(() => window.localStorage);
  const initialLimits = currentInspectorLimits();
  inspectorRestoreWidth = clampInspectorWidth(inspectorPreferredWidth, initialLimits);
  inspectorWidth = inspectorExpanded ? initialLimits.max : inspectorRestoreWidth;
  applyInspectorWidth(inspectorWidth, { expanded: inspectorExpanded });
  separator.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    inspectorResizePointer = { id: event.pointerId, start: inspectorWidth, startX: event.clientX, expanded: inspectorExpanded };
    try { separator.setPointerCapture(event.pointerId); } catch {}
  });
  separator.addEventListener("pointermove", (event) => {
    if (!inspectorResizePointer || inspectorResizePointer.id !== event.pointerId) return;
    applyInspectorWidth(inspectorResizePointer.start + inspectorResizePointer.startX - event.clientX, { expanded: false });
  });
  const finishResize = (event, commit) => {
    if (!inspectorResizePointer || inspectorResizePointer.id !== event.pointerId) return;
    const initialWidth = inspectorResizePointer.start;
    const wasExpanded = inspectorResizePointer.expanded;
    inspectorResizePointer = null;
    if (commit) {
      applyInspectorWidth(inspectorWidth, { persist: true, expanded: false });
      fitGraph(false);
    } else {
      applyInspectorWidth(initialWidth, { expanded: wasExpanded });
    }
  };
  separator.addEventListener("pointerup", (event) => finishResize(event, true));
  separator.addEventListener("pointercancel", (event) => finishResize(event, false));
  separator.addEventListener("lostpointercapture", (event) => finishResize(event, false));
  separator.addEventListener("keydown", (event) => {
    const limits = currentInspectorLimits();
    let next = inspectorWidth;
    if (event.key === "ArrowLeft") next += 24;
    else if (event.key === "ArrowRight") next -= 24;
    else if (event.key === "Home") next = limits.min;
    else if (event.key === "End") next = limits.max;
    else return;
    event.preventDefault();
    applyInspectorWidth(next, { persist: true, expanded: false });
    fitGraph(false);
  });
  byId("expand-inspector").addEventListener("click", () => {
    const limits = currentInspectorLimits();
    if (inspectorExpanded) {
      applyInspectorWidth(inspectorRestoreWidth, { persist: true });
    } else {
      inspectorRestoreWidth = inspectorWidth;
      applyInspectorWidth(limits.max, { persist: true, expanded: true });
    }
    fitGraph(false);
  });
  window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      const limits = currentInspectorLimits();
      const preferredWidth = inspectorExpanded ? limits.max : inspectorPreferredWidth;
      applyInspectorWidth(preferredWidth, { expanded: inspectorExpanded });
      fitGraph(false);
    });
  }, { passive: true });
}
function localRecoveryMode() {
  byId("save-status").textContent = recoveryMode ? "Saved data needs attention" : "Saved locally";
  const statusDot = byId("save-status").querySelector(".status-dot");
  if (statusDot) statusDot.style.background = recoveryMode ? "#c59a71" : "";
  const storageCopy = byId("storage-copy");
  if (storageCopy) storageCopy.textContent = recoveryMode ? "Could not read saved data" : "Stored in this browser";
  byId("download-recovery").hidden = !recoveryText;
}
function persist(showFailure = true) {
  if (recoveryMode) {
    byId("save-status").textContent = "Recovery mode";
    if (showFailure && !lastStorageError) {
      lastStorageError = "The saved library could not be read. Download its backup or deliberately clear local data before saving a replacement.";
      showToast(lastStorageError, "error");
    }
    return false;
  }
  const result = writeLibrary(projects, activeId);
  if (result.ok) {
    byId("save-status").textContent = "Saved locally";
    lastStorageError = "";
    return true;
  }
  byId("save-status").textContent = "Changes not saved";
  if (showFailure && result.error !== lastStorageError) showToast(result.error, "error");
  lastStorageError = result.error;
  return false;
}
function graphChanged({ structure = true, fit = false } = {}) {
  animateStructure = structure;
  renderAll();
  if (fit) fitGraph(true);
  persist();
}
function makeProject(graph, id = createProjectId(), extra = {}) {
  return { id, graph, updatedAt: Date.now(), ...extra };
}
function renderLibrary() {
  const list = byId("project-list");
  list.replaceChildren();
  for (const project of projects) {
    const row = plain("button", "project-row" + (project.id === activeId ? " active" : ""));
    row.type = "button";
    row.setAttribute("aria-current", project.id === activeId ? "page" : "false");
    const icon = plain("span", "project-monogram", (project.graph.project.name || "A").slice(0, 1).toUpperCase());
    const nameWrap = plain("span", "project-name-wrap");
    nameWrap.append(plain("span", "project-name", project.graph.project.name || "Untitled project"));
    nameWrap.append(plain("span", "project-meta", project.graph.project.type || "Software project"));
    row.append(icon, nameWrap, plain("span", "project-count", String(project.graph.nodes.length)));
    row.addEventListener("click", () => selectProject(project.id));
    list.append(row);
  }
}
function updateProjectHeader() {
  const project = activeProject();
  const details = project?.graph.project;
  byId("breadcrumb-project").textContent = details?.name || "No project";
  byId("project-title").textContent = details?.name || "No project selected";
  byId("project-description").textContent = details?.description || "Import a map or create a project to start exploring.";
  byId("project-type").textContent = (details?.type || "SOFTWARE ARCHITECTURE").toUpperCase();
  byId("node-count").textContent = (project?.graph.nodes.length || 0) + " components";
  byId("graph-count-label").textContent = (project?.graph.nodes.length || 0) + " nodes / " + (project?.graph.edges.length || 0) + " edges";
  byId("status-summary").textContent = project ? "Ready to explore" : "Create a project or import a map";
}
function typeColor() {
  return "var(--atlas-muted)";
}
function graphTypeAccent(type) {
  const token = String(type || "component").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "component";
  return `var(--graph-type-${token}, var(--graph-accent, ${typeColor(type)}))`;
}
function renderFilters() {
  const container = byId("type-filters");
  container.replaceChildren();
  const types = [...new Set(currentGraph().nodes.map((node) => node.type))].sort((a, b) => a.localeCompare(b));
  if (focusedType && !types.includes(focusedType)) focusedType = "";
  if (!types.length) { syncFilterSpotlight(); return; }
  const all = plain("button", "filter-chip" + (excludedTypes.size === 0 ? " active" : ""), "All");
  all.type = "button";
  all.setAttribute("aria-pressed", String(excludedTypes.size === 0));
  all.addEventListener("click", (event) => {
    const pointerDownType = filterPointerActivation?.type === "all" ? filterPointerActivation.pointerType : "";
    filterPointerActivation = null;
    const touchActivation = isTouchClick(event, pointerDownType);
    filterInputModality = touchActivation ? "touch" : (event.pointerType || filterInputModality);
    applyTypeInteraction({
      kind: "activate-all",
      pointerType: event.pointerType || "",
      pointerDownType,
      detail: event.detail,
    });
    byId("type-filter-status").textContent = "All component types are visible and no type highlight is active.";
    renderFilters();
    renderGraph();
  });
  container.append(all);
  for (const type of types) {
    const chip = plain("button", "filter-chip" + (excludedTypes.has(type) ? "" : " active"));
    chip.type = "button";
    chip.dataset.type = type;
    chip.setAttribute("aria-pressed", String(!excludedTypes.has(type)));
    const dot = plain("span", "type-dot");
    dot.style.background = graphTypeAccent(type);
    chip.append(dot, plain("span", "", type), plain("span", "chip-count", String(currentGraph().nodes.filter((node) => node.type === type).length)));
    chip.addEventListener("click", (event) => {
      const pointerDownType = filterPointerActivation?.type === type ? filterPointerActivation.pointerType : "";
      filterPointerActivation = null;
      const action = {
        kind: "activate-type",
        type,
        pointerType: event.pointerType || "",
        pointerDownType,
        detail: event.detail,
      };
      const touchActivation = isTouchClick(action, pointerDownType);
      filterInputModality = touchActivation ? "touch" : (event.pointerType || filterInputModality);
      applyTypeInteraction(action);
      if (touchActivation) {
        byId("type-filter-status").textContent = focusedType
          ? "Highlighting " + focusedType + " components. Tap the same type again or choose All to clear."
          : "Component type highlight cleared.";
        return;
      }
      renderFilters();
      renderGraph();
    });
    container.append(chip);
  }
  syncFilterSpotlight();
}
function syncFilterSpotlight() {
  const container = byId("type-filters");
  container.classList.toggle("has-spotlight", Boolean(focusedType));
  for (const chip of container.querySelectorAll(".filter-chip[data-type]")) {
    const current = chip.dataset.type === focusedType;
    chip.classList.toggle("spotlight-active", current);
    chip.setAttribute("aria-current", current ? "true" : "false");
  }
}
function applyTypeInteraction(action) {
  const previousFocus = focusedType;
  const next = transitionTypeInteractions({ focusedType, excludedTypes, touchInteractionActive }, action);
  focusedType = next.focusedType;
  excludedTypes = next.excludedTypes;
  touchInteractionActive = next.touchInteractionActive;
  if (focusedType !== previousFocus) {
    syncFilterSpotlight();
    refreshTraceStyles();
  }
  return next;
}
function refreshTraceStyles() {
  const graph = currentGraph();
  const trace = traceRoutes(graph, selectedNodeId);
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const matches = new Set(graph.nodes.filter((node) => !searchTerm || nodeSearchText(node).includes(searchTerm)).map((node) => node.id));
  for (const card of byId("nodes-layer").querySelectorAll(".node-card")) {
    const nodeId = card.getAttribute("data-node-id");
    const selected = nodeId === selectedNodeId;
    const matched = matches.has(nodeId);
    const focusDimmed = Boolean(focusedType && nodeById.get(nodeId)?.type !== focusedType);
    card.classList.toggle("selected", selected);
    card.classList.toggle("search-hit", Boolean(searchTerm && matched));
    card.classList.toggle("dimmed", Boolean((searchTerm && !matched) || (selectedNodeId && !trace.nodes.has(nodeId))));
    card.classList.toggle("focus-dimmed", focusDimmed);
  }
  for (const card of byId("timeline-view").querySelectorAll(".timeline-node-card")) {
    card.classList.toggle("focus-dimmed", Boolean(focusedType && card.dataset.nodeType !== focusedType));
  }
  for (const group of byId("edges-layer").querySelectorAll(".edge-group")) {
    const edgeIndex = Number(group.getAttribute("data-edge-index"));
    const edge = graph.edges[edgeIndex];
    const connected = Boolean(selectedNodeId && trace.edges.has(edgeIndex));
    const focused = !focusedType || nodeById.get(edge?.source)?.type === focusedType || nodeById.get(edge?.target)?.type === focusedType;
    group.classList.toggle("dimmed", Boolean(selectedNodeId && !connected));
    group.classList.toggle("focus-dimmed", Boolean(focusedType && !focused));
    group.classList.toggle("selected", group.dataset.edgeId === selectedEdgeId);
    group.setAttribute("aria-pressed", String(group.dataset.edgeId === selectedEdgeId));
    setEdgeTraceState(group, group.querySelector(".edge-path"), group.querySelector(".edge-arrow"), connected);
  }
}
function setViewportTransform() {
  byId("viewport").setAttribute("transform", "translate(" + transform.x + " " + transform.y + ") scale(" + transform.scale + ")");
  const percent = transform.scale * 100;
  byId("zoom-label").textContent = percent < 1 ? percent.toFixed(1) + "%" : Math.round(percent) + "%";
}
function stopFitAnimation() {
  fitAnimationSequence += 1;
  if (fitAnimationFrame) cancelAnimationFrame(fitAnimationFrame);
  fitAnimationFrame = 0;
}
function fitGraph(animate = true) {
  stopFitAnimation();
  const sequence = fitAnimationSequence;
  const graph = currentGraph();
  const layout = layoutGraph(graph);
  const positions = layout.positions;
  const bounds = graphBounds(graph, positions, layout.dimensions);
  const rect = byId("graph-stage").getBoundingClientRect();
  if (!graph.nodes.length || rect.width < 1 || rect.height < 1) {
    transform = { x: rect.width / 2, y: rect.height / 2, scale: 1 };
    setViewportTransform();
    return;
  }
  const scale = fitScaleForBounds(bounds, rect);
  const target = {
    x: (rect.width - bounds.width * scale) / 2 - bounds.x * scale,
    y: (rect.height - bounds.height * scale) / 2 - bounds.y * scale,
    scale,
  };
  if (!animate || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    transform = target;
    setViewportTransform();
    return;
  }
  const start = { ...transform };
  const began = performance.now();
  const duration = 240;
  const step = (now) => {
    if (sequence !== fitAnimationSequence) return;
    const progress = clamp((now - began) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    transform = {
      x: start.x + (target.x - start.x) * eased,
      y: start.y + (target.y - start.y) * eased,
      scale: start.scale + (target.scale - start.scale) * eased,
    };
    setViewportTransform();
    if (progress < 1) fitAnimationFrame = requestAnimationFrame(step);
    else fitAnimationFrame = 0;
  };
  fitAnimationFrame = requestAnimationFrame(step);
}
function zoomAt(nextScale, clientX, clientY) {
  stopFitAnimation();
  const rect = byId("graph-stage").getBoundingClientRect();
  const px = clientX ?? rect.width / 2;
  const py = clientY ?? rect.height / 2;
  const scale = clamp(nextScale, .001, 2.5);
  transform.x = px - (px - transform.x) * (scale / transform.scale);
  transform.y = py - (py - transform.y) * (scale / transform.scale);
  transform.scale = scale;
  setViewportTransform();
}
function cardText(group, value, x, y, className, max) {
  const text = svgElement("text", { x, y, class: className });
  text.textContent = truncate(value, max);
  group.append(text);
}
function renderGraph() {
  const svgTimeline = byId("graph");
  const resumeSvgTimeline = viewMode === "graph" && !motionPaused && !document.hidden;
  try { svgTimeline.pauseAnimations(); svgTimeline.setCurrentTime(0); } catch {}
  const graph = currentGraph();
  const layout = layoutGraph(graph);
  const positions = layout.positions;
  const dimensions = layout.dimensions;
  const edgeLayer = byId("edges-layer");
  const nodeLayer = byId("nodes-layer");
  edgeLayer.replaceChildren();
  nodeLayer.replaceChildren();
  const nodeCards = new Map();
  const viewport = byId("viewport");
  const previousDefinitions = viewport.querySelector("defs");
  if (previousDefinitions) previousDefinitions.remove();
  const definitions = svgElement("defs");
  viewport.insertBefore(definitions, edgeLayer);
  const hasProject = Boolean(activeProject());
  const isEmpty = graph.nodes.length === 0;
  byId("empty-state").hidden = !isEmpty;
  byId("empty-state-title").textContent = hasProject ? "Your map starts here" : "Start with an empty workspace";
  byId("empty-state-copy").textContent = hasProject
    ? "Add a component to build this architecture, or import an agent-generated map."
    : "Add a project, import an agent-generated map, or copy the agent prompt from the page header.";
  byId("empty-state-create").textContent = hasProject ? "Add component" : "Add project";
  byId("node-count").textContent = graph.nodes.length + (graph.nodes.length === 1 ? " component" : " components");
  byId("graph-count-label").textContent = graph.nodes.length + " nodes / " + graph.edges.length + " edges";
  const trace = traceRoutes(graph, selectedNodeId);
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const visible = new Set(graph.nodes.filter((node) => !excludedTypes.has(node.type)).map((node) => node.id));
  const matches = new Set(graph.nodes.filter((node) => !searchTerm || nodeSearchText(node).includes(searchTerm)).map((node) => node.id));
  const animationAllowed = viewMode === "graph"
    && graphMotionAllowed(graph)
    && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const routingLanes = edgeRoutingLanes(graph.edges);
  for (const node of graph.nodes) {
    const position = positions.get(node.id);
    const size = dimensions.get(node.id);
    const group = svgElement("g", { class: "node-card", "data-node-id": node.id, "data-node-type": node.type, transform: "translate(" + position.x + " " + position.y + ")", tabindex: 0, role: "button", "aria-label": node.junction ? "Branch junction, " + node.label : node.label + ", " + node.type });
    const accent = graphTypeAccent(node.type);
    group.style.setProperty("--node-accent", accent);
    if (node.id === selectedNodeId) group.classList.add("selected");
    if (!visible.has(node.id)) group.classList.add("filtered");
    if (searchTerm && !matches.has(node.id)) group.classList.add("dimmed");
    if (selectedNodeId && !trace.nodes.has(node.id)) group.classList.add("dimmed");
    if (focusedType && node.type !== focusedType) group.classList.add("focus-dimmed");
    if (matches.has(node.id) && searchTerm) group.classList.add("search-hit");
    if (animateStructure && animationAllowed) group.classList.add("entering");
    if (node.junction) {
      group.append(svgElement("circle", { class: "card-bg junction-bg", cx: size.width / 2, cy: size.height / 2, r: 14 }));
      const inputPort = svgElement("circle", { class: "card-port port-input", cx: 1, cy: size.height / 2, r: 5, "data-node-id": node.id, "aria-hidden": "true", tabindex: -1 });
      const outputPort = svgElement("circle", { class: "card-port port-output", cx: size.width - 1, cy: size.height / 2, r: 5, "data-node-id": node.id, "aria-hidden": "true", tabindex: -1 });
      outputPort.addEventListener("pointerdown", (event) => startPortDrag(event, node.id));
      group.append(inputPort, outputPort);
      group.append(svgElement("circle", { class: "junction-core", cx: size.width / 2, cy: size.height / 2, r: 3 }));
      const junctionTitle = svgElement("title");
      junctionTitle.textContent = "Branch junction: " + node.label;
      group.append(junctionTitle);
    } else {
      const bg = svgElement("rect", { class: "card-bg", width: size.width, height: size.height, rx: 18 });
      group.append(bg);
      const inputPort = svgElement("circle", { class: "card-port port-input", cx: 1, cy: size.height / 2, r: 5, "data-node-id": node.id, "aria-hidden": "true", tabindex: -1 });
      const outputPort = svgElement("circle", { class: "card-port port-output", cx: size.width - 1, cy: size.height / 2, r: 5, "data-node-id": node.id, "aria-hidden": "true", tabindex: -1 });
      outputPort.addEventListener("pointerdown", (event) => startPortDrag(event, node.id));
      inputPort.addEventListener("pointerenter", () => { if (dragState?.kind === "connection") updatePortPreview(dragState.lastEvent); });
      group.append(inputPort, outputPort);
      cardText(group, node.type.toUpperCase(), 14, 21, "card-type", 24);
      group.append(svgElement("circle", { class: "card-icon-bg", cx: size.width - 16, cy: 15, r: 7 }));
      group.append(svgElement("path", { class: "card-icon-glyph", d: "M 186 12.5 L 190 15 L 186 17.5 M 186.5 12.5 L 184.5 12.5 M 186.5 17.5 L 184.5 17.5" }));
      group.append(svgElement("circle", { class: "card-icon-node", cx: 184, cy: 12.5, r: 1.2 }));
      group.append(svgElement("circle", { class: "card-icon-node", cx: 191, cy: 15, r: 1.2 }));
      group.append(svgElement("circle", { class: "card-icon-node", cx: 184, cy: 17.5, r: 1.2 }));
      cardText(group, node.label, 14, 45, "card-title", 25);
      cardText(group, node.description || node.source || "No description provided", 14, 66, "card-desc", 34);
      if (node.chart) {
        const chartTitle = svgElement("text", { class: "card-chart-title", x: 14, y: 80 });
        chartTitle.textContent = truncate(node.chart.label, 28);
        group.append(chartTitle);
        const presentation = chartPresentation(node.chart);
        const chartLabel = chartDescription(node.chart);
        const plot = chartGeometry(node.chart.values, { width: size.width - 30, height: 43, padding: 4, kind: presentation.kind });
        const chart = svgElement("svg", { class: "card-chart-svg", x: 14, y: 84, width: size.width - 30, height: 43, viewBox: "0 0 " + plot.width + " " + plot.height, role: "img", "aria-label": chartLabel });
        const chartTitleNode = svgElement("title");
        chartTitleNode.textContent = chartLabel;
        chart.append(chartTitleNode);
        chart.append(svgElement("path", { class: "card-chart-baseline", d: "M 0 " + plot.baselineY + " H " + plot.width }));
        if (presentation.kind === "bar") {
          for (const bar of plot.bars) {
            const rectangle = svgElement("rect", { class: "card-chart-bar", x: bar.x, y: bar.y, width: bar.width, height: bar.height, rx: 1.5 });
            const barTitle = svgElement("title");
            barTitle.textContent = chartValueLabel(node.chart, bar.index);
            rectangle.append(barTitle);
            chart.append(rectangle);
          }
        } else {
          if (presentation.kind === "area") chart.append(svgElement("path", { class: "card-chart-area", d: plot.areaPath }));
          chart.append(svgElement("path", { class: "card-chart-line", d: plot.linePath }));
          for (const point of plot.points) {
            const marker = svgElement("circle", { class: "card-chart-marker", cx: point.x, cy: point.y, r: 2.4, tabindex: 0, "aria-label": chartValueLabel(node.chart, point.index) });
            const markerTitle = svgElement("title");
            markerTitle.textContent = chartValueLabel(node.chart, point.index);
            marker.append(markerTitle);
            chart.append(marker);
          }
        }
        group.append(chart);
        const showCategoryStrip = node.chart.categories?.length === node.chart.values.length && node.chart.values.length <= 5;
        if (showCategoryStrip) {
          const slotWidth = plot.width / node.chart.values.length;
          node.chart.categories.forEach((category, categoryIndex) => {
            const categoryText = svgElement("text", { class: "card-chart-category", x: 14 + (categoryIndex + .5) * slotWidth, y: 139, "text-anchor": "middle" });
            categoryText.textContent = chartCompactReadout(node.chart, categoryIndex, slotWidth);
            const categoryTitle = svgElement("title");
            categoryTitle.textContent = chartValueLabel(node.chart, categoryIndex);
            categoryText.append(categoryTitle);
            group.append(categoryText);
          });
        }
        const contextY = showCategoryStrip ? 154 : 136;
        const evidenceY = showCategoryStrip ? 169 : 148;
        const context = svgElement("text", { class: "card-chart-context", x: 14, y: contextY });
        context.textContent = truncate(presentation.context, 31);
        const contextTitle = svgElement("title");
        contextTitle.textContent = presentation.context;
        context.append(contextTitle);
        group.append(context);
        const evidence = svgElement("text", { class: "card-chart-evidence", x: 14, y: evidenceY });
        evidence.textContent = truncate("Evidence: " + node.chart.evidence, 36);
        const evidenceTitle = svgElement("title");
        evidenceTitle.textContent = node.chart.evidence;
        evidence.append(evidenceTitle);
        group.append(evidence);
        if (node.source) cardText(group, node.source, 14, showCategoryStrip ? 187 : 167, "card-source", 31);
      } else {
        cardText(group, node.source, 14, 90, "card-source", 31);
      }
    }
    if (node.type.toLowerCase() === "agent" && animationAllowed) {
      const agentBeam = svgElement("rect", { class: "agent-beam", x: 1, y: 1, width: size.width - 2, height: size.height - 2, rx: 18, fill: "none", stroke: accent, "stroke-width": 1.2, "stroke-dasharray": "22 78", "pathLength": 100, opacity: animationAllowed ? 0 : .18, "pointer-events": "none" });
      agentBeam.style.stroke = accent;
      if (animationAllowed) {
        const beamDelay = (.7 + Math.random() * 4).toFixed(2) + "s";
        agentBeam.append(
          svgElement("animate", { attributeName: "opacity", from: 0, to: .2, dur: "0.5s", begin: beamDelay, fill: "freeze" }),
          svgElement("animate", { attributeName: "stroke-dashoffset", from: 0, to: -100, dur: "6s", begin: beamDelay, repeatCount: "indefinite" }),
        );
      }
      group.append(agentBeam);
    }    group.addEventListener("click", () => {
      selectedEdgeId = null;
      touchSelectedEdge = null;
      hideGraphContextMenu();
      selectedNodeId = selectedNodeId === node.id ? null : node.id;
      renderInspector();
      refreshTraceStyles();
    });
    group.addEventListener("animationend", (event) => {
      if (event.animationName === "atlas-card-in") group.classList.remove("entering");
    });
    group.addEventListener("dblclick", (event) => { event.stopPropagation(); openNodeEditor(node.id); });
    group.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showNodeContextMenu(node.id, event.clientX, event.clientY, group);
    });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        touchSelectedEdge = null;
        selectedNodeId = selectedNodeId === node.id ? null : node.id;
        renderInspector();
        refreshTraceStyles();
      } else if (event.key === "F2") openNodeEditor(node.id);
      else if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
        event.preventDefault();
        const rect = group.getBoundingClientRect();
        showNodeContextMenu(node.id, rect.left + rect.width / 2, rect.top + rect.height / 2, group);
      }
    });
    group.addEventListener("pointerdown", (event) => beginNodeDrag(event, node.id));
    nodeLayer.append(group);
    nodeCards.set(node.id, group);
  }
  const drawMotion = animateStructure && animationAllowed;
  const minX = graph.nodes.length ? Math.min(...[...positions.values()].map((point) => point.x)) : 0;
  const maxX = graph.nodes.length ? Math.max(...[...positions.values()].map((point) => point.x)) : 1;
  graph.edges.forEach((edge, index) => {
    const geometry = edgeGeometry(edge, index, positions, dimensions, routingLanes.get(index));
    if (!geometry) return;
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    const sourceAccent = graphTypeAccent(sourceNode?.type || "component");
    const fullLabel = geometry.fullLabel || geometry.label;
    const hasLabel = Boolean(String(edge.label || edge.type || "").trim());
    const group = svgElement("g", { class: "edge-group", "data-edge-index": index, "data-edge-id": edge.id, "data-source-type": sourceNode?.type || "component", tabindex: 0, role: "button", "aria-pressed": String(selectedEdgeId === edge.id), "aria-label": (sourceNode?.label || edge.source) + " to " + (targetNode?.label || edge.target) + (hasLabel ? ": " + fullLabel : ", unlabeled connection") });
    if (selectedEdgeId === edge.id) group.classList.add("selected");
    if (!visible.has(edge.source) || !visible.has(edge.target)) group.classList.add("filtered");
    if (selectedNodeId && !trace.edges.has(index)) group.classList.add("dimmed");
    const focused = !focusedType || sourceNode?.type === focusedType || targetNode?.type === focusedType;
    if (focusedType && !focused) group.classList.add("focus-dimmed");
    const connected = Boolean(selectedNodeId && trace.edges.has(index));
    if (connected) group.classList.add("trace-label");
    const path = svgElement("path", { class: "edge-path", d: geometry.path });
    if (connected) path.classList.add("connected");
    const arrow = svgElement("path", { class: "edge-arrow", d: geometry.arrowPath });
    if (connected) arrow.classList.add("connected");
    const explicitLabel = Boolean(String(edge.label || "").trim());
    const hasTypeLabel = !explicitLabel && Boolean(edge.type);
    const labelBg = hasLabel ? svgElement("rect", { class: "edge-label-bg" + (hasTypeLabel ? " type-only-label" : ""), x: geometry.labelX - geometry.labelWidth / 2, y: geometry.labelY - 10, width: geometry.labelWidth, height: 17, rx: 8 }) : null;
    const label = hasLabel ? svgElement("text", { class: "edge-label" + (hasTypeLabel ? " type-only-label" : ""), x: geometry.labelX, y: geometry.labelY + 2 }) : null;
    if (label) label.textContent = geometry.label;
    const relationTitle = svgElement("title");
    relationTitle.textContent = hasLabel ? fullLabel : "Unlabeled connection from " + (sourceNode?.label || edge.source) + " to " + (targetNode?.label || edge.target);
    const hitTarget = svgElement("path", { class: "edge-hit-target", d: geometry.path });
    group.append(relationTitle, hitTarget, path, arrow);
    if (labelBg && label) group.append(labelBg, label);
    path.addEventListener("animationend", (event) => {
      if (event.animationName === "atlas-edge-draw") clearEdgeEntranceState({ path });
    });
    arrow.addEventListener("animationend", (event) => {
      if (event.animationName === "atlas-arrow-in") clearEdgeEntranceState({ arrow });
    });
    group.addEventListener("animationend", (event) => {
      if (event.animationName === "atlas-label-in") clearEdgeEntranceState({ group });
    });
    let edgePointerActivation = null;
    group.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      edgePointerActivation = { pointerId: event.pointerId, pointerType: event.pointerType };
    });
    group.addEventListener("pointercancel", (event) => {
      if (edgePointerActivation?.pointerId === event.pointerId) edgePointerActivation = null;
    });
    group.addEventListener("click", (event) => {
      const pointerDownType = edgePointerActivation?.pointerType || "";
      edgePointerActivation = null;
      const touchActivation = isTouchClick(event, pointerDownType);
      selectedNodeId = null;
      selectedEdgeId = selectedEdgeId === edge.id ? null : edge.id;
      touchSelectedEdge = selectedEdgeId === edge.id && touchActivation ? { id: edge.id, projectId: activeId, graphRef: activeProject()?.graph } : null;
      renderInspector();
      refreshEdgeSelection();
    });
    group.addEventListener("dblclick", (event) => { event.stopPropagation(); openEdgeEditor(edge.id); });
    group.addEventListener("contextmenu", (event) => { event.preventDefault(); event.stopPropagation(); showEdgeContextMenu(edge.id, event.clientX, event.clientY); });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectedNodeId = null; selectedEdgeId = selectedEdgeId === edge.id ? null : edge.id; touchSelectedEdge = null; renderInspector(); refreshEdgeSelection(); }
      else if (event.key === "F2") openEdgeEditor(edge.id);
      else if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) { event.preventDefault(); showEdgeContextMenu(edge.id, event.clientX || null, event.clientY || null); }
    });
    edgeLayer.append(group);
    const sourceX = positions.get(edge.source).x;
    const delay = maxX === minX ? 0 : clamp((sourceX - minX) / Math.max(1, maxX - minX) * 1.3, 0, 1.3);
    if (drawMotion && !connected) {
      group.style.setProperty("--draw-delay", delay.toFixed(2) + "s");
      if (hasLabel && !hasTypeLabel) group.classList.add("label-delayed");
      try {
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
        path.classList.add("draw-in");
        arrow.classList.add("show-after");
      } catch {}
    }
    if (animationAllowed && visible.has(edge.source) && visible.has(edge.target)) {
      let pathLength = 0;
      try {
        pathLength = path.getTotalLength();
      } catch {
        pathLength = geometry.points.slice(1).reduce((sum, point, pointIndex) => {
          const previous = geometry.points[pointIndex];
          return sum + Math.hypot(point.x - previous.x, point.y - previous.y);
        }, 0);
      }
      const travelDuration = clamp(pathLength / 250, 1.6, 5);
      const cycleDuration = travelDuration + 30 + Math.random() * 25;
      const travelFraction = travelDuration / cycleDuration;
      const fadeOutFraction = Math.min(.999, travelFraction + .25 / cycleDuration);
      const begin = delay + .7 + (index % 5) * .18;
      const gradientId = "edge-beam-gradient-" + index;
      const gradient = svgElement("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "0%" });
      gradient.append(
        svgElement("stop", { offset: "0%", "stop-color": sourceAccent, "stop-opacity": 0 }),
        svgElement("stop", { offset: "100%", "stop-color": sourceAccent, "stop-opacity": .95 }),
      );
      definitions.append(gradient);
      const beam = svgElement("rect", { class: "edge-beam", x: -10, y: -1.5, width: 20, height: 3, rx: 1.5, opacity: 0 });
      beam.style.fill = "url(#" + gradientId + ")";
      const animate = svgElement("animateMotion", {
        dur: cycleDuration.toFixed(2) + "s", begin: begin.toFixed(2) + "s", repeatCount: "indefinite", path: geometry.path, rotate: "auto",
        keyPoints: "0;1;1", keyTimes: "0;" + travelFraction.toFixed(5) + ";1", keySplines: "0.42 0 0.58 1;0 0 1 1", calcMode: "spline",
      });
      const opacity = svgElement("animate", {
        attributeName: "opacity", values: "0;1;1;0;0",
        keyTimes: "0;" + (.25 / cycleDuration).toFixed(5) + ";" + travelFraction.toFixed(5) + ";" + fadeOutFraction.toFixed(5) + ";1",
        dur: cycleDuration.toFixed(2) + "s", begin: begin.toFixed(2) + "s", repeatCount: "indefinite",
      });
      beam.append(animate, opacity);
      group.insertBefore(beam, labelBg);
      const targetCard = nodeCards.get(edge.target);
      if (targetCard) {
        const targetSize = dimensions.get(edge.target);
        const arrival = targetNode?.junction
          ? svgElement("circle", { class: "card-arrival junction-arrival", cx: targetSize.width / 2, cy: targetSize.height / 2, r: 16, fill: "none", stroke: sourceAccent, "stroke-width": 1.5, opacity: 0, "pointer-events": "none" })
          : svgElement("rect", { class: "card-arrival", x: 1, y: 1, width: targetSize.width - 2, height: targetSize.height - 2, rx: 18, fill: "none", stroke: sourceAccent, "stroke-width": 1.5, opacity: 0, "pointer-events": "none" });
        arrival.append(svgElement("animate", {
          attributeName: "opacity", values: "0;0.55;0.55;0;0",
          keyTimes: "0;0.001;" + (.6 / cycleDuration).toFixed(5) + ";" + (1.1 / cycleDuration).toFixed(5) + ";1",
          dur: cycleDuration.toFixed(2) + "s", begin: (begin + travelDuration).toFixed(2) + "s", repeatCount: "indefinite",
        }));
        targetCard.append(arrival);
      }
    }
  });
  animateStructure = false;
  setViewportTransform();
  if (resumeSvgTimeline) { try { svgTimeline.unpauseAnimations(); } catch {} }
  if (viewMode === "timeline") renderTimelineView();
}
function inspectorEdgeContext(edge) {
  const project = activeProject();
  if (!project) return null;
  const positions = layoutGraph(project.graph).positions;
  const source = positions.get(edge.source) || { x: 0, y: 0 };
  const target = positions.get(edge.target) || source;
  return {
    projectId: project.id,
    graphRef: project.graph,
    edgeId: edge.id,
    edgeSnapshot: { ...edge },
    position: { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 },
  };
}
function renderTouchEdgeInspector(edge, container) {
  const graph = currentGraph();
  const source = graph.nodes.find((node) => node.id === edge.source);
  const target = graph.nodes.find((node) => node.id === edge.target);
  const type = plain("span", "detail-type");
  const dot = plain("span", "type-dot");
  dot.style.background = typeColor(edge.type || "Connection");
  type.append(dot, document.createTextNode(edge.type || "Connection"));
  const body = plain("div", "inspector-body");
  body.append(type, plain("h3", "detail-title", edge.label || edge.type || "Unlabeled connection"));
  body.append(plain("p", "detail-description", "From " + (source?.label || edge.source) + " to " + (target?.label || edge.target)));
  if (edge.type && edge.label) body.append(plain("p", "detail-description", "Kind: " + edge.type));

  const actions = plain("div", "inspector-actions edge-inspector-actions");
  actions.setAttribute("role", "group");
  actions.setAttribute("aria-label", "Connection actions");
  const context = inspectorEdgeContext(edge);
  const makeAction = (label, ariaLabel, title, activate, className = "") => {
    const button = plain("button", className, label);
    button.type = "button";
    button.setAttribute("aria-label", ariaLabel);
    button.title = title;
    button.addEventListener("click", (event) => activate(event.currentTarget));
    actions.append(button);
  };
  makeAction("Edit", "Edit connection", "Edit connection", (returnFocus) => openEdgeEditor(edge.id, null, { returnFocus }));
  makeAction("Source", "Reconnect source component", "Reconnect source", (returnFocus) => openEdgeEditor(edge.id, null, { focusField: "edge-source", returnFocus }));
  makeAction("Target", "Reconnect target component", "Reconnect target", (returnFocus) => openEdgeEditor(edge.id, null, { focusField: "edge-target", returnFocus }));
  makeAction("Branch", "Branch from connection", "Branch from connection", (returnFocus) => openBranchEditor(context, { returnFocus }));
  const remove = plain("button", "delete-action");
  remove.append(uiIcon("trash"));
  remove.type = "button";
  remove.setAttribute("aria-label", "Delete connection");
  remove.title = "Delete connection";
  remove.addEventListener("click", (event) => confirmDeleteEdgeSnapshot(context, event.currentTarget));
  actions.append(remove);
  body.append(actions);
  container.append(body);
}
function renderInspector() {
  const container = byId("inspector-content");
  container.replaceChildren();
  const graph = currentGraph();
  const node = graph.nodes.find((item) => item.id === selectedNodeId);
  byId("add-edge").disabled = graph.nodes.length < 1;
  if (!node && isCurrentTouchEdgeSelection(touchSelectedEdge, selectedEdgeId, activeId, activeProject()?.graph)) {
    const edge = graph.edges.find((item) => item.id === selectedEdgeId);
    if (edge) {
      renderTouchEdgeInspector(edge, container);
      return;
    }
  }
  if (!node) {
    const empty = plain("div", "inspector-empty");
    const emptyIcon = plain("span", "inspector-empty-icon");
    emptyIcon.append(uiIcon(selectedEdgeId ? "connection" : "component"));
    empty.append(emptyIcon, plain("strong", "", selectedEdgeId ? "Connection selected" : "Select a component"));
    empty.append(plain("p", "", selectedEdgeId ? "Right-click the highlighted line for edit, reconnect, delete, or branch actions. Press F2 to edit its relationship." : "Choose a card on the map to trace its connections and see its details."));
    container.append(empty);
    return;
  }
  const body = plain("div", "inspector-body");
  const type = plain("span", "detail-type");
  const dot = plain("span", "type-dot");
  dot.style.background = typeColor(node.type);
  type.append(dot, document.createTextNode(node.type));
  body.append(type, plain("h3", "detail-title", node.label));
  if (node.description) body.append(plain("p", "detail-description", node.description));
  const details = node.details || {};
  for (const [title, value] of [["Purpose", details.purpose], ["How it works", details.operation]]) {
    if (!value) continue;
    const detailSection = plain("section", "detail-section node-detail-section");
    detailSection.append(plain("h3", "", title), plain("p", "detail-description", value));
    body.append(detailSection);
  }
  for (const [title, values] of [["Inputs", details.inputs], ["Outputs", details.outputs], ["Dependencies", details.dependencies], ["Repository evidence", details.evidence], ["Uncertainty", details.uncertainty]]) {
    if (!values?.length) continue;
    const detailSection = plain("section", "detail-section node-detail-section");
    detailSection.append(plain("h3", "", title));
    const list = plain("ul", "detail-list");
    for (const value of values) list.append(plain("li", "", value));
    detailSection.append(list);
    body.append(detailSection);
  }
  if (node.chart) body.append(createChartFigure(node.chart));
  if (node.source) {
    const section = plain("section", "detail-section");
    section.append(plain("h3", "", "Source"));
    section.append(plain("code", "source-pill", node.source));
    body.append(section);
  }
  if (node.group) {
    const section = plain("section", "detail-section");
    section.append(plain("h3", "", "Subsystem"));
    section.append(plain("p", "detail-description", node.group));
    body.append(section);
  }
  const relations = graph.edges.filter((edge) => edge.source === node.id || edge.target === node.id);
  const section = plain("section", "detail-section");
  section.append(plain("h3", "", "Connections (" + relations.length + ")"));
  if (!relations.length) section.append(plain("p", "detail-description", "No connections in this map yet."));
  const connectionList = plain("div", "connection-list");
  for (const edge of relations) {
    const isOutgoing = edge.source === node.id;
    const otherId = isOutgoing ? edge.target : edge.source;
    const other = graph.nodes.find((item) => item.id === otherId);
    const row = plain("article", "connection-item");
    const head = plain("div", "connection-item-head");
    head.append(plain("span", "connection-arrow", isOutgoing ? "Outgoing" : "Incoming"));
    const name = plain("button", "connection-name", other?.label || otherId);
    name.type = "button";
    name.addEventListener("click", () => { selectedNodeId = otherId; renderInspector(); renderGraph(); });
    head.append(name);
    const relationText = edge.label || edge.type || "Relationship not labeled";
    const relation = plain("button", "connection-label", relationText);
    relation.type = "button";
    relation.setAttribute("aria-label", "Edit " + (isOutgoing ? "outgoing" : "incoming") + " relationship to " + (other?.label || otherId) + ": " + relationText);
    relation.addEventListener("click", () => openEdgeEditor(edge.id));
    row.append(head, relation);
    if (edge.type && edge.label) row.append(plain("span", "connection-kind", edge.type));
    connectionList.append(row);
  }
  section.append(connectionList);
  body.append(section);
  const actions = plain("div", "inspector-actions");
  const edit = plain("button", "", "Edit");
  edit.type = "button";
  edit.addEventListener("click", () => openNodeEditor(node.id));
  const connect = plain("button", "", "Connect");
  connect.type = "button";
  connect.addEventListener("click", () => openEdgeEditor(null, node.id));
  const remove = plain("button", "delete-action");
  remove.append(uiIcon("trash"));
  remove.type = "button";
  remove.setAttribute("aria-label", "Delete component");
  remove.addEventListener("click", () => confirmNodeDelete(node.id));
  actions.append(edit, connect, remove);
  body.append(actions);
  container.append(body);
}
function renderTimelineView() {
  const host = byId("timeline-view");
  if (!host) return;
  const oldScroller = host.querySelector(".timeline-scroller");
  const oldOverview = host.querySelector(".timeline-overview");
  const activeElement = document.activeElement;
  const hadTimelineFocus = host.contains(activeElement);
  const focusNodeId = activeElement?.dataset.focusNodeId || "";
  const focusKind = activeElement?.dataset.focusKind || "";
  const focusStep = activeElement?.classList.contains("timeline-step-button") ? activeElement.textContent : "";
  const scrollLeft = oldScroller?.scrollLeft || 0;
  const scrollTop = oldScroller?.scrollTop || 0;
  const overviewScroll = oldOverview?.scrollLeft || 0;
  host.replaceChildren(renderTimeline(currentGraph(), {
    selectedNodeId,
    excludedTypes,
    searchTerm,
    focusedType,
    onSelectNode(nodeId) {
      selectedNodeId = nodeId;
      renderInspector();
      renderGraph();
    },
  }));
  const scroller = host.querySelector(".timeline-scroller");
  const overview = host.querySelector(".timeline-overview");
  if (scroller) { scroller.scrollLeft = scrollLeft; scroller.scrollTop = scrollTop; }
  if (overview) overview.scrollLeft = overviewScroll;
  if (hadTimelineFocus && focusNodeId) {
    const target = [...host.querySelectorAll("[data-focus-node-id]")].find((element) => element.dataset.focusNodeId === focusNodeId && element.dataset.focusKind === focusKind);
    target?.focus({ preventScroll: true });
  } else if (hadTimelineFocus && focusStep) {
    [...host.querySelectorAll(".timeline-step-button")].find((element) => element.textContent === focusStep)?.focus({ preventScroll: true });
  }
}
function updateViewMode() {
  const timeline = viewMode === "timeline";
  byId("graph-stage").classList.toggle("timeline-mode", timeline);
  byId("timeline-view").hidden = !timeline;
  const motionAvailable = graphMotionAllowed(currentGraph()) && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  byId("pause-motion").hidden = timeline || !motionAvailable;
  byId("show-map").setAttribute("aria-pressed", String(!timeline));
  byId("show-timeline").setAttribute("aria-pressed", String(timeline));
}
function setViewMode(mode) {
  viewMode = mode === "timeline" ? "timeline" : "graph";
  updateViewMode();
  renderGraph();
}
function updateWorkspaceActionAvailability() {
  const hasProject = Boolean(activeProject());
  for (const id of ["share-graph", "edit-project", "export-menu-button", "auto-layout", "add-node", "search", "zoom-in", "zoom-out", "fit-graph", "pause-motion", "show-timeline"]) {
    byId(id).disabled = !hasProject;
  }
  if (!hasProject) byId("export-menu").hidden = true;
}
function renderAll() {
  renderLibrary();
  updateProjectHeader();
  updateWorkspaceActionAvailability();
  renderFilters();
  updateViewMode();
  renderGraph();
  renderInspector();
  localRecoveryMode();
}

function cancelPendingShareLoad() {
  shareLoadTracker.cancel();
}
function selectProject(id) {
  cancelPendingShareLoad();
  cancelActiveGesture();
  hideGraphContextMenu();
  activeId = id;
  viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
  selectedNodeId = null;
  selectedEdgeId = null;
  searchTerm = "";
  byId("search").value = "";
  excludedTypes.clear();
  animateStructure = true;
  renderAll();
  fitGraph(true);
  persist(false);
}
function currentStageWorldPoint(clientX, clientY) {
  return screenToWorld(clientX, clientY, byId("graph-stage").getBoundingClientRect(), transform);
}
function refreshEdgeSelection() {
  document.querySelectorAll(".edge-group[data-edge-id]").forEach((group) => {
    const selected = group.dataset.edgeId === selectedEdgeId;
    group.classList.toggle("selected", selected);
    group.setAttribute("aria-pressed", String(selected));
  });
}
function clearPortTargetHighlight() {
  document.querySelectorAll(".node-card.port-drop-target").forEach((group) => group.classList.remove("port-drop-target"));
}
function clearConnectionPreview() {
  const preview = byId("connection-preview");
  if (preview) {
    preview.setAttribute("d", "");
    preview.classList.remove("valid-target");
    preview.setAttribute("hidden", "");
  }
  clearPortTargetHighlight();
}
function portInputAt(clientX, clientY) {
  const element = document.elementFromPoint?.(clientX, clientY);
  const port = element?.closest?.(".card-port.port-input");
  return port && byId("graph").contains(port) ? port : null;
}
function updatePortPreview(event) {
  if (!dragState || dragState.kind !== "connection" || !event) return;
  const project = projects.find((item) => item.id === dragState.projectId);
  const graph = project?.graph;
  if (!graph || project.id !== activeId || graph !== dragState.graph) { cancelActiveConnection(); return; }
  const source = graph.nodes.find((node) => node.id === dragState.sourceId);
  const layout = dragState.layout;
  const sourcePoint = layout.positions.get(dragState.sourceId);
  const sourceSize = layout.dimensions.get(dragState.sourceId);
  if (!source || !sourcePoint || !sourceSize) { cancelActiveConnection(); return; }
  const hitPort = portInputAt(event.clientX, event.clientY);
  const targetId = hitPort?.dataset.nodeId || "";
  const target = graph.nodes.find((node) => node.id === targetId);
  const targetPoint = target ? layout.positions.get(target.id) : null;
  const targetSize = target ? layout.dimensions.get(target.id) : null;
  const end = targetPoint && targetSize
    ? { x: targetPoint.x, y: targetPoint.y + targetSize.height / 2 }
    : currentStageWorldPoint(event.clientX, event.clientY);
  const start = { x: sourcePoint.x + sourceSize.width, y: sourcePoint.y + sourceSize.height / 2 };
  const preview = byId("connection-preview");
  preview.setAttribute("d", connectionPreviewPath(start, end));
  preview.removeAttribute("hidden");
  preview.classList.toggle("valid-target", Boolean(hitPort && target));
  clearPortTargetHighlight();
  if (hitPort && target) document.querySelectorAll(".node-card").forEach((group) => {
    if (group.dataset.nodeId === target.id) group.classList.add("port-drop-target");
  });
  dragState.targetId = target?.id || "";
  dragState.lastEvent = event;
}
function startPortDrag(event, nodeId) {
  if (event.button !== 0 || !canStartPointerGesture(dragState) || !currentGraph().nodes.some((node) => node.id === nodeId)) return;
  event.preventDefault();
  event.stopPropagation();
  stopFitAnimation();
  hideGraphContextMenu();
  const project = activeProject();
  const graph = currentGraph();
  dragState = { kind: "connection", projectId: project?.id || "", graph, sourceId: nodeId, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, targetId: "", lastEvent: event, layout: layoutGraph(graph) };
  byId("graph").classList.add("is-connecting");
  try { byId("graph").setPointerCapture(event.pointerId); } catch {}
  updatePortPreview(event);
}
function cancelActiveConnection() {
  if (dragState?.kind !== "connection") return;
  const pointerId = dragState.pointerId;
  dragState = null;
  byId("graph").classList.remove("is-connecting");
  clearConnectionPreview();
  try { byId("graph").releasePointerCapture(pointerId); } catch {}
}
function cancelActiveGesture() {
  const state = dragState;
  if (!state) return;
  dragState = null;
  byId("graph").classList.remove("is-connecting", "is-panning");
  if (state.kind === "connection") {
    clearConnectionPreview();
    clearPortTargetHighlight();
  } else if (state.kind === "node" && state.moved) {
    const node = state.graphRef?.nodes.find((item) => item.id === state.id);
    if (node) {
      if (state.originalPosition) node.position = { ...state.originalPosition };
      else delete node.position;
      const project = projects.find((item) => item.id === state.projectId);
      if (project?.id === activeId && project.graph === state.graphRef) renderGraph();
    }
  }
  try { byId("graph").releasePointerCapture(state.pointerId); } catch {}
}
function beginNodeDrag(event, nodeId) {
  if (event.button !== 0 || !canStartPointerGesture(dragState) || event.target.closest?.(".card-port")) return;
  stopFitAnimation();
  event.stopPropagation();
  const project = activeProject();
  const graph = project?.graph;
  const node = graph?.nodes.find((item) => item.id === nodeId);
  const point = layoutGraph(graph || emptyGraph()).positions.get(nodeId);
  if (!point || !project || !node) return;
  const world = currentStageWorldPoint(event.clientX, event.clientY);
  dragState = { kind: "node", id: nodeId, projectId: project.id, graphRef: graph, originalPosition: node.position ? { ...node.position } : null, baselineText: serializeGraphJson(graph), offsetX: world.x - point.x, offsetY: world.y - point.y, startX: event.clientX, startY: event.clientY, moved: false, pointerId: event.pointerId };
}
function startPan(event) {
  if (event.button !== 0 || !canStartPointerGesture(dragState) || event.target.closest?.(".node-card") || event.target.closest?.(".edge-group") || event.target.closest?.(".graph-context-menu")) return;
  stopFitAnimation();
  dragState = { kind: "pan", startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false, pointerId: event.pointerId };
  byId("graph").classList.add("is-panning");
  try { byId("graph").setPointerCapture(event.pointerId); } catch {}
}
function movePointer(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  if (dragState.kind === "connection") { updatePortPreview(event); return; }
  if (dragState.kind === "pan") {
    const dx = event.clientX - dragState.lastX;
    const dy = event.clientY - dragState.lastY;
    transform.x += dx;
    transform.y += dy;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    dragState.moved = dragState.moved || Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY) > 3;
    setViewportTransform();
    return;
  }
  const movement = Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY);
  if (!dragState.moved && movement <= 3) return;
  if (!dragState.moved) {
    dragState.moved = true;
    try { byId("graph").setPointerCapture(event.pointerId); } catch {}
  }
  const state = dragState;
  const project = projects.find((item) => item.id === state.projectId);
  const node = state.graphRef?.nodes.find((item) => item.id === state.id);
  if (!node || !project || project.id !== activeId || project.graph !== state.graphRef) return;
  const world = currentStageWorldPoint(event.clientX, event.clientY);
  node.position = {
    x: clamp(world.x - dragState.offsetX, -99999, 99999),
    y: clamp(world.y - dragState.offsetY, -99999, 99999),
  };
  dragState.moved = dragState.moved || movement > 3;
  animateStructure = false;
  renderGraph();
}
function endPointer(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  if (dragState.kind === "connection") {
    const state = dragState;
    const targetPort = portInputAt(event.clientX, event.clientY);
    const project = projects.find((item) => item.id === state.projectId);
    const targetId = targetPort?.dataset.nodeId || "";
    dragState = null;
    byId("graph").classList.remove("is-connecting");
    clearConnectionPreview();
    if (event.type === "pointerup" && project && project.id === activeId && project.graph === state.graph
      && project.graph.nodes.some((node) => node.id === state.sourceId)
      && project.graph.nodes.some((node) => node.id === targetId)) {
      openEdgeEditor(null, state.sourceId, { targetId, focusField: "edge-label" });
    }
    return;
  }
  const state = dragState;
  const didMove = state.moved;
  const wasNode = state.kind === "node";
  const wasPan = state.kind === "pan";
  dragState = null;
  byId("graph").classList.remove("is-panning");
  if (wasPan && !didMove && (selectedNodeId || selectedEdgeId)) {
    selectedNodeId = null;
    selectedEdgeId = null;
    renderInspector();
    refreshTraceStyles();
    refreshEdgeSelection();
  }
  if (wasNode && didMove) {
    const project = projects.find((item) => item.id === state.projectId);
    const node = state.graphRef?.nodes.find((item) => item.id === state.id);
    if (!node || !project || project.id !== activeId || project.graph !== state.graphRef) return;
    const restorePosition = () => {
      if (state.originalPosition) node.position = { ...state.originalPosition };
      else delete node.position;
      renderGraph();
    };
    if (event.type !== "pointerup") { restorePosition(); return; }
    try { assertGraphJsonWithinLimit(project.graph, { baselineText: state.baselineText }); }
    catch (error) {
      restorePosition();
      showToast(error instanceof Error ? error.message : "That position would make this map too large to export and re-import.", "error");
      return;
    }
    project.updatedAt = Date.now();
    renderLibrary();
    persist();
  }
}
function autoLayout() {
  const project = activeProject();
  if (!project) return;
  for (const node of project.graph.nodes) delete node.position;
  animateStructure = true;
  renderGraph();
  renderInspector();
  fitGraph(true);
  persist();
}
function openProjectEditor() {
  const project = activeProject();
  if (!project) { showToast("Create or import a project before editing its details.", "error"); return; }
  projectEditContext = { projectId: project.id, graphRef: project.graph };
  projectEditResumeShareLoad = shareLoadTracker.interruptPending();
  byId("project-name-input").value = project.graph.project.name || "";
  byId("project-description-input").value = project.graph.project.description || "";
  byId("project-type-input").value = project.graph.project.type || "";
  byId("project-error").hidden = true;
  byId("delete-project").hidden = false;
  byId("project-modal-title").textContent = "Project details";
  byId("project-modal").showModal();
}
function saveProjectDetails() {
  const context = projectEditContext;
  const project = context && projects.find((item) => item.id === context.projectId);
  const name = byId("project-name-input").value.trim();
  if (!project || project.id !== activeId || project.graph !== context.graphRef) {
    byId("project-error").textContent = "The map changed while this form was open. Reopen project details before saving.";
    byId("project-error").hidden = false;
    return;
  }
  if (!name) {
    byId("project-error").textContent = "Project name is required.";
    byId("project-error").hidden = false;
    return;
  }
  let candidate;
  try {
    candidate = normalizeEditableGraph({
      ...project.graph,
      project: {
        name,
        description: byId("project-description-input").value.trim(),
        type: byId("project-type-input").value.trim() || "Software project",
      },
    }, { baselineGraph: project.graph });
  } catch (error) {
    byId("project-error").textContent = error instanceof Error ? error.message : "The project details would make this map too large to save.";
    byId("project-error").hidden = false;
    return;
  }
  project.graph = candidate;
  project.updatedAt = Date.now();
  projectEditResumeShareLoad = null;
  byId("project-modal").close();
  projectEditContext = null;
  graphChanged({ structure: false });
}
function createProject() {
  cancelPendingShareLoad();
  const graph = { schemaVersion: 1, project: { name: "Untitled project", description: "", type: "Software project" }, nodes: [], edges: [] };
  const project = makeProject(graph);
  projects.unshift(project);
  activeId = project.id;
  viewMode = "graph";
  selectedNodeId = null;
  selectedEdgeId = null;
  excludedTypes.clear();
  searchTerm = "";
  byId("search").value = "";
  animateStructure = true;
  renderAll();
  fitGraph(false);
  persist();
  byId("project-title").focus?.();
}
function openFlowExample() {
  cancelPendingShareLoad();
  const example = SAMPLE_GRAPHS.find((graph) => graph.project.name === FLOW_EXAMPLE_NAME);
  if (!example) { showToast("The request-flow example is unavailable.", "error"); return; }
  const result = addOrReuseExampleProject(projects, FLOW_EXAMPLE_ID, () =>
    makeProject(normalizeGraph(example), createProjectId(), { exampleId: FLOW_EXAMPLE_ID }),
  );
  projects = result.projects;
  const project = result.project;
  const added = result.added;
  activeId = project.id;
  viewMode = "timeline";
  selectedNodeId = null;
  selectedEdgeId = null;
  excludedTypes.clear();
  searchTerm = "";
  byId("search").value = "";
  animateStructure = true;
  renderAll();
  fitGraph(false);
  const saved = persist();
  if (added && saved) showToast("Added the request-flow example as a separate saved project. Your existing maps are unchanged.");
}
function confirmProjectDelete() {
  const project = activeProject();
  if (!project) return;
  const context = { projectId: project.id, projectRef: project, graphRef: project.graph };
  const name = project.graph.project.name || "this project";
  const resumeShareLoad = projectEditResumeShareLoad;
  projectEditResumeShareLoad = null;
  byId("project-modal").close();
  openConfirm("Delete this project?", "This removes " + name + " and its map from this browser's Project Atlas library.", "Delete project", () => {
    const deletion = removeProjectSnapshot(projects, context, activeId);
    if (!deletion) {
      showToast("This project changed before deletion. No project was removed.", "error");
      return;
    }
    if (shouldClearShareFragmentForDeletedProject(deletion.project, location.hash)) {
      try {
        history.replaceState(history.state, "", location.pathname + location.search);
      } catch {
        showToast("The shared map link could not be cleared, so the project was kept. Try again.", "error");
        return;
      }
      cancelPendingShareLoad();
    }
    projects = deletion.projects;
    activeId = deletion.activeId;
    if (deletion.wasActive) {
      viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
      selectedNodeId = null;
      selectedEdgeId = null;
      excludedTypes.clear();
      searchTerm = "";
      byId("search").value = "";
      animateStructure = true;
    }
    renderAll();
    if (deletion.wasActive) fitGraph(true);
    persist();
  }, null, resumeShareLoad);
}
function nodeCardElement(nodeId) {
  return [...byId("nodes-layer").querySelectorAll(".node-card")].find((item) => item.dataset.nodeId === nodeId) || null;
}
function confirmDeleteNodeSnapshot(context, returnFocus = null) {
  const project = context && projects.find((item) => item.id === context.projectId);
  const node = project?.graph.nodes.find((item) => item.id === context.nodeId);
  const focusElement = returnFocus?.element || returnFocus || nodeCardElement(context?.nodeId);
  const focusTarget = { element: focusElement, fallbackGraph: true };
  if (!project || project.id !== activeId || !nodeContextIsCurrent(project, node, context)) {
    focusGraphTarget(focusTarget);
    showToast("That component changed before it could be deleted. Reopen its context menu and try again.", "error");
    return;
  }
  openConfirm("Delete this component?", "Delete " + node.label + " and its attached connections from this map?", "Delete component", () => {
    const currentProject = projects.find((item) => item.id === context.projectId);
    const currentNode = currentProject?.graph.nodes.find((item) => item.id === context.nodeId);
    if (!currentProject || currentProject.id !== activeId || !nodeContextIsCurrent(currentProject, currentNode, context)) {
      showToast("That component changed before it could be deleted. No map data was changed.", "error");
      return;
    }
    const removedEdgeIds = new Set(currentProject.graph.edges
      .filter((edge) => edge.source === context.nodeId || edge.target === context.nodeId)
      .map((edge) => edge.id));
    currentProject.graph.nodes = currentProject.graph.nodes.filter((item) => item.id !== context.nodeId);
    currentProject.graph.edges = currentProject.graph.edges.filter((edge) => !removedEdgeIds.has(edge.id));
    if (selectedNodeId === context.nodeId) selectedNodeId = null;
    if (selectedEdgeId && removedEdgeIds.has(selectedEdgeId)) selectedEdgeId = null;
    currentProject.updatedAt = Date.now();
    animateStructure = true;
    renderAll();
    fitGraph(true);
    persist();
  }, focusTarget);
}
function confirmNodeDelete(nodeId) {
  const editorContext = nodeEditContext?.nodeId === nodeId ? nodeEditContext : null;
  const project = editorContext
    ? projects.find((item) => item.id === editorContext.projectId)
    : activeProject();
  const node = project?.graph.nodes.find((item) => item.id === nodeId);
  if (!project || project.id !== activeId || !node) {
    showToast("That component no longer exists in this map.", "error");
    return;
  }
  const context = editorContext || {
    projectId: project.id,
    graphRef: project.graph,
    nodeId: node.id,
    nodeSnapshot: JSON.stringify(node),
  };
  if (!nodeContextIsCurrent(project, node, context)) {
    showToast("That component changed while the editor was open. Reopen it before deleting.", "error");
    return;
  }
  const returnFocus = { element: nodeCardElement(node.id), fallbackGraph: true };
  if (byId("editor-modal").open) {
    dialogFocusTargets.delete("editor-modal");
    byId("editor-modal").close();
    nodeEditContext = null;
  }
  confirmDeleteNodeSnapshot(context, returnFocus);
}
function openNodeEditor(nodeId = null, { position = null, projectId = null, returnFocus = null, expectedNodeContext = null } = {}) {
  cancelPendingShareLoad();
  const ownerProjectId = projectId || activeId;
  const project = projects.find((item) => item.id === ownerProjectId);
  if (!project || project.id !== activeId) { showToast("Select a project before adding a component.", "error"); return; }
  const node = nodeId ? project.graph.nodes.find((item) => item.id === nodeId) : null;
  if (nodeId && !node) { showToast("That component no longer exists in this map.", "error"); return; }
  if (expectedNodeContext && !nodeContextIsCurrent(project, node, expectedNodeContext)) {
    focusGraphTarget({ element: returnFocus, fallbackGraph: true });
    showToast("That component changed. Reopen its context menu and try again.", "error");
    return;
  }
  editingNodeId = node?.id || null;
  nodeEditContext = { projectId: project.id, graphRef: project.graph, nodeId: node?.id || null, nodeSnapshot: node ? JSON.stringify(node) : null, position: !node && position ? { ...position } : null };
  byId("editor-title").textContent = node ? "Edit component" : "Add component";
  byId("editor-kicker").textContent = node ? node.type.toUpperCase() : "COMPONENT";
  byId("editor-subtitle").textContent = node ? "Update its purpose, category, or source path." : nodeEditContext.position ? "This component will be placed at the chosen canvas point when saved." : "Give this part of the system a name and a purpose.";
  byId("node-label").value = node?.label || "";
  byId("node-type").value = node?.type || "Service";
  byId("node-type").disabled = Boolean(node?.junction);
  byId("node-description").value = node?.description || "";
  byId("node-source").value = node?.source || "";
  byId("node-purpose").value = node?.details?.purpose || "";
  byId("node-operation").value = node?.details?.operation || "";
  byId("node-inputs").value = (node?.details?.inputs || []).join("\n");
  byId("node-outputs").value = (node?.details?.outputs || []).join("\n");
  byId("node-dependencies").value = (node?.details?.dependencies || []).join("\n");
  byId("node-evidence").value = (node?.details?.evidence || []).join("\n");
  byId("node-uncertainty").value = (node?.details?.uncertainty || []).join("\n");
  byId("editor-error").hidden = true;
  byId("delete-node").hidden = !node;
  setDialogFocusTarget("editor-modal", returnFocus ? { element: returnFocus, fallbackGraph: true } : { nodeId: node?.id || null, fallbackGraph: true });
  byId("editor-modal").showModal();
  if (!node) byId("node-label").focus();
}
function saveNode() {
  const context = nodeEditContext;
  const project = context && projects.find((item) => item.id === context.projectId);
  if (!context || !project || project.id !== activeId || project.graph !== context.graphRef) {
    byId("editor-error").textContent = "The map changed while this form was open. Reopen the editor before saving.";
    byId("editor-error").hidden = false;
    return;
  }
  const label = byId("node-label").value.trim();
  const type = byId("node-type").value.trim();
  if (!label || !type) {
    byId("editor-error").textContent = "Component name and type are required.";
    byId("editor-error").hidden = false;
    return;
  }
  const graph = project.graph;
  const existing = context.nodeId ? graph.nodes.find((node) => node.id === context.nodeId) : null;
  if (context.nodeId && !existing) {
    byId("editor-error").textContent = "This component was removed while the form was open. Reopen the editor before saving.";
    byId("editor-error").hidden = false;
    return;
  }
  if (existing && context.nodeSnapshot && !nodeContextIsCurrent(project, existing, context)) {
    byId("editor-error").textContent = "This component changed while the form was open. Reopen the editor before saving.";
    byId("editor-error").hidden = false;
    return;
  }
  if (!existing && graph.nodes.length >= LIMITS.nodes) {
    byId("editor-error").textContent = "Maps support up to " + LIMITS.nodes + " components.";
    byId("editor-error").hidden = false;
    return;
  }
  const detailList = (id) => byId(id).value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const detailFields = { purpose: byId("node-purpose").value.trim(), operation: byId("node-operation").value.trim(), inputs: detailList("node-inputs"), outputs: detailList("node-outputs"), dependencies: detailList("node-dependencies"), evidence: detailList("node-evidence"), uncertainty: detailList("node-uncertainty") };
  const invalidDetail = Object.entries(detailFields).find(([key, value]) => Array.isArray(value) ? value.length > LIMITS.detailItems || value.some((item) => item.length > LIMITS.detailText) : value.length > (key === "purpose" ? 500 : 1000));
  if (invalidDetail) {
    byId("editor-error").textContent = "Keep each detail field within its character and item limits (8 list items, 240 characters each).";
    byId("editor-error").hidden = false;
    return;
  }
  const hasDetails = detailFields.purpose || detailFields.operation || Object.values(detailFields).some((value) => Array.isArray(value) && value.length);
  const node = {
    ...(existing || {}),
    id: existing?.id || newNodeId(graph.nodes),
    label, type,
    description: byId("node-description").value.trim(),
    source: byId("node-source").value.trim(),
    group: existing?.group || "",
  };
  if (hasDetails) node.details = detailFields;
  else delete node.details;
  if (existing) node.position = existing.position;
  else if (context.position) node.position = { x: clamp(context.position.x, -99999, 99999), y: clamp(context.position.y, -99999, 99999) };
  const nextNodes = existing ? graph.nodes.map((item) => item.id === existing.id ? node : item) : [...graph.nodes, node];
  let candidate;
  try { candidate = normalizeEditableGraph({ ...graph, nodes: nextNodes }, { baselineGraph: graph }); }
  catch (error) {
    byId("editor-error").textContent = error instanceof Error ? error.message : "This edit would make the map too large to save.";
    byId("editor-error").hidden = false;
    return;
  }
  project.graph = candidate;
  const savedNode = candidate.nodes.find((item) => item.id === node.id);
  project.updatedAt = Date.now();
  selectedNodeId = savedNode.id;
  selectedEdgeId = null;
  setDialogFocusTarget("editor-modal", { nodeId: savedNode.id, fallbackGraph: true });
  byId("editor-modal").close();
  nodeEditContext = null;
  animateStructure = true;
  renderAll();
  fitGraph(true);
  persist();
}
function setDialogFocusTarget(dialogId, target) {
  dialogFocusTargets.set(dialogId, target || { fallbackGraph: true });
}
function focusGraphTarget(target) {
  if (!target) return;
  requestAnimationFrame(() => {
    let element = target.element?.isConnected ? target.element : null;
    if (!element && target.nodeId) element = [...byId("nodes-layer").querySelectorAll(".node-card")].find((item) => item.dataset.nodeId === target.nodeId) || null;
    if (!element && target.edgeId) element = [...byId("edges-layer").querySelectorAll(".edge-group")].find((item) => item.dataset.edgeId === target.edgeId) || null;
    if (!element && target.fallbackGraph !== false) element = byId("graph");
    if (element?.isConnected) element.focus?.({ preventScroll: true });
  });
}
function restoreDialogFocus(dialogId) {
  const target = dialogFocusTargets.get(dialogId);
  dialogFocusTargets.delete(dialogId);
  focusGraphTarget(target);
}
function hideGraphContextMenu({ restoreFocus = false } = {}) {
  const menu = byId("graph-context-menu");
  if (menu) menu.hidden = true;
  edgeMenuContext = null;
  canvasMenuContext = null;
  nodeMenuContext = null;
  if (restoreFocus && menuReturnFocus?.isConnected) menuReturnFocus.focus({ preventScroll: true });
  menuReturnFocus = null;
}
function showGraphContextMenu(kind, clientX, clientY) {
  const menu = byId("graph-context-menu");
  const stage = byId("graph-stage");
  if (!menu || !stage) return;
  menu.querySelectorAll("[data-canvas-menu]").forEach((item) => { item.hidden = kind !== "canvas"; });
  menu.querySelectorAll("[data-edge-menu]").forEach((item) => { item.hidden = kind !== "edge"; });
  menu.querySelectorAll("[data-node-menu]").forEach((item) => { item.hidden = kind !== "node"; });
  menu.hidden = false;
  const rect = stage.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const left = clamp(clientX - rect.left, 4, Math.max(4, rect.width - menuRect.width - 4));
  const top = clamp(clientY - rect.top, 4, Math.max(4, rect.height - menuRect.height - 4));
  menu.style.left = left + "px";
  menu.style.top = top + "px";
  menu.querySelector('[role="menuitem"]:not([hidden])')?.focus({ preventScroll: true });
}
function showCanvasContextMenu(event) {
  const world = currentStageWorldPoint(event.clientX, event.clientY);
  const project = activeProject();
  if (!project) return;
  edgeMenuContext = null;
  nodeMenuContext = null;
  menuReturnFocus = byId("graph");
  canvasMenuContext = { projectId: project.id, graphRef: project.graph, position: { x: clamp(world.x, -99999, 99999), y: clamp(world.y, -99999, 99999) } };
  showGraphContextMenu("canvas", event.clientX, event.clientY);
}
function showEdgeContextMenu(edgeId, clientX, clientY) {
  const project = activeProject();
  const edge = project?.graph.edges.find((item) => item.id === edgeId);
  if (!project || !edge) return;
  const group = [...byId("edges-layer").querySelectorAll(".edge-group")].find((item) => item.dataset.edgeId === edgeId);
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY) || (clientX === 0 && clientY === 0)) {
    const rect = group?.getBoundingClientRect();
    clientX = rect ? rect.left + rect.width / 2 : 0;
    clientY = rect ? rect.top + rect.height / 2 : 0;
  }
  selectedNodeId = null;
  selectedEdgeId = edge.id;
  const worldPosition = currentStageWorldPoint(clientX, clientY);
  menuReturnFocus = group || document.activeElement;
  edgeMenuContext = { projectId: project.id, graphRef: project.graph, edgeId: edge.id, edgeSnapshot: { ...edge }, position: { x: clamp(worldPosition.x, -99999, 99999), y: clamp(worldPosition.y, -99999, 99999) } };
  canvasMenuContext = null;
  nodeMenuContext = null;
  renderInspector();
  refreshEdgeSelection();
  group?.focus({ preventScroll: true });
  showGraphContextMenu("edge", clientX, clientY);
}
function showNodeContextMenu(nodeId, clientX, clientY, nodeElement = null) {
  const project = activeProject();
  const node = project?.graph.nodes.find((item) => item.id === nodeId);
  if (!project || !node) return;
  edgeMenuContext = null;
  canvasMenuContext = null;
  const group = nodeElement || [...byId("nodes-layer").querySelectorAll(".node-card")].find((item) => item.dataset.nodeId === node.id);
  menuReturnFocus = group || document.activeElement;
  nodeMenuContext = {
    projectId: project.id,
    graphRef: project.graph,
    nodeId: node.id,
    nodeSnapshot: JSON.stringify(node),
  };
  showGraphContextMenu("node", clientX, clientY);
}
function focusableElementsOutsideGraphMenu() {
  return [...document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.closest("#graph-context-menu")
      && !element.closest("[hidden]")
      && !element.matches(":disabled")
      && element.getClientRects().length > 0
      && window.getComputedStyle(element).visibility !== "hidden"
      && (!element.closest("dialog") || element.closest("dialog").open));
}
function handleGraphMenuAction(event) {
  const button = event.target.closest?.("[data-graph-action]");
  if (!button) return;
  event.preventDefault();
  const action = button.dataset.graphAction;
  const edgeContext = edgeMenuContext;
  const canvasContext = canvasMenuContext;
  const nodeContext = nodeMenuContext;
  const returnFocus = menuReturnFocus || byId("graph");
  hideGraphContextMenu({ restoreFocus: true });

  if (action === "add-node-here" && canvasContext) {
    const project = projects.find((item) => item.id === canvasContext.projectId);
    if (!project || project.id !== activeId || project.graph !== canvasContext.graphRef) {
      focusGraphTarget({ element: returnFocus, fallbackGraph: true });
      showToast("The map changed. Reopen the canvas menu to add a component.", "error");
      return;
    }
    openNodeEditor(null, { ...canvasContext, returnFocus });
    return;
  }

  if (["edit-node", "connect-from-node", "delete-node"].includes(action) && nodeContext) {
    const project = projects.find((item) => item.id === nodeContext.projectId);
    const node = project?.graph.nodes.find((item) => item.id === nodeContext.nodeId);
    if (project?.id !== activeId || !nodeContextIsCurrent(project, node, nodeContext)) {
      focusGraphTarget({ element: returnFocus, fallbackGraph: true });
      showToast("That component changed. Reopen its context menu and try again.", "error");
      return;
    }
    if (action === "edit-node") openNodeEditor(node.id, { returnFocus, expectedNodeContext: nodeContext });
    else if (action === "connect-from-node") openEdgeEditor(null, node.id, { returnFocus, originNodeContext: nodeContext });
    else confirmDeleteNodeSnapshot(nodeContext, { element: returnFocus, fallbackGraph: true });
    return;
  }

  if (!edgeContext) return;
  const project = projects.find((item) => item.id === edgeContext.projectId);
  const edge = project?.graph.edges.find((item) => item.id === edgeContext.edgeId);
  if (!project || project.id !== activeId || project.graph !== edgeContext.graphRef || !edge || !sameEdgeSnapshot(edge, edgeContext.edgeSnapshot)) {
    focusGraphTarget({ element: returnFocus, fallbackGraph: true });
    showToast("That connection changed. Reopen its context menu and try again.", "error");
    return;
  }
  if (action === "edit-edge") openEdgeEditor(edge.id, null, { returnFocus });
  else if (action === "reconnect-source") openEdgeEditor(edge.id, null, { focusField: "edge-source", returnFocus });
  else if (action === "reconnect-target") openEdgeEditor(edge.id, null, { focusField: "edge-target", returnFocus });
  else if (action === "delete-edge") confirmDeleteEdgeSnapshot(edgeContext, returnFocus);
  else if (action === "branch-edge") openBranchEditor(edgeContext, { returnFocus });
}
function sameNodeSnapshot(node, snapshot) {
  return Boolean(node && snapshot && node.id === snapshot.id && node.label === snapshot.label && node.type === snapshot.type);
}
function openBranchEditor(context, { returnFocus = null } = {}) {
  const project = projects.find((item) => item.id === context?.projectId);
  const edge = project?.graph.edges.find((item) => item.id === context.edgeId);
  if (!project || project.id !== activeId || project.graph !== context.graphRef || !sameEdgeSnapshot(edge, context.edgeSnapshot)) {
    showToast("That connection changed. Reopen its context menu before branching.", "error");
    return;
  }
  const source = project.graph.nodes.find((node) => node.id === edge.source);
  const target = project.graph.nodes.find((node) => node.id === edge.target);
  const preferred = project.graph.nodes.find((node) => node.id !== edge.source && node.id !== edge.target) || target || source;
  fillNodeChoices(byId("branch-target"), preferred?.id, project.graph);
  byId("branch-junction-name").value = "Branch point";
  byId("branch-label").value = "";
  byId("branch-type").value = "";
  byId("branch-error").hidden = true;
  byId("branch-connection-summary").textContent = "The original connection from " + (source?.label || edge.source) + " continues through a new circular junction to " + (target?.label || edge.target) + ". A separate branch will connect to the chosen component.";
  const selected = project.graph.nodes.find((node) => node.id === byId("branch-target").value);
  branchEditContext = {
    projectId: project.id,
    graphRef: project.graph,
    edgeId: edge.id,
    edgeSnapshot: { ...edge },
    position: { ...context.position },
    targetSnapshot: selected ? { id: selected.id, label: selected.label, type: selected.type } : null,
  };
  setDialogFocusTarget("branch-modal", returnFocus ? { element: returnFocus, fallbackGraph: true } : { edgeId: edge.id, fallbackGraph: true });
  byId("branch-modal").showModal();
  byId("branch-junction-name").focus();
}
function updateBranchTargetSnapshot() {
  if (!branchEditContext) return;
  const project = projects.find((item) => item.id === branchEditContext.projectId);
  const target = project?.graph.nodes.find((node) => node.id === byId("branch-target").value);
  branchEditContext.targetSnapshot = target ? { id: target.id, label: target.label, type: target.type } : null;
}
function saveBranch() {
  const context = branchEditContext;
  const project = context && projects.find((item) => item.id === context.projectId);
  if (!context || !project || project.id !== activeId || project.graph !== context.graphRef) {
    byId("branch-error").textContent = "The map changed while this form was open. Reopen the branch menu before saving.";
    byId("branch-error").hidden = false;
    return;
  }
  const target = project.graph.nodes.find((node) => node.id === byId("branch-target").value);
  if (!sameNodeSnapshot(target, context.targetSnapshot)) {
    byId("branch-error").textContent = "The selected branch component changed or was removed. Choose a current component and save again.";
    byId("branch-error").hidden = false;
    return;
  }
  try {
    const originalGraph = project.graph;
    const candidate = branchEdgeCandidate(originalGraph, {
      edgeId: context.edgeId,
      expectedEdge: context.edgeSnapshot,
      branchTargetId: target.id,
      junctionLabel: byId("branch-junction-name").value,
      relationship: byId("branch-label").value,
      relationshipType: byId("branch-type").value,
      position: { x: context.position.x - 18, y: context.position.y - 18 },
    });
    const junction = candidate.nodes.find((node) => node.junction && !originalGraph.nodes.some((item) => item.id === node.id));
    if (!junction) throw new Error("The junction could not be created.");
    project.graph = candidate;
    project.updatedAt = Date.now();
    selectedNodeId = junction.id;
    selectedEdgeId = null;
    branchEditContext = null;
    setDialogFocusTarget("branch-modal", { nodeId: junction.id, fallbackGraph: true });
    byId("branch-modal").close();
    animateStructure = true;
    renderAll();
    fitGraph(true);
    persist();
    showToast("Branch saved as one junction, the original labeled segment, a neutral continuation, and one new branch.");
  } catch (error) {
    byId("branch-error").textContent = error instanceof Error ? error.message : "The branch could not be saved.";
    byId("branch-error").hidden = false;
  }
}
function sameEdgeSnapshot(edge, snapshot) {
  return Boolean(edge && snapshot && edge.id === snapshot.id && edge.source === snapshot.source && edge.target === snapshot.target && edge.label === snapshot.label && edge.type === snapshot.type);
}
function fillNodeChoices(select, selectedId, graph = currentGraph()) {
  select.replaceChildren();
  for (const node of graph.nodes) {
    const option = plain("option", "", node.label + " (" + node.type + ")");
    option.value = node.id;
    option.selected = node.id === selectedId;
    select.append(option);
  }
}
function openEdgeEditor(edgeId = null, sourceId = null, { targetId = null, focusField = "edge-label", returnFocus = null, originNodeContext = null } = {}) {
  cancelPendingShareLoad();
  const project = activeProject();
  const graph = project?.graph;
  if (!project || !graph?.nodes.length) { showToast("Add a component before creating a connection.", "error"); return; }
  if (originNodeContext) {
    const originNode = graph.nodes.find((node) => node.id === originNodeContext.nodeId);
    if (!nodeContextIsCurrent(project, originNode, originNodeContext) || sourceId !== originNodeContext.nodeId) {
      focusGraphTarget({ element: returnFocus, fallbackGraph: true });
      showToast("The component changed. Reopen its context menu before connecting from it.", "error");
      return;
    }
  }
  const edge = edgeId ? graph.edges.find((item) => item.id === edgeId) : null;
  if (edgeId && !edge) { showToast("That connection no longer exists.", "error"); return; }
  editingEdgeId = edge?.id || null;
  edgeEditContext = { projectId: project.id, graphRef: graph, edgeId: edge?.id || null, edgeSnapshot: edge ? { ...edge } : null, originNodeContext };
  fillNodeChoices(byId("edge-source"), edge?.source || sourceId || graph.nodes[0].id, graph);
  byId("edge-source").disabled = Boolean(originNodeContext);
  fillNodeChoices(byId("edge-target"), edge?.target || targetId || graph.nodes[Math.min(1, graph.nodes.length - 1)].id, graph);
  byId("edge-label").value = edge?.label || "";
  byId("edge-type").value = edge?.type || "";
  byId("edge-modal-title").textContent = edge ? "Edit connection" : "Add connection";
  byId("edge-modal").querySelector(".modal-head p").textContent = edge ? "Update this relationship or reconnect one endpoint. Changes apply only when saved." : "Describe how two components interact. Changes apply only when saved.";
  byId("edge-error").hidden = true;
  byId("delete-edge").hidden = !edge;
  setDialogFocusTarget("edge-modal", returnFocus ? { element: returnFocus, fallbackGraph: true } : { edgeId: edge?.id || null, fallbackGraph: true });
  byId("edge-modal").showModal();
  byId(focusField)?.focus({ preventScroll: true });
}
function saveEdge() {
  const context = edgeEditContext;
  const project = context && projects.find((item) => item.id === context.projectId);
  if (!context || !project || project.id !== activeId || project.graph !== context.graphRef) {
    byId("edge-error").textContent = "The map changed while this form was open. Reopen the editor before saving.";
    byId("edge-error").hidden = false;
    return;
  }
  const graph = project.graph;
  const source = byId("edge-source").value;
  const target = byId("edge-target").value;
  if (!source || !target || !graph.nodes.some((node) => node.id === source) || !graph.nodes.some((node) => node.id === target)) {
    byId("edge-error").textContent = "Choose two components that still exist in this map.";
    byId("edge-error").hidden = false;
    return;
  }
  if (context.originNodeContext) {
    const originNode = graph.nodes.find((node) => node.id === context.originNodeContext.nodeId);
    if (!nodeContextIsCurrent(project, originNode, context.originNodeContext) || source !== context.originNodeContext.nodeId) {
      byId("edge-error").textContent = "The component you started from changed. Reopen its context menu before saving this connection.";
      byId("edge-error").hidden = false;
      return;
    }
  }
  const existing = context.edgeId ? graph.edges.find((item) => item.id === context.edgeId) : null;
  if (context.edgeId && !sameEdgeSnapshot(existing, context.edgeSnapshot)) {
    byId("edge-error").textContent = "This connection changed while the form was open. Reopen it before saving.";
    byId("edge-error").hidden = false;
    return;
  }
  if (!existing && graph.edges.length >= LIMITS.edges) {
    byId("edge-error").textContent = "Maps support up to " + LIMITS.edges + " connections.";
    byId("edge-error").hidden = false;
    return;
  }
  const edge = {
    ...(existing || {}),
    id: existing?.id || newEdgeId(graph.edges),
    source, target,
    label: byId("edge-label").value.trim(),
    type: byId("edge-type").value.trim(),
  };
  const nextEdges = existing ? graph.edges.map((item) => item.id === existing.id ? edge : item) : [...graph.edges, edge];
  let candidate;
  try { candidate = normalizeEditableGraph({ ...graph, edges: nextEdges }, { baselineGraph: graph }); }
  catch (error) {
    byId("edge-error").textContent = error instanceof Error ? error.message : "This connection would make the map too large to save.";
    byId("edge-error").hidden = false;
    return;
  }
  project.graph = candidate;
  project.updatedAt = Date.now();
  selectedEdgeId = edge.id;
  setDialogFocusTarget("edge-modal", { edgeId: edge.id, fallbackGraph: true });
  byId("edge-modal").close();
  edgeEditContext = null;
  animateStructure = true;
  renderAll();
  fitGraph(true);
  persist();
}
function confirmDeleteEdgeSnapshot(context, returnFocus = null) {
  const project = projects.find((item) => item.id === context?.projectId);
  const edge = project?.graph.edges.find((item) => item.id === context.edgeId);
  if (!project || project.id !== activeId || project.graph !== context.graphRef || !sameEdgeSnapshot(edge, context.edgeSnapshot)) {
    showToast("That connection changed before it could be deleted.", "error");
    return;
  }
  openConfirm("Delete this connection?", "This relationship will be removed from the current map.", "Delete connection", () => {
    const currentProject = projects.find((item) => item.id === context.projectId);
    const currentEdge = currentProject?.graph.edges.find((item) => item.id === context.edgeId);
    if (!currentProject || currentProject.id !== activeId || currentProject.graph !== context.graphRef || !sameEdgeSnapshot(currentEdge, context.edgeSnapshot)) {
      showToast("That connection changed before it could be deleted.", "error");
      return;
    }
    currentProject.graph.edges = currentProject.graph.edges.filter((item) => item.id !== context.edgeId);
    currentProject.updatedAt = Date.now();
    if (selectedEdgeId === context.edgeId) selectedEdgeId = null;
    animateStructure = true;
    renderAll();
    fitGraph(true);
    persist();
  }, returnFocus ? { element: returnFocus, edgeId: context.edgeId, fallbackGraph: true } : { edgeId: context.edgeId, fallbackGraph: true });
}
function confirmEdgeDelete() {
  const context = edgeEditContext;
  if (!context?.edgeId) return;
  const returnFocus = dialogFocusTargets.get("edge-modal") || { edgeId: context.edgeId, fallbackGraph: true };
  dialogFocusTargets.delete("edge-modal");
  byId("edge-modal").close();
  edgeEditContext = null;
  confirmDeleteEdgeSnapshot(context, returnFocus.element || null);
}
function openConfirm(title, copy, actionLabel, callback, returnFocus = null, inheritedShareLoad = null) {
  confirmResumeShareLoad = shareLoadTracker.interruptPending() || shareLoadTracker.transfer(inheritedShareLoad);
  byId("confirm-title").textContent = title;
  byId("confirm-copy").textContent = copy;
  byId("confirm-action").textContent = actionLabel;
  confirmAction = callback;
  setDialogFocusTarget("confirm-modal", returnFocus || { fallbackGraph: true });
  byId("confirm-modal").showModal();
}
function currentImportTab() {
  return byId("file-panel").hidden ? "paste" : "file";
}
function prepareImportDialog() {
  cancelPendingShareLoad();
  importReadGate.invalidate();
  byId("import-error").hidden = true;
  byId("json-input").value = "";
  selectedFile = null;
  byId("json-file").value = "";
  byId("selected-file").textContent = "No file selected";
  switchImportTab("paste");
  byId("import-modal").showModal();
  byId("json-input").focus();
  return true;
}
function openImport() {
  droppedFileGate.invalidate();
  prepareImportDialog();
}
function openImportFromDrop(token) {
  if (!droppedFileGate.isCurrent(token)) return false;
  return prepareImportDialog();
}
function switchImportTab(name) {
  importReadGate.invalidate();
  document.querySelectorAll("[data-import-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.importTab === name));
  byId("paste-panel").hidden = name !== "paste";
  byId("file-panel").hidden = name !== "file";
}
function importError(message) {
  byId("import-error").textContent = message;
  byId("import-error").hidden = false;
}
async function readSelectedFile(file) {
  if (file.size > MAX_IMPORT_BYTES) throw new Error("This JSON file is larger than the 2 MB import limit.");
  if (!file.name.toLowerCase().endsWith(".json") && file.type && !file.type.includes("json")) {
    throw new Error("Choose a .json architecture file.");
  }
  return await file.text();
}
async function submitImport() {
  const request = importReadGate.begin();
  const dialog = byId("import-modal");
  const tab = currentImportTab();
  const file = selectedFile;
  const pastedText = byId("json-input").value;
  byId("import-error").hidden = true;
  try {
    const source = await readImportSource({ tab, pastedText, file, readFile: readSelectedFile, token: request, isCurrent: importReadGate.isCurrent });
    if (source === null || !importReadGate.isCurrent(request) || !dialog.open || currentImportTab() !== tab) return;
    if (!source.trim()) throw new Error("Paste a JSON map or choose a JSON file first.");
    const graph = normalizeEditableGraph(source);
    recoverIncomingShareFailureAfterImport();
    cancelPendingShareLoad();
    const project = makeProject(graph);
    projects.unshift(project);
    activeId = project.id;
    viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
    selectedNodeId = null;
    excludedTypes.clear();
    searchTerm = "";
    byId("search").value = "";
    selectedFile = null;
    byId("import-modal").close();
    animateStructure = true;
    renderAll();
    fitGraph(true);
    const saved = persist(false);
    if (saved) showToast("Imported " + graph.nodes.length + " components. This map is stored in this browser.");
    else showToast("Imported for this session, but Atlas could not save the map in this browser. Download JSON before leaving.", "error");
  } catch (error) {
    if (!importReadGate.isCurrent(request) || !dialog.open || currentImportTab() !== tab) return;
    importError(error instanceof Error ? error.message : "The map could not be imported.");
  }
}
async function importDroppedFile(file) {
  const request = droppedFileGate.begin();
  try {
    const text = await readSelectedFile(file);
    if (!droppedFileGate.isCurrent(request)) return;
    if (!openImportFromDrop(request)) return;
    byId("json-input").value = text;
    switchImportTab("paste");
  } catch (error) {
    if (!droppedFileGate.isCurrent(request)) return;
    showToast(error instanceof Error ? error.message : "Could not read the dropped file.", "error");
  }
}
function requestClearData() {
  const message = recoveryMode && recoveryText
    ? "This permanently removes the saved Project Atlas library from this browser. Download the saved-data backup first if you need to preserve it. Theme and inspector preferences remain; the workspace will be empty."
    : "This removes the saved Project Atlas library from this browser. Theme and inspector preferences remain; the workspace will be empty. You can add or import a map, or opt in to View example flow later.";
  openConfirm("Clear local data and start fresh?", message, "Clear and start fresh", () => {
    const route = clearLocalDataRoute(location.search);
    try {
      history.replaceState(history.state, "", location.pathname + route.search + route.hash);
    } catch {
      showToast("The current share or example route could not be cleared, so local data was left unchanged.", "error");
      return;
    }
    shareLoadTracker.cancel();
    clearIncomingShareFailure();
    confirmResumeShareLoad = null;
    const result = clearLibrary();
    if (!result.ok) { showToast(result.error, "error"); return; }
    recoveryMode = false;
    recoveryText = "";
    lastStorageError = "";
    projects = [];
    activeId = "";
    viewMode = "graph";
    selectedNodeId = null;
    selectedEdgeId = null;
    touchSelectedEdge = null;
    focusedType = "";
    excludedTypes.clear();
    filterPointerActivation = null;
    filterInputModality = "";
    touchInteractionActive = false;
    searchTerm = "";
    byId("search").value = "";
    renderAll();
    fitGraph(false);
    showToast("Local map data cleared. Your workspace is empty; add or import a map when ready.");
  });
}
function downloadRecovery() {
  if (!recoveryText) { showToast("There is no readable saved-data backup available.", "error"); return; }
  downloadText(recoveryText, "project-atlas-local-data-backup.json", "application/json;charset=utf-8");
  showToast("Downloaded the raw saved-data backup. It has not been changed.");
}
async function exportCurrent(kind) {
  const graph = currentGraph();
  const name = safeFilename(graph.project.name);
  if (kind === "json") { exportJson(graph); showToast("Downloaded a JSON backup."); return; }
  const activeTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  if (kind === "svg") { downloadText(buildSvg(graph, activeTheme), name + ".svg", "image/svg+xml;charset=utf-8"); showToast("Downloaded a standalone SVG."); return; }
  if (kind === "png" || kind === "copy-image") {
    try {
      const blob = await svgToPngBlob(buildSvg(graph, activeTheme));
      if (kind === "png") {
        downloadBlob(blob, name + ".png");
        showToast("Downloaded a PNG image. Very large maps are scaled to browser-safe dimensions.");
      } else {
        await copyPng(blob);
        showToast("Copied the architecture image.");
      }
    } catch (error) {
      if (kind === "copy-image") {
        try {
          const blob = await svgToPngBlob(buildSvg(graph, activeTheme));
          downloadBlob(blob, name + ".png");
          showToast("Image clipboard access is unavailable, so the PNG was downloaded instead.");
        } catch (fallbackError) {
          showToast((fallbackError instanceof Error ? fallbackError.message : "Image export failed.") + " Use Export > Download SVG or JSON.", "error");
        }
      } else showToast((error instanceof Error ? error.message : "PNG export failed.") + " Use Export > Download SVG or JSON.", "error");
    }
  }
}

async function copyText(text, { container = document.body, isCurrent = () => true } = {}) {
  if (!isCurrent()) throw new Error("The copy context changed before the clipboard write.");
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      if (!isCurrent()) throw new Error("The copy context changed while the clipboard was writing.");
      return true;
    } catch (error) {
      if (!isCurrent()) throw error;
    }
  }
  if (!isCurrent()) throw new Error("The copy context changed before the fallback clipboard write.");
  const previousFocus = document.activeElement;
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.left = "-10000px";
  helper.style.top = "0";
  const target = container?.isConnected ? container : document.body;
  target.append(helper);
  helper.focus();
  helper.select();
  let copied = false;
  try { copied = document.execCommand("copy"); } catch {}
  helper.remove();
  if (previousFocus?.isConnected) previousFocus.focus();
  if (!copied) throw new Error("Clipboard access is blocked. Select the text and copy it manually.");
  if (!isCurrent()) throw new Error("The copy context changed during the fallback clipboard write.");
  return true;
}
function currentBaseUrl() {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";
  return url.origin + url.pathname;
}
function currentPrompt() {
  return buildAgentPrompt(currentBaseUrl(), isLocalShareHost(location.hostname));
}
async function copyAgentPrompt(openFallback = true) {
  const prompt = currentPrompt();
  byId("prompt-text").value = prompt;
  try {
    await copyText(prompt);
    showToast("Copied the Project Atlas agent prompt.");
    return true;
  } catch (error) {
    if (openFallback && !byId("prompt-modal").open) byId("prompt-modal").showModal();
    byId("prompt-text").focus();
    byId("prompt-text").select();
    showToast("Prompt is selected. Press Ctrl+C or Command+C to copy it.", "error");
    return false;
  }
}
async function openShareDialog() {
  cancelPendingShareLoad();
  const sequence = ++shareDialogSequence;
  const graph = currentGraph();
  shareDialogProjectId = activeId;
  shareDialogProjectName = String(graph.project.name || "Software project");
  const dialog = byId("share-modal");
  const urlInput = byId("share-url");
  const errorBox = byId("share-error");
  const warning = byId("share-warning");
  urlInput.value = "";
  byId("share-named-fallback").value = "";
  byId("share-named-fallback").hidden = true;
  errorBox.hidden = true;
  errorBox.textContent = "";
  warning.textContent = isLocalShareHost(location.hostname)
    ? "This localhost link opens only on this computer. Deploy the static app first, then share its public URL."
    : "The graph is in this URL fragment and is not sent to the app server. The link carries the graph content.";
  dialog.showModal();
  try {
    const url = await createShareUrl(graph, currentBaseUrl());
    if (sequence !== shareDialogSequence || !dialog.open) return;
    urlInput.value = url;
  } catch (error) {
    if (sequence !== shareDialogSequence || !dialog.open) return;
    errorBox.textContent = (error instanceof Error ? error.message : "Could not create a share link.") + " Use Export > Download JSON as a fallback.";
    errorBox.hidden = false;
  }
}
function captureShareCopySnapshot() {
  return {
    dialogSequence: shareDialogSequence,
    dialogOpen: byId("share-modal").open,
    projectId: shareDialogProjectId,
    projectName: shareDialogProjectName,
    url: byId("share-url").value,
  };
}
function shareCopySnapshotIsCurrent(snapshot) {
  return isNamedLinkSnapshotCurrent(snapshot, {
    dialogSequence: shareDialogSequence,
    dialogOpen: byId("share-modal").open,
    projectId: activeId,
    projectName: String(activeProject()?.graph.project.name || "Software project"),
    url: byId("share-url").value,
  });
}
async function copyShareLink() {
  const input = byId("share-url");
  const snapshot = captureShareCopySnapshot();
  if (!snapshot.url) {
    byId("share-error").textContent = byId("share-error").textContent || "No share link is ready. Download a JSON backup instead.";
    byId("share-error").hidden = false;
    return;
  }
  if (!shareCopySnapshotIsCurrent(snapshot)) return;
  try {
    await copyText(snapshot.url, { container: byId("share-modal"), isCurrent: () => shareCopySnapshotIsCurrent(snapshot) });
    if (shareCopySnapshotIsCurrent(snapshot)) showToast("Copied a link that opens this interactive map.");
  } catch {
    if (!shareCopySnapshotIsCurrent(snapshot)) return;
    input.focus();
    input.select();
    showToast("Share link is selected. Press Ctrl+C or Command+C to copy it.", "error");
  }
}
async function copyNamedShareLink() {
  const snapshot = captureShareCopySnapshot();
  if (!snapshot.url) {
    byId("share-error").textContent = byId("share-error").textContent || "No share link is ready. Download a JSON backup instead.";
    byId("share-error").hidden = false;
    return;
  }
  if (!shareCopySnapshotIsCurrent(snapshot)) return;
  let payload;
  try { payload = namedLinkPayload(snapshot.projectName, snapshot.url); }
  catch (error) {
    if (shareCopySnapshotIsCurrent(snapshot)) {
      byId("share-error").textContent = error instanceof Error ? error.message : "Could not format a named link. Use Copy link for the full URL.";
      byId("share-error").hidden = false;
    }
    return;
  }
  const namedFallback = byId("share-named-fallback");
  try {
    const mode = await writeNamedLinkClipboard(payload, {
      isCurrent: () => shareCopySnapshotIsCurrent(snapshot),
      writePlain: (text) => {
        if (!shareCopySnapshotIsCurrent(snapshot)) throw new Error("The share dialog changed.");
        return copyText(text, { container: byId("share-modal"), isCurrent: () => shareCopySnapshotIsCurrent(snapshot) });
      },
    });
    if (mode === "stale" || !shareCopySnapshotIsCurrent(snapshot)) return;
    namedFallback.hidden = true;
    showToast(mode === "rich" ? "Copied a named rich-text link and Markdown link." : "Copied a named Markdown link.");
  } catch {
    if (!shareCopySnapshotIsCurrent(snapshot)) return;
    try {
      await copyText(snapshot.url, { container: byId("share-modal"), isCurrent: () => shareCopySnapshotIsCurrent(snapshot) });
      if (!shareCopySnapshotIsCurrent(snapshot)) return;
      namedFallback.hidden = true;
      showToast("Named-link formatting was unavailable, so the full map link was copied.");
    } catch {
      if (!shareCopySnapshotIsCurrent(snapshot)) return;
      namedFallback.value = payload.markdown;
      namedFallback.hidden = false;
      namedFallback.focus();
      namedFallback.select();
      showToast("Named Markdown is selected. Press Ctrl+C or Command+C to copy it, or use Copy link for the full URL.", "error");
    }
  }
}
function showIncomingShareFailure(fragment, message) {
  incomingShareFailure = { fragment, message };
  byId("incoming-share-message").textContent = message;
  byId("incoming-share-context").textContent = shareFailureContext(Boolean(activeProject()));
  byId("incoming-share-error").hidden = false;
}
function clearIncomingShareFailure() {
  incomingShareFailure = null;
  byId("incoming-share-error").hidden = true;
  byId("incoming-share-message").textContent = "";
  byId("incoming-share-context").textContent = "";
}
function recoverIncomingShareFailureAfterImport() {
  const failure = incomingShareFailure;
  if (!failure) return;
  const route = clearRejectedShareRoute(location.search, location.hash, failure.fragment);
  if (!route) {
    clearIncomingShareFailure();
    return;
  }
  try {
    history.replaceState(history.state, "", location.pathname + route.search + route.hash);
    clearIncomingShareFailure();
  } catch {
    showIncomingShareFailure(
      failure.fragment,
      failure.message + " The JSON map was imported, but this invalid share link could not be removed from the address bar.",
    );
  }
}
function dismissIncomingShareFailure() {
  byId("incoming-share-error").hidden = true;
}
async function openIncomingShare() {
  const request = shareLoadTracker.begin(location.hash);
  const fragment = request.fragment;
  if (!fragment.startsWith("#map=")) {
    if (incomingShareFailure?.fragment !== fragment) clearIncomingShareFailure();
    return;
  }
  if (incomingShareFailure && incomingShareFailure.fragment !== fragment) clearIncomingShareFailure();
  try {
    const graph = await decodeShareHash(fragment);
    if (!shareLoadTracker.isCurrent(request, location.hash)) return;
    if (!graph) return;
    let project = findSharedProject(projects, fragment);
    if (!project) {
      normalizeEditableGraph(graph, { baselineGraph: graph });
      const id = await shareKey(fragment);
      if (!shareLoadTracker.isCurrent(request, location.hash)) return;
      project = findSharedProject(projects, fragment);
      if (!project) {
        let uniqueId = id;
        if (projects.some((item) => item.id === uniqueId)) uniqueId += "-" + createProjectId().slice(-8);
        project = makeProject(graph, uniqueId, { shareSourceHash: fragment });
        projects.unshift(project);
      }
    }
    clearIncomingShareFailure();
    activeId = project.id;
    viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
    selectedNodeId = null;
    excludedTypes.clear();
    searchTerm = "";
    byId("search").value = "";
    animateStructure = true;
    renderAll();
    fitGraph(true);
    persist();
    showToast(recoveryMode ? "Opened shared map in this session. Download or clear the unreadable saved library before saving." : "Opened the shared map. It is available in this browser's project library.");
  } catch (error) {
    if (!shareLoadTracker.isCurrent(request, location.hash)) return;
    showIncomingShareFailure(fragment, error instanceof Error ? error.message : "This share link could not be opened.");
  } finally {
    shareLoadTracker.finish(request);
  }
}
function bindDialogEnterSave(id, save) {
  byId(id).addEventListener("keydown", (event) => {
    if (!shouldSaveOnEnter(event)) return;
    event.preventDefault();
    save();
  });
}
function updateMotionButton() {
  const button = byId("pause-motion");
  if (!button) return;
  button.textContent = motionPaused ? "Resume flow" : "Pause flow";
  button.setAttribute("aria-pressed", String(motionPaused));
  button.title = motionPaused ? "Resume graph animations" : "Pause graph animations";
}
function toggleMotion() {
  motionPaused = !motionPaused;
  const svg = byId("graph");
  svg.classList.toggle("motion-paused", motionPaused);
  try {
    if (motionPaused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  } catch {}
  updateMotionButton();
}
function attachEvents() {
  bindInspectorResize();
  window.addEventListener("hashchange", () => { void openIncomingShare(); });
  byId("new-project").addEventListener("click", createProject);
  byId("example-flow").addEventListener("click", openFlowExample);
  byId("show-map").addEventListener("click", () => setViewMode("graph"));
  byId("show-timeline").addEventListener("click", () => setViewMode("timeline"));
  byId("open-import").addEventListener("click", openImport);
  byId("recover-share-json").addEventListener("click", openImport);
  byId("dismiss-share-error").addEventListener("click", dismissIncomingShareFailure);
  byId("edit-project").addEventListener("click", openProjectEditor);
  byId("save-project").addEventListener("click", saveProjectDetails);
  byId("delete-project").addEventListener("click", confirmProjectDelete);
  byId("save-node").addEventListener("click", saveNode);
  byId("delete-node").addEventListener("click", () => confirmNodeDelete(editingNodeId));
  byId("save-edge").addEventListener("click", saveEdge);
  byId("save-branch").addEventListener("click", saveBranch);
  byId("branch-target").addEventListener("change", updateBranchTargetSnapshot);
  byId("delete-edge").addEventListener("click", confirmEdgeDelete);
  bindDialogEnterSave("project-name-input", saveProjectDetails);
  bindDialogEnterSave("node-label", saveNode);
  bindDialogEnterSave("node-type", saveNode);
  bindDialogEnterSave("edge-label", saveEdge);
  bindDialogEnterSave("edge-type", saveEdge);
  byId("add-node").addEventListener("click", () => openNodeEditor());
  byId("add-edge").addEventListener("click", () => openEdgeEditor(null, selectedNodeId));
  byId("auto-layout").addEventListener("click", autoLayout);
  byId("fit-graph").addEventListener("click", () => fitGraph(true));
  byId("zoom-in").addEventListener("click", () => {
    const rect = byId("graph-stage").getBoundingClientRect();
    zoomAt(transform.scale * 1.16, rect.width / 2, rect.height / 2);
  });
  byId("zoom-out").addEventListener("click", () => {
    const rect = byId("graph-stage").getBoundingClientRect();
    zoomAt(transform.scale / 1.16, rect.width / 2, rect.height / 2);
  });
  byId("close-inspector").addEventListener("click", () => {
    selectedNodeId = null;
    renderInspector();
    refreshTraceStyles();
  });
  byId("search").addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderGraph();
  });
  const filterGroup = byId("type-filters");
  document.addEventListener("keydown", () => { filterInputModality = "keyboard"; }, true);
  filterGroup.addEventListener("pointerdown", (event) => {
    filterInputModality = event.pointerType || filterInputModality;
    const chip = event.target.closest?.(".filter-chip");
    filterPointerActivation = chip
      ? { type: chip.dataset.type || "all", pointerType: event.pointerType, pointerId: event.pointerId }
      : null;
  });
  filterGroup.addEventListener("pointercancel", (event) => {
    if (filterPointerActivation?.pointerId === event.pointerId) filterPointerActivation = null;
  });
  filterGroup.addEventListener("pointerover", (event) => {
    const chip = event.target.closest?.(".filter-chip[data-type]");
    if (chip) {
      filterInputModality = event.pointerType || filterInputModality;
      applyTypeInteraction({ kind: "pointer-over", type: chip.dataset.type, pointerType: event.pointerType });
    }
  });
  filterGroup.addEventListener("pointerout", (event) => {
    const from = event.target.closest?.(".filter-chip[data-type]");
    if (!from) return;
    filterInputModality = event.pointerType || filterInputModality;
    const to = event.relatedTarget?.closest?.(".filter-chip[data-type]");
    if (to && filterGroup.contains(to)) {
      applyTypeInteraction({ kind: "pointer-over", type: to.dataset.type, pointerType: event.pointerType });
    } else if (!filterGroup.contains(event.relatedTarget) || from.dataset.type === focusedType) {
      applyTypeInteraction({ kind: "pointer-out", pointerType: event.pointerType });
    }
  });
  filterGroup.addEventListener("focusin", (event) => {
    const chip = event.target.closest?.(".filter-chip[data-type]");
    if (filterInputModality === "keyboard" && filterPointerActivation?.pointerType !== "touch" && chip?.matches(":focus-visible")) {
      applyTypeInteraction({ kind: "focus", type: chip.dataset.type, inputType: "keyboard" });
    }
  });
  filterGroup.addEventListener("focusout", () => queueMicrotask(() => {
    const chip = document.activeElement?.closest?.(".filter-chip[data-type]");
    const keyboardFocus = filterInputModality === "keyboard" && chip?.matches(":focus-visible");
    applyTypeInteraction({
      kind: "focus",
      type: keyboardFocus ? chip.dataset.type : "",
      inputType: filterInputModality === "keyboard" ? "keyboard" : "unknown",
    });
  }));
  byId("project-modal").addEventListener("close", () => {
    projectEditContext = null;
    const interruption = projectEditResumeShareLoad;
    projectEditResumeShareLoad = null;
    if (shareLoadTracker.shouldResume(interruption, location.hash)) void openIncomingShare();
  });
  byId("editor-modal").addEventListener("close", () => { nodeEditContext = null; restoreDialogFocus("editor-modal"); });
  byId("edge-modal").addEventListener("close", () => { edgeEditContext = null; restoreDialogFocus("edge-modal"); });
  byId("branch-modal").addEventListener("close", () => { branchEditContext = null; restoreDialogFocus("branch-modal"); });
  byId("confirm-modal").addEventListener("close", () => {
    restoreDialogFocus("confirm-modal");
    const interruption = confirmResumeShareLoad;
    confirmResumeShareLoad = null;
    if (shareLoadTracker.shouldResume(interruption, location.hash)) void openIncomingShare();
  });
  const importDialog = byId("import-modal");
  const invalidateImportReads = () => { importReadGate.invalidate(); droppedFileGate.invalidate(); };
  importDialog.addEventListener("cancel", invalidateImportReads);
  importDialog.addEventListener("close", invalidateImportReads);
  const shareDialog = byId("share-modal");
  shareDialog.addEventListener("close", () => { if (!shareDialog.open) shareDialogSequence += 1; });
  byId("import-submit").addEventListener("click", submitImport);
  importDialog.querySelectorAll("[data-import-tab]").forEach((tab) => tab.addEventListener("click", () => switchImportTab(tab.dataset.importTab)));
  byId("json-file").addEventListener("change", (event) => {
    importReadGate.invalidate();
    selectedFile = event.target.files?.[0] || null;
    byId("selected-file").textContent = selectedFile ? selectedFile.name + " (" + Math.ceil(selectedFile.size / 1024) + " KB)" : "No file selected";
    if (selectedFile) switchImportTab("file");
  });
  document.querySelector("[data-empty-create]").addEventListener("click", () => {
    if (activeProject()) openNodeEditor();
    else createProject();
  });
  document.querySelector("[data-empty-import]").addEventListener("click", openImport);
  byId("clear-data").addEventListener("click", requestClearData);
  byId("download-recovery").addEventListener("click", downloadRecovery);
  byId("confirm-action").addEventListener("click", () => {
    const action = confirmAction;
    confirmAction = null;
    byId("confirm-modal").close();
    if (action) action();
  });
  byId("export-menu-button").addEventListener("click", () => {
    const menu = byId("export-menu");
    menu.hidden = !menu.hidden;
  });
  document.querySelectorAll("[data-export]").forEach((button) => button.addEventListener("click", async () => {
    byId("export-menu").hidden = true;
    await exportCurrent(button.dataset.export);
  }));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".heading-actions")) byId("export-menu").hidden = true;
  });
  byId("copy-agent-prompt").addEventListener("click", () => copyAgentPrompt(true));
  byId("copy-prompt-text").addEventListener("click", () => copyAgentPrompt(false));
  byId("share-graph").addEventListener("click", openShareDialog);
  byId("copy-share-link").addEventListener("click", copyShareLink);
  byId("copy-named-share-link").addEventListener("click", copyNamedShareLink);
  byId("pause-motion")?.addEventListener("click", toggleMotion);
  byId("mobile-menu").addEventListener("click", () => byId("sidebar").classList.toggle("open"));
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", updateViewMode);
  byId("project-list").addEventListener("click", (event) => {
    if (event.target.closest(".project-row")) byId("sidebar").classList.remove("open");
  });

  const graphSvg = byId("graph");
  const graphStage = byId("graph-stage");
  const preventGraphNativeSelection = (event) => event.preventDefault();
  graphSvg.addEventListener("selectstart", preventGraphNativeSelection, true);
  graphSvg.addEventListener("dragstart", preventGraphNativeSelection);
  graphStage.addEventListener("contextmenu", (event) => {
    if (viewMode !== "graph") return;
    const target = event.target;
    if (target.closest?.(".node-card, .edge-group, .graph-controls, .graph-view-tabs, .canvas-help, #graph-context-menu, .empty-state button, .empty-state a, .empty-state input")) return;
    const onMapSurface = target.closest?.("#graph") || target.closest?.(".empty-state") || target === graphStage;
    if (!onMapSurface) return;
    event.preventDefault();
    showCanvasContextMenu(event);
  });
  byId("graph-context-menu").addEventListener("click", handleGraphMenuAction);
  byId("graph-context-menu").addEventListener("keydown", (event) => {
    const items = [...byId("graph-context-menu").querySelectorAll('[role="menuitem"]:not([hidden])')];
    if (!items.length) return;
    const index = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      items[(index + step + items.length) % items.length].focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      items[event.key === "Home" ? 0 : items.length - 1].focus();
    } else if (event.key === "Tab") {
      const returnFocus = menuReturnFocus;
      const stops = focusableElementsOutsideGraphMenu();
      const originIndex = stops.indexOf(returnFocus);
      const targetIndex = originIndex + (event.shiftKey ? -1 : 1);
      const next = originIndex >= 0 ? stops[targetIndex] : null;
      if (next) {
        event.preventDefault();
        hideGraphContextMenu();
        next.focus({ preventScroll: true });
      } else {
        hideGraphContextMenu({ restoreFocus: true });
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      hideGraphContextMenu({ restoreFocus: true });
    }
  });
  document.addEventListener("pointerdown", (event) => { if (!event.target.closest?.("#graph-context-menu")) hideGraphContextMenu(); });
  graphSvg.addEventListener("pointerdown", startPan);
  graphSvg.addEventListener("pointermove", movePointer);
  graphSvg.addEventListener("pointerup", endPointer);
  graphSvg.addEventListener("pointercancel", endPointer);
  graphSvg.addEventListener("lostpointercapture", endPointer);
  document.addEventListener("pointerup", endPointer);
  document.addEventListener("pointercancel", endPointer);
  graphSvg.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = byId("graph-stage").getBoundingClientRect();
    zoomAt(transform.scale * (event.deltaY < 0 ? 1.1 : 1 / 1.1), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  byId("graph-stage").addEventListener("dragenter", (event) => {
    if (Array.from(event.dataTransfer?.types || []).includes("Files")) {
      event.preventDefault();
      byId("drop-overlay").hidden = false;
    }
  });
  byId("graph-stage").addEventListener("dragover", (event) => {
    if (Array.from(event.dataTransfer?.types || []).includes("Files")) event.preventDefault();
  });
  byId("graph-stage").addEventListener("dragleave", (event) => {
    if (!byId("graph-stage").contains(event.relatedTarget)) byId("drop-overlay").hidden = true;
  });
  byId("graph-stage").addEventListener("drop", (event) => {
    event.preventDefault();
    byId("drop-overlay").hidden = true;
    const file = Array.from(event.dataTransfer?.files || []).find((item) => item.name.toLowerCase().endsWith(".json") || item.type.includes("json"));
    if (file) importDroppedFile(file);
    else showToast("Drop a .json architecture map onto the canvas.", "error");
  });
  document.addEventListener("keydown", (event) => {
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key.toLowerCase() === "k") {
      event.preventDefault();
      byId("search").focus();
    } else if (modifier && event.key.toLowerCase() === "i") {
      event.preventDefault();
      openImport();
    } else if (event.key === "Escape") {
      if (dragState?.kind === "connection") cancelActiveConnection();
      const menu = byId("graph-context-menu");
      if (!menu.hidden) { event.preventDefault(); hideGraphContextMenu({ restoreFocus: true }); }
      byId("sidebar").classList.remove("open");
      byId("export-menu").hidden = true;
    }
  });
  document.addEventListener("visibilitychange", () => {
    try {
      if (document.hidden || motionPaused) graphSvg.pauseAnimations();
      else graphSvg.unpauseAnimations();
    } catch {}
  });
}
function init() {
  attachEvents();
  const prompt = currentPrompt();
  byId("prompt-text").value = prompt;
  const openExample = isFlowExampleRoute(location.search, location.hash);
  if (openExample) openFlowExample();
  const search = consumeFlowExampleQuery(location.search);
  if (search !== location.search) {
    history.replaceState(history.state, "", location.pathname + search + location.hash);
  }
  if (!openExample) {
    viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
    renderAll();
    requestAnimationFrame(() => fitGraph(false));
    openIncomingShare();
  }
  updateMotionButton();
  if (recoveryMode) {
    showToast(recoveryText
      ? "Saved data could not be read. Download the raw backup or deliberately clear local data before saving changes."
      : "Browser storage is unavailable. Changes stay in this session; use Export to keep a backup.", "error");
  }
}
init();
