export const SCHEMA_VERSION = 1;
export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
export const LIMITS = Object.freeze({ nodes: 800, edges: 2400, text: 12000, chartPoints: 32, chartMagnitude: 1000000000000, detailItems: 8, detailText: 240 });

const asRecord = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const first = (...values) => values.find((value) => value !== undefined && value !== null);
const cleanText = (value, field, max = LIMITS.text, { required = false } = {}) => {
  if (value === undefined || value === null) {
    if (required) throw new Error(field + " is required.");
    return "";
  }
  if (typeof value !== "string" && typeof value !== "number") throw new Error(field + " must be text.");
  const text = String(value).trim();
  if (required && !text) throw new Error(field + " is required.");
  if (text.length > max) throw new Error(field + " must be " + max + " characters or fewer.");
  return text;
};
const cleanTextList = (value, field, maxItems = LIMITS.detailItems, maxText = LIMITS.detailText) => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error(field + " must be a list of text values.");
  if (value.length > maxItems) throw new Error(field + " must contain " + maxItems + " items or fewer.");
  return value.map((item, index) => cleanText(item, field + " item " + (index + 1), maxText, { required: true }));
};
const makeId = (prefix, index) => prefix + "-" + String(index + 1).padStart(3, "0");

export function normalizeGraph(input, options = {}) {
  let root = input;
  if (typeof input === "string") {
    if (new TextEncoder().encode(input).byteLength > MAX_IMPORT_BYTES) {
      throw new Error("This JSON file is larger than the 2 MB import limit.");
    }
    try { root = JSON.parse(input); }
    catch (error) { throw new Error("That is not valid JSON: " + error.message); }
  }
  root = asRecord(root);
  if (!Object.keys(root).length) throw new Error("The JSON must contain a project, nodes, and edges.");
  const graphInput = asRecord(root.graph);
  const projectInput = asRecord(first(root.project, root.metadata, root.meta, graphInput.project, {}));
  const rawNodes = first(root.nodes, root.components, graphInput.nodes);
  const rawEdges = first(root.edges, root.connections, root.relationships, graphInput.edges, graphInput.links, []);
  if (!Array.isArray(rawNodes)) throw new Error("The map needs a nodes array (or components array).");
  if (!Array.isArray(rawEdges)) throw new Error("The map needs an edges array (or connections array).");
  if (rawNodes.length > LIMITS.nodes) throw new Error("This map has " + rawNodes.length + " components; the limit is " + LIMITS.nodes + ".");
  if (rawEdges.length > LIMITS.edges) throw new Error("This map has " + rawEdges.length + " connections; the limit is " + LIMITS.edges + ".");
  if (rawNodes.length === 0 && !options.allowEmpty) throw new Error("Add at least one component before importing this map.");

  const nodes = rawNodes.map((rawValue, index) => {
    const raw = asRecord(rawValue);
    const id = cleanText(first(raw.id, raw.key, raw.slug, makeId("node", index)), "Component " + (index + 1) + " ID", 160, { required: true });
    const label = cleanText(first(raw.label, raw.name, raw.title, raw.id), "Component " + id + " name", 120, { required: true });
    const type = cleanText(first(raw.type, raw.kind, raw.category, raw.componentType, "Component"), "Component " + label + " type", 60, { required: true });
    const sourceReference = typeof raw.sourceRef === "string" || typeof raw.sourceRef === "number"
      ? raw.sourceRef
      : first(asRecord(raw.sourceRef).path, asRecord(raw.sourceRef).file, asRecord(raw.sourceRef).uri, asRecord(raw.sourceRef).ref);
    const node = {
      id, label, type,
      description: cleanText(first(raw.description, raw.detail, raw.sub, raw.summary, raw.purpose), "Component " + label + " description", 1000),
      source: cleanText(first(raw.source, raw.path, raw.file, raw.location, sourceReference), "Component " + label + " source", 240),
      group: cleanText(first(raw.group, raw.domain, raw.boundary), "Component " + label + " group", 100),
    };
    if (raw.junction !== undefined && typeof raw.junction !== "boolean") throw new Error("Component " + label + " junction marker must be true or false.");
    if (raw.junction === true) {
      if (type.toLowerCase() !== "junction") throw new Error("A junction marker requires component type Junction.");
      node.junction = true;
    }
    if (raw.details !== undefined && raw.details !== null) {
      if (!raw.details || typeof raw.details !== "object" || Array.isArray(raw.details)) throw new Error("Details for " + label + " must be an object.");
      const detailsInput = raw.details;
      const details = {
        purpose: cleanText(detailsInput.purpose, "Component " + label + " purpose", 500),
        operation: cleanText(detailsInput.operation, "Component " + label + " operation", 1000),
        inputs: cleanTextList(detailsInput.inputs, "Component " + label + " inputs"),
        outputs: cleanTextList(detailsInput.outputs, "Component " + label + " outputs"),
        dependencies: cleanTextList(detailsInput.dependencies, "Component " + label + " dependencies"),
        evidence: cleanTextList(detailsInput.evidence, "Component " + label + " evidence"),
        uncertainty: cleanTextList(detailsInput.uncertainty, "Component " + label + " uncertainty"),
      };
      if (details.purpose || details.operation || Object.values(details).some((value) => Array.isArray(value) && value.length)) node.details = details;
    }
    if (raw.chart !== undefined && raw.chart !== null) {
      const rawChart = asRecord(raw.chart);
      const chartLabel = cleanText(rawChart.label, "Chart for " + label + " label", 80, { required: true });
      const kind = cleanText(rawChart.kind, "Chart for " + label + " kind", 8, { required: true });
      if (!["bar", "line", "area"].includes(kind)) throw new Error("Chart for " + label + " kind must be bar, line, or area.");
      if (!Array.isArray(rawChart.values) || rawChart.values.length < 2 || rawChart.values.length > LIMITS.chartPoints) {
        throw new Error("Chart for " + label + " values must contain 2 to " + LIMITS.chartPoints + " points.");
      }
      const values = rawChart.values.map((value, valueIndex) => {
        if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > LIMITS.chartMagnitude) {
          throw new Error("Chart for " + label + " point " + (valueIndex + 1) + " must be a finite number within " + LIMITS.chartMagnitude + ".");
        }
        return value;
      });
      const evidence = cleanText(rawChart.evidence, "Chart for " + label + " evidence", 240, { required: true });
      const unit = cleanText(first(rawChart.unit, ""), "Chart for " + label + " unit", 24);
      const categories = rawChart.categories === undefined || rawChart.categories === null
        ? [] : cleanTextList(rawChart.categories, "Chart for " + label + " categories", LIMITS.chartPoints, 80);
      const order = cleanText(rawChart.order, "Chart for " + label + " order", 160);
      if (kind === "bar" && categories.length !== values.length) throw new Error("Bar chart for " + label + " needs one category label for each value.");
      if ((kind === "line" || kind === "area") && categories.length && categories.length !== values.length) throw new Error("Chart for " + label + " needs one category label for each value.");
      if ((kind === "line" || kind === "area") && Boolean(categories.length) !== Boolean(order)) throw new Error("Ordered chart for " + label + " needs both category labels and an order explanation.");
      node.chart = { label: chartLabel, kind, values, evidence };
      if (unit) node.chart.unit = unit;
      if (categories.length) node.chart.categories = categories;
      if (order) node.chart.order = order;
    }
    const position = asRecord(first(raw.position, raw.pos, {}));
    const x = Number(first(position.x, raw.x));
    const y = Number(first(position.y, raw.y));
    if (Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) < 100000 && Math.abs(y) < 100000) node.position = { x, y };
    return node;
  });
  const nodeIds = new Set();
  for (const node of nodes) {
    if (nodeIds.has(node.id)) throw new Error("Duplicate component ID: \"" + node.id + "\". Each component needs a unique ID.");
    nodeIds.add(node.id);
  }
  const edgeIds = new Set();
  const edges = rawEdges.map((rawValue, index) => {
    const raw = asRecord(rawValue);
    const source = cleanText(first(raw.source, raw.from, raw.sourceId, raw.fromId), "Connection " + (index + 1) + " source", 160, { required: true });
    const target = cleanText(first(raw.target, raw.to, raw.targetId, raw.toId), "Connection " + (index + 1) + " target", 160, { required: true });
    if (!nodeIds.has(source)) throw new Error("Connection " + (index + 1) + " refers to missing component \"" + source + "\".");
    if (!nodeIds.has(target)) throw new Error("Connection " + (index + 1) + " refers to missing component \"" + target + "\".");
    const id = cleanText(first(raw.id, raw.key, makeId("edge", index)), "Connection " + (index + 1) + " ID", 160, { required: true });
    if (edgeIds.has(id)) throw new Error("Duplicate connection ID: \"" + id + "\". Each connection needs a unique ID.");
    edgeIds.add(id);
    return {
      id, source, target,
      label: cleanText(first(raw.label, raw.name, raw.relationship), "Connection " + id + " label", 100),
      type: cleanText(first(raw.type, raw.kind), "Connection " + id + " type", 60),
    };
  });
  const project = {
    name: cleanText(first(projectInput.name, projectInput.title, root.projectName, "Imported architecture"), "Project name", 120, { required: true }),
    description: cleanText(first(projectInput.description, projectInput.tagline, projectInput.summary, root.description), "Project description", 500),
    type: cleanText(first(projectInput.type, projectInput.category, projectInput.kind, root.projectType, "Software project"), "Project type", 60),
  };
  const schemaVersion = Number(first(root.schemaVersion, root.version, SCHEMA_VERSION));
  if (!Number.isInteger(schemaVersion) || schemaVersion !== SCHEMA_VERSION) {
    throw new Error("Schema version " + String(first(root.schemaVersion, root.version)) + " is not supported. This viewer accepts version " + SCHEMA_VERSION + ".");
  }
  return { schemaVersion, project, nodes, edges };
}

export function newNodeId(nodes) {
  const used = new Set(nodes.map((node) => node.id));
  let index = nodes.length + 1;
  while (used.has("component-" + index)) index += 1;
  return "component-" + index;
}

export function newEdgeId(edges) {
  const used = new Set(edges.map((edge) => edge.id));
  let index = edges.length + 1;
  while (used.has("connection-" + index)) index += 1;
  return "connection-" + index;
}




export function serializeGraphJson(graph, indentation = 2) {
  return JSON.stringify({ schemaVersion: SCHEMA_VERSION, project: graph.project, nodes: graph.nodes, edges: graph.edges }, null, indentation);
}

export function graphJsonByteLength(graph) {
  return new TextEncoder().encode(serializeGraphJson(graph, 2)).byteLength;
}

export function assertGraphJsonWithinLimit(graph, { baselineGraph = null, baselineText = null } = {}) {
  const serialized = serializeGraphJson(graph, 2);
  const bytes = new TextEncoder().encode(serialized).byteLength;
  const previous = baselineText ?? (baselineGraph ? serializeGraphJson(baselineGraph, 2) : null);
  const baselineBytes = previous === null ? null : new TextEncoder().encode(previous).byteLength;
  const unchanged = previous !== null && previous === serialized;
  if (bytes > MAX_IMPORT_BYTES && (baselineBytes === null || (!unchanged && bytes >= baselineBytes))) {
    throw new Error("This map's formatted JSON would exceed the 2 MiB import/export limit. Shorten optional details or reduce the map before saving.");
  }
  return bytes;
}

export function normalizeEditableGraph(input, { allowEmpty = true, baselineGraph = null } = {}) {
  const graph = normalizeGraph(input, { allowEmpty });
  assertGraphJsonWithinLimit(graph, { baselineGraph });
  return graph;
}
