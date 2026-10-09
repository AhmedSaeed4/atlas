export const NODE_TYPE_PRESETS = Object.freeze([
  "API", "Frontend", "Backend", "Service", "Database", "Queue", "Job", "Module", "File", "External",
  "Agent", "Authentication", "Cache", "CLI", "Desktop app", "Event bus", "Function", "Infrastructure",
  "IPC", "Library", "Mobile app", "Storage",
]);

export function selectNodeTypeEditor(value, presets = NODE_TYPE_PRESETS) {
  const type = String(value ?? "");
  return presets.includes(type) ? { preset: type, custom: "" } : { preset: "Custom", custom: type };
}

export function resolveNodeType(preset, custom, presets = NODE_TYPE_PRESETS) {
  const selected = String(preset ?? "").trim();
  const type = selected === "Custom" ? String(custom ?? "").trim() : selected;
  if (!type) throw new Error("Choose a component type or enter a custom type.");
  if (type.length > 60) throw new Error("Component type must be 60 characters or fewer.");
  if (selected !== "Custom" && !presets.includes(selected)) throw new Error("Choose a listed type or Custom.");
  return type;
}

const lines = (value) => String(value ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

export function buildChartFromEditor(input) {
  if (!input?.enabled) return null;
  const label = String(input.label ?? "").trim();
  const kind = String(input.kind ?? "").trim();
  const evidence = String(input.evidence ?? "").trim();
  const unit = String(input.unit ?? "").trim();
  const order = String(input.order ?? "").trim();
  const rawValues = lines(input.values);
  const categories = lines(input.categories);
  if (!label) throw new Error("Chart measurement label is required.");
  if (label.length > 80) throw new Error("Chart label must be 80 characters or fewer.");
  if (!["bar", "line", "area"].includes(kind)) throw new Error("Choose a bar, line, or area chart.");
  if (rawValues.length < 2 || rawValues.length > 32) throw new Error("Enter 2 to 32 numeric values.");
  const values = rawValues.map((text, index) => {
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(text)) throw new Error("Value " + (index + 1) + " must be a number.");
    const value = Number(text);
    if (!Number.isFinite(value) || Math.abs(value) > 1_000_000_000_000) throw new Error("Each value must be finite and between -1000000000000 and 1000000000000.");
    return value;
  });
  if (!evidence) throw new Error("Evidence for the chart values is required.");
  if (evidence.length > 240) throw new Error("Chart evidence must be 240 characters or fewer.");
  if (unit.length > 24) throw new Error("Chart unit must be 24 characters or fewer.");
  if (kind === "bar" && categories.length !== values.length) throw new Error("A bar chart needs one category label for each value.");
  if (categories.length && categories.length !== values.length) throw new Error("Enter one category label for each value, or clear categories for a legacy series.");
  if (categories.some((category) => category.length > 80)) throw new Error("Each chart category must be 80 characters or fewer.");
  if (categories.length && (kind === "line" || kind === "area") && !order) throw new Error("A line or area chart needs an explanation of its order.");
  if (order.length > 160) throw new Error("Chart order explanation must be 160 characters or fewer.");
  if ((kind === "line" || kind === "area") && !categories.length) throw new Error("New line and area charts need labeled, ordered categories.");
  const chart = { label, kind, values, evidence };
  if (unit) chart.unit = unit;
  if (categories.length) chart.categories = categories;
  if (order) chart.order = order;
  return chart;
}

export function chartEditorMatchesChart(chart, input) {
  if (!chart || !input?.enabled) return false;
  const editorValues = lines(input.values).map(Number);
  const editorCategories = lines(input.categories);
  return chart.label === String(input.label ?? "").trim()
    && chart.kind === String(input.kind ?? "").trim()
    && chart.evidence === String(input.evidence ?? "").trim()
    && (chart.unit || "") === String(input.unit ?? "").trim()
    && (chart.order || "") === String(input.order ?? "").trim()
    && JSON.stringify(chart.values) === JSON.stringify(editorValues)
    && JSON.stringify(chart.categories || []) === JSON.stringify(editorCategories);
}