import { layoutGraph, NODE_WIDTH, NODE_HEIGHT, nodeDimensions } from "./layout.js";
import { edgeGeometry, edgeRoutingLanes, graphBounds } from "./geometry.js";
import { chartCompactReadout, chartDescription, chartGeometry, chartPresentation, chartValueLabel } from "./charts.js";
import { serializeGraphJson } from "./schema.js";

function xmlSafeText(value) {
  let safe = "";
  for (const character of String(value ?? "")) {
    const point = character.codePointAt(0);
    if ((point < 0x20 && point !== 0x09 && point !== 0x0a && point !== 0x0d)
      || (point >= 0xd800 && point <= 0xdfff)
      || point === 0xfffe
      || point === 0xffff) safe += "\uFFFD";
    else safe += character;
  }
  return safe;
}
export function escapeXml(value) {
  return xmlSafeText(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const trimLabel = (value, max) => {
  const text = String(value ?? "");
  return text.length > max ? text.slice(0, max - 1) + "..." : text;
};
const PALETTES = {
  dark: { canvas: "#171916", card: "#252823", border: "#41483b", foreground: "#f0f2e8", muted: "#adb3a6", accent: "#deef52" },
  light: { canvas: "#d4d5cd", card: "#f4f5ee", border: "#bfc3b7", foreground: "#242721", muted: "#62665c", accent: "#c3d32c" },
};

function chartMarkup(chart, x = 15, y = 86) {
  const width = NODE_WIDTH - 30;
  const height = 42;
  const presentation = chartPresentation(chart);
  const geometry = chartGeometry(chart.values, { width, height, padding: 4, kind: presentation.kind });
  const label = chartDescription(chart);
  const parts = ['<g role="img" aria-label="' + escapeXml(label) + '" transform="translate(' + x + ' ' + y + ')">'];
  parts.push('<title>' + escapeXml(label) + '</title>');
  parts.push('<desc>' + escapeXml(presentation.context) + '</desc>');
  parts.push('<path d="M 0 ' + geometry.baselineY + ' H ' + width + '" fill="none" stroke="var(--chart-border)" stroke-width=".8"/>');
  if (presentation.kind === "bar") {
    for (const bar of geometry.bars) {
      parts.push('<rect x="' + bar.x + '" y="' + bar.y + '" width="' + bar.width + '" height="' + bar.height + '" rx="2" fill="var(--chart-accent)"><title>' + escapeXml(chartValueLabel(chart, bar.index)) + '</title></rect>');
    }
  } else {
    if (presentation.kind === "area") parts.push('<path d="' + geometry.areaPath + '" fill="var(--chart-accent)" fill-opacity=".2"/>');
    parts.push('<path d="' + geometry.linePath + '" fill="none" stroke="var(--chart-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>');
    for (const point of geometry.points) {
      parts.push('<circle cx="' + point.x + '" cy="' + point.y + '" r="2.2" fill="var(--chart-card)" stroke="var(--chart-accent)" stroke-width="1.2"><title>' + escapeXml(chartValueLabel(chart, point.index)) + '</title></circle>');
    }
  }
  const showCategoryStrip = chart.categories?.length === chart.values.length && chart.values.length <= 5;
  if (showCategoryStrip) {
    const xFor = presentation.kind === "bar"
      ? (index) => geometry.bars[index].centerX
      : (index) => geometry.points[index].x;
    chart.categories.forEach((category, index) => {
      const visibleLabel = chartCompactReadout(chart, index, geometry.width / chart.values.length, 6);
      parts.push('<text x="' + xFor(index) + '" y="54" text-anchor="middle" fill="var(--export-muted)" font-family="system-ui,sans-serif" font-size="6"><title>' + escapeXml(chartValueLabel(chart, index)) + '</title>' + escapeXml(visibleLabel) + '</text>');
    });
  }
  parts.push('</g>');
  return { markup: parts.join(""), presentation, showCategoryStrip };
}
function nodeDetailsDescription(node) {
  const parts = [node.description, node.details?.purpose && "Purpose: " + node.details.purpose, node.details?.operation && "How it works: " + node.details.operation];
  for (const [label, key] of [["Inputs", "inputs"], ["Outputs", "outputs"], ["Dependencies", "dependencies"], ["Evidence", "evidence"], ["Uncertainty", "uncertainty"]]) {
    const values = node.details?.[key];
    if (values?.length) parts.push(label + ": " + values.join("; "));
  }
  if (node.chart) parts.push("Chart: " + chartDescription(node.chart));
  if (node.source) parts.push("Source: " + node.source);
  return parts.filter(Boolean).join(". ") || node.type || "Architecture component";
}

export function buildSvg(graph, theme = "dark") {
  const palette = PALETTES[theme] || PALETTES.dark;
  const { positions, dimensions } = layoutGraph(graph);
  const bounds = graphBounds(graph, positions, dimensions);
  const padding = 30;
  const width = Math.max(320, Math.ceil(bounds.width + padding * 2));
  const height = Math.max(220, Math.ceil(bounds.height + padding * 2));
  const offsetX = padding - bounds.x;
  const offsetY = padding - bounds.y;
  const routingLanes = edgeRoutingLanes(graph.edges);
  const edgeMarkup = graph.edges.map((edge, index) => {
    const geometry = edgeGeometry(edge, index, positions, dimensions, routingLanes.get(index));
    if (!geometry) return "";
    const hasLabel = Boolean(String(edge.label || edge.type || "").trim());
    const sourceName = graph.nodes.find((node) => node.id === edge.source)?.label || edge.source;
    const targetName = graph.nodes.find((node) => node.id === edge.target)?.label || edge.target;
    const labelMarkup = hasLabel
      ? '<rect x="' + (geometry.labelX - geometry.labelWidth / 2) + '" y="' + (geometry.labelY - 10) + '" width="' + geometry.labelWidth + '" height="17" rx="8" fill="var(--export-card)" stroke="var(--export-border)"/>' +
        '<text x="' + geometry.labelX + '" y="' + (geometry.labelY + 2) + '" text-anchor="middle" fill="var(--export-muted)" font-family="system-ui,sans-serif" font-size="9">' + escapeXml(geometry.label) + '</text>'
      : "";
    return '<g><title>' + escapeXml(hasLabel ? geometry.fullLabel || geometry.label : "Unlabeled connection from " + sourceName + " to " + targetName) + '</title><path d="' + geometry.path + '" fill="none" stroke="var(--export-muted)" stroke-width="1.5"/>' + labelMarkup + '</g>';
  }).join("");
  const nodeMarkup = graph.nodes.map((node) => {
    const point = positions.get(node.id);
    const size = dimensions.get(node.id) || nodeDimensions(node);
    if (node.junction) {
      const aria = escapeXml("Branch junction, " + node.label);
      const description = escapeXml(nodeDetailsDescription(node));
      return '<g transform="translate(' + point.x + ' ' + point.y + ')" role="group" aria-label="' + aria + '"><title>Branch junction: ' + escapeXml(node.label) + '</title><desc>' + description + '</desc>' +
        '<circle cx="' + (size.width / 2) + '" cy="' + (size.height / 2) + '" r="14" fill="var(--export-card)" stroke="var(--export-border)" stroke-width="1.4"/>' +
        '<circle cx="0" cy="' + (size.height / 2) + '" r="4" fill="var(--export-canvas)" stroke="var(--export-border)" stroke-width="1"/>' +
        '<circle cx="' + size.width + '" cy="' + (size.height / 2) + '" r="4" fill="var(--export-canvas)" stroke="var(--export-border)" stroke-width="1"/>' +
        '<circle cx="' + (size.width / 2) + '" cy="' + (size.height / 2) + '" r="3" fill="' + palette.accent + '"/></g>';
    }
    const title = trimLabel(node.label, 25);
    const description = trimLabel(node.description || node.source || "", 34);
    const badgeX = NODE_WIDTH - 16;
    const badge = '<circle cx="' + badgeX + '" cy="15" r="7" fill="var(--export-canvas)" stroke="var(--export-border)"/><path d="M ' + (badgeX - 2) + ' 12.5 L ' + (badgeX + 2) + ' 15 L ' + (badgeX - 2) + ' 17.5 M ' + (badgeX - 1.5) + ' 12.5 L ' + (badgeX - 3.5) + ' 12.5 M ' + (badgeX - 1.5) + ' 17.5 L ' + (badgeX - 3.5) + ' 17.5" fill="none" stroke="var(--export-muted)" stroke-width=".8" stroke-linecap="round"/><circle cx="' + (badgeX - 4) + '" cy="12.5" r="1.1" fill="var(--export-muted)"/><circle cx="' + (badgeX + 3) + '" cy="15" r="1.1" fill="var(--export-muted)"/><circle cx="' + (badgeX - 4) + '" cy="17.5" r="1.1" fill="var(--export-muted)"/>';
    let interior = '<text x="14" y="21" fill="var(--export-muted)" font-family="system-ui,sans-serif" font-size="8" font-weight="700" letter-spacing=".8">' + escapeXml(trimLabel(String(node.type || "COMPONENT").toUpperCase(), 24)) + '</text>' + badge +
      '<text x="14" y="45" fill="var(--export-foreground)" font-family="system-ui,sans-serif" font-size="12" font-weight="650">' + escapeXml(title) + '</text>' +
      '<text x="14" y="66" fill="var(--export-muted)" font-family="system-ui,sans-serif" font-size="9">' + escapeXml(description) + '</text>';
    if (node.chart) {
      interior += '<text x="14" y="80" fill="var(--export-foreground)" font-family="system-ui,sans-serif" font-size="8" font-weight="600">' + escapeXml(trimLabel(node.chart.label, 27)) + '</text>';
      if (node.chart.unit) interior += '<text x="' + (NODE_WIDTH - 14) + '" y="80" text-anchor="end" fill="var(--export-muted)" font-family="system-ui,sans-serif" font-size="7">' + escapeXml(trimLabel(node.chart.unit, 12)) + '</text>';
      const exportedChart = chartMarkup(node.chart);
      interior += exportedChart.markup;
      const contextY = exportedChart.showCategoryStrip ? 154 : 136;
      const evidenceY = exportedChart.showCategoryStrip ? 169 : 151;
      interior += '<text x="14" y="' + contextY + '" fill="var(--export-muted)" font-family="system-ui,sans-serif" font-size="6.5"><title>' + escapeXml(exportedChart.presentation.context) + '</title>' + escapeXml(trimLabel(exportedChart.presentation.context, 31)) + '</text>';
      interior += '<text x="14" y="' + evidenceY + '" fill="var(--export-muted)" font-family="system-ui,sans-serif" font-size="7"><title>' + escapeXml(node.chart.evidence) + '</title>' + escapeXml(trimLabel("Evidence: " + node.chart.evidence, 37)) + '</text>';
      if (node.source) interior += '<text x="14" y="' + (exportedChart.showCategoryStrip ? 187 : 166) + '" fill="var(--export-muted)" font-family="ui-monospace,monospace" font-size="7">' + escapeXml(trimLabel(node.source, 31)) + '</text>';
    } else {
      interior += '<text x="14" y="91" fill="var(--export-muted)" font-family="ui-monospace,monospace" font-size="8">' + escapeXml(trimLabel(node.source || "", 32)) + '</text>';
    }
    return '<g transform="translate(' + point.x + ' ' + point.y + ')" role="group" aria-label="' + escapeXml(node.label + ", " + node.type) + '" style="--chart-accent:' + palette.accent + ';--chart-border:' + palette.border + ';--chart-card:' + palette.card + '">' +
      '<title>' + escapeXml(node.label) + '</title><desc>' + escapeXml(nodeDetailsDescription(node)) + '</desc>' +
      '<rect width="' + size.width + '" height="' + size.height + '" rx="18" fill="var(--export-card)" stroke="var(--export-border)" stroke-width="1.2"/>' + interior + '</g>';
  }).join("");
  const title = escapeXml(graph.project.name || "Architecture map");
  const description = escapeXml(graph.project.description || graph.project.type || "Software architecture");
  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-labelledby="atlas-title atlas-desc" style="--export-canvas:' + palette.canvas + ';--export-card:' + palette.card + ';--export-border:' + palette.border + ';--export-foreground:' + palette.foreground + ';--export-muted:' + palette.muted + '">' +
    '<title id="atlas-title">' + title + '</title><desc id="atlas-desc">' + description + '</desc>' +
    '<rect width="100%" height="100%" fill="var(--export-canvas)"/><g transform="translate(' + offsetX + ' ' + offsetY + ')">' + edgeMarkup + nodeMarkup + '</g></svg>';
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.position = "fixed";
  anchor.style.left = "-10000px";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(text, filename, mime = "text/plain;charset=utf-8") {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

export function safeFilename(value) {
  const result = String(value || "architecture").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (result || "architecture").slice(0, 80);
}

export function exportJson(graph) {
  downloadText(serializeGraphJson(graph), safeFilename(graph.project.name) + ".json", "application/json;charset=utf-8");
}

export function safeRasterDimensions(width, height) {
  const originalWidth = Math.max(1, Number.isFinite(Number(width)) ? Math.floor(Number(width)) : 1);
  const originalHeight = Math.max(1, Number.isFinite(Number(height)) ? Math.floor(Number(height)) : 1);
  const scale = Math.min(1, 8192 / originalWidth, 8192 / originalHeight, Math.sqrt(24000000 / (originalWidth * originalHeight)));
  return { width: Math.max(1, Math.floor(originalWidth * scale)), height: Math.max(1, Math.floor(originalHeight * scale)) };
}

export async function svgToPngBlob(svgText) {
  const image = new Image();
  const url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("The browser could not render this SVG as an image."));
      image.src = url;
    });
    const originalWidth = image.naturalWidth || 1;
    const originalHeight = image.naturalHeight || 1;
    const { width, height } = safeRasterDimensions(originalWidth, originalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas export is not available in this browser.");
    context.fillStyle = "#171916";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The browser could not create a PNG image.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function copyPng(blob) {
  if (!navigator.clipboard || typeof navigator.clipboard.write !== "function" || typeof ClipboardItem === "undefined") {
    throw new Error("Image clipboard access is not available here.");
  }
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
