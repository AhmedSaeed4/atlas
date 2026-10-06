import { LIMITS } from "./schema.js";

const svgNS = "http://www.w3.org/2000/svg";
const chartNode = (tag, attributes = {}) => {
  const node = document.createElementNS(svgNS, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
  return node;
};
const finiteChartValues = (values) => {
  if (!Array.isArray(values) || values.length < 2 || values.length > LIMITS.chartPoints) {
    throw new Error("A chart needs 2 to " + LIMITS.chartPoints + " numeric values.");
  }
  for (const value of values) {
    if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > LIMITS.chartMagnitude) {
      throw new Error("Chart values must be finite numbers within the viewer limit.");
    }
  }
  return values;
};
const round = (value) => Math.round(value * 100) / 100;

export function chartPointLabel(chart, index) {
  return chart.categories?.[index] || "Unlabeled point " + String(index + 1).padStart(2, "0");
}
export function chartValueLabel(chart, index) {
  return chartPointLabel(chart, index) + ": " + String(chart.values[index]) + (chart.unit ? " " + chart.unit : "");
}
export function compactChartValue(value, maxCharacters = Infinity) {
  const magnitude = Math.abs(value);
  let formatted = String(value);
  for (const [threshold, suffix] of [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "k"]]) {
    if (magnitude < threshold) continue;
    const scaled = value / threshold;
    formatted = String(Number(scaled.toPrecision(3))) + suffix;
    break;
  }
  if (formatted.length <= maxCharacters) return formatted;
  if (!Number.isFinite(value) || maxCharacters < 2) return "";
  for (let precision = 3; precision >= 1; precision -= 1) {
    const rounded = Number(value.toPrecision(precision));
    const significant = "~" + String(rounded);
    if (significant.length <= maxCharacters) return significant;
    const exponential = "~" + value.toExponential(precision - 1);
    if (exponential.length <= maxCharacters) return exponential;
  }
  return "";
}
export function chartCompactReadout(chart, index, slotWidth, fontSize = 6) {
  const category = chartPointLabel(chart, index);
  const characterWidth = Math.max(1, fontSize * .54);
  const characterCapacity = Math.max(0, Math.floor(Math.max(0, slotWidth) / characterWidth));
  const minimumCategory = Math.min(3, category.length);
  const valueBudget = characterCapacity - minimumCategory - 1;
  if (valueBudget < 1) return "";
  const value = compactChartValue(chart.values[index], valueBudget);
  if (!value) return "";
  const categoryBudget = characterCapacity - value.length - 1;
  if (categoryBudget < 1) return "";
  const visibleCategory = category.length > categoryBudget
    ? (categoryBudget === 1 ? category.slice(0, 1) : category.slice(0, categoryBudget - 1) + ".")
    : category;
  return visibleCategory + " " + value;
}
export function chartPresentation(chart) {
  const labeled = Array.isArray(chart.categories) && chart.categories.length === chart.values.length;
  if (!labeled) return {
    kind: "bar",
    legacy: true,
    context: "Legacy chart: category labels and ordering were not supplied. Values appear as separate bars, with no implied trend.",
  };
  if (chart.kind === "bar") return { kind: "bar", legacy: false, context: "Independent categories; bars are not connected." };
  const order = String(chart.order || "the supplied sequence").replace(/[.!?]+$/, "");
  return { kind: chart.kind, legacy: false, context: "Ordered by " + order + "." };
}
export function chartDescription(chart) {
  const presentation = chartPresentation(chart);
  return chart.label + ". " + presentation.context + " "
    + chart.values.map((_, index) => chartValueLabel(chart, index)).join("; ")
    + (chart.unit ? ". Unit: " + chart.unit : "") + ". Evidence: " + chart.evidence;
}

export function chartGeometry(values, { width = 220, height = 58, padding = 5, kind = "line" } = {}) {
  const series = finiteChartValues(values);
  if (![width, height, padding].every(Number.isFinite) || width <= padding * 2 || height <= padding * 2 || padding < 0) {
    throw new Error("Chart dimensions must be finite and leave room for the series.");
  }
  let minimum = Math.min(0, ...series);
  let maximum = Math.max(0, ...series);
  if (minimum === maximum) {
    const spread = Math.max(Math.abs(minimum) * 0.08, 1);
    minimum -= spread;
    maximum += spread;
  }
  const range = maximum - minimum;
  const xSpan = width - padding * 2;
  const ySpan = height - padding * 2;
  const yFor = (value) => round(padding + (maximum - value) / range * ySpan);
  const baselineY = yFor(0);
  if (kind === "bar") {
    const slotWidth = xSpan / series.length;
    const gap = Math.min(4, slotWidth * .22);
    const barWidth = Math.max(.5, slotWidth - gap);
    const bars = series.map((value, index) => {
      const valueY = yFor(value);
      return {
        index, value,
        x: round(padding + index * slotWidth + (slotWidth - barWidth) / 2),
        y: Math.min(valueY, baselineY),
        width: round(barWidth),
        height: Math.max(.7, round(Math.abs(valueY - baselineY))),
        centerX: round(padding + (index + .5) * slotWidth),
      };
    });
    return { points: bars.map((bar) => ({ index: bar.index, value: bar.value, x: bar.centerX, y: bar.y })), bars, linePath: "", areaPath: "", baselineY, minimum: Math.min(...series), maximum: Math.max(...series), width, height };
  }
  const points = series.map((value, index) => ({
    index,
    value,
    x: round(padding + index / (series.length - 1) * xSpan),
    y: yFor(value),
  }));
  const linePath = points.map((point, index) => (index ? "L " : "M ") + point.x + " " + point.y).join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const areaPath = "M " + first.x + " " + baselineY + " " + points.map((point) => "L " + point.x + " " + point.y).join(" ") + " L " + last.x + " " + baselineY + " Z";
  return { points, bars: [], linePath, areaPath, baselineY, minimum: Math.min(...series), maximum: Math.max(...series), width, height };
}

function htmlChartUnit(unit) {
  const node = document.createElement("span");
  node.className = "chart-unit";
  node.textContent = unit;
  return node;
}
export function createChartFigure(chart) {
  const presentation = chartPresentation(chart);
  const geometry = chartGeometry(chart.values, { kind: presentation.kind });
  const figure = document.createElement("figure");
  figure.className = "architecture-chart";
  const caption = document.createElement("figcaption");
  caption.className = "chart-caption";
  const title = document.createElement("strong");
  title.className = "chart-title";
  title.textContent = chart.label;
  const kind = document.createElement("span");
  kind.className = "chart-kind";
  kind.textContent = presentation.legacy ? "Legacy values" : presentation.kind === "bar" ? "Categories" : presentation.kind === "area" ? "Ordered area" : "Ordered line";
  caption.append(title, kind);
  if (chart.unit) caption.append(htmlChartUnit(chart.unit));

  const svg = chartNode("svg", {
    class: "chart-svg",
    viewBox: "0 0 " + geometry.width + " " + geometry.height,
    role: "img",
    "aria-label": chartDescription(chart),
  });
  const description = chartNode("desc");
  description.textContent = presentation.context;
  svg.append(description);
  const baseline = chartNode("path", { class: "chart-baseline", d: "M 0 " + geometry.baselineY + " H " + geometry.width });
  svg.append(baseline);
  if (presentation.kind === "bar") {
    for (const bar of geometry.bars) {
      const rectangle = chartNode("rect", { class: "chart-bar", x: bar.x, y: bar.y, width: bar.width, height: bar.height, rx: 2 });
      const titleNode = chartNode("title");
      titleNode.textContent = chartValueLabel(chart, bar.index);
      rectangle.append(titleNode);
      svg.append(rectangle);
    }
  } else {
    if (presentation.kind === "area") svg.append(chartNode("path", { class: "chart-area", d: geometry.areaPath }));
    svg.append(chartNode("path", { class: "chart-line", d: geometry.linePath }));
    for (const point of geometry.points) {
      const marker = chartNode("circle", { class: "chart-marker", cx: point.x, cy: point.y, r: 2.7, tabindex: 0, "aria-label": chartValueLabel(chart, point.index) });
      const titleNode = chartNode("title");
      titleNode.textContent = chartValueLabel(chart, point.index);
      marker.append(titleNode);
      svg.append(marker);
    }
  }

  const context = document.createElement("p");
  context.className = "chart-context";
  context.textContent = presentation.context;
  const evidence = document.createElement("p");
  evidence.className = "chart-evidence";
  evidence.textContent = "Evidence: " + chart.evidence;
  const details = document.createElement("details");
  details.className = "chart-readout";
  const summary = document.createElement("summary");
  summary.textContent = "Show categories and values";
  const list = document.createElement("ol");
  for (let index = 0; index < chart.values.length; index += 1) {
    const item = document.createElement("li");
    item.textContent = chartValueLabel(chart, index);
    list.append(item);
  }
  details.append(summary, list);
  details.open = chart.values.length <= 8;
  figure.append(caption, svg, context, evidence, details);
  return figure;
}
