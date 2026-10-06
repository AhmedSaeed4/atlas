export const INSPECTOR_WIDTH_KEY = "project-atlas-inspector-width-v1";
export const INSPECTOR_EXPANDED_KEY = "project-atlas-inspector-expanded-v1";
export const INSPECTOR_MIN_WIDTH = 320;
export const INSPECTOR_DEFAULT_WIDTH = 360;
export const INSPECTOR_MAX_WIDTH = 760;
export const INSPECTOR_MIN_STAGE_WIDTH = 220;
export const INSPECTOR_RESIZE_HANDLE_WIDTH = 8;

export function inspectorWidthLimits(workspaceWidth) {
  const available = Number.isFinite(workspaceWidth) && workspaceWidth > 0 ? workspaceWidth : INSPECTOR_DEFAULT_WIDTH + INSPECTOR_MIN_STAGE_WIDTH + INSPECTOR_RESIZE_HANDLE_WIDTH;
  return {
    min: INSPECTOR_MIN_WIDTH,
    max: Math.max(INSPECTOR_MIN_WIDTH, Math.min(INSPECTOR_MAX_WIDTH, Math.floor(available - INSPECTOR_MIN_STAGE_WIDTH - INSPECTOR_RESIZE_HANDLE_WIDTH))),
  };
}

export function clampInspectorWidth(value, limits = inspectorWidthLimits(INSPECTOR_DEFAULT_WIDTH + INSPECTOR_MIN_STAGE_WIDTH + INSPECTOR_RESIZE_HANDLE_WIDTH)) {
  const numeric = Number(value);
  const width = Number.isFinite(numeric) ? numeric : INSPECTOR_DEFAULT_WIDTH;
  return Math.round(Math.min(limits.max, Math.max(limits.min, width)));
}

function resolveStorage(storageProvider) {
  return typeof storageProvider === "function" ? storageProvider() : storageProvider;
}

export function readInspectorWidthPreference(storageProvider) {
  try {
    const saved = resolveStorage(storageProvider)?.getItem(INSPECTOR_WIDTH_KEY);
    return saved === null || saved === undefined || saved === "" || !Number.isFinite(Number(saved))
      ? INSPECTOR_DEFAULT_WIDTH
      : clampInspectorWidth(Number(saved), { min: INSPECTOR_MIN_WIDTH, max: INSPECTOR_MAX_WIDTH });
  } catch {
    return INSPECTOR_DEFAULT_WIDTH;
  }
}

export function readInspectorWidth(storageProvider, workspaceWidth) {
  return clampInspectorWidth(readInspectorWidthPreference(storageProvider), inspectorWidthLimits(workspaceWidth));
}

export function readInspectorExpanded(storageProvider) {
  try {
    return resolveStorage(storageProvider)?.getItem(INSPECTOR_EXPANDED_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeInspectorExpanded(storageProvider, expanded) {
  try {
    const storage = resolveStorage(storageProvider);
    if (!storage || typeof storage.setItem !== "function") return false;
    storage.setItem(INSPECTOR_EXPANDED_KEY, expanded ? "true" : "false");
    return true;
  } catch {
    return false;
  }
}

export function writeInspectorWidth(storageProvider, value, workspaceWidth) {
  try {
    const storage = resolveStorage(storageProvider);
    if (!storage || typeof storage.setItem !== "function") return false;
    const width = clampInspectorWidth(value, inspectorWidthLimits(workspaceWidth));
    storage.setItem(INSPECTOR_WIDTH_KEY, String(width));
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  })[character]);
}

function markdownLabel(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\\[\]]/g, "\\$&");
}

export function namedLinkPayload(projectName, url) {
  const name = String(projectName || "Software project")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "Software project";
  let parsedUrl;
  try { parsedUrl = new URL(String(url || "")); } catch { throw new Error("Named links require an absolute HTTP or HTTPS URL."); }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new Error("Named links require an absolute HTTP or HTTPS URL.");
  const href = parsedUrl.href;
  const address = href.replace(/[<>\s"\\]/g, (character) => encodeURIComponent(character));
  const label = "Open " + name + " graph";
  const markdown = "[" + markdownLabel(label) + "](<" + address + ">)";
  const html = '<a href="' + escapeHtml(href) + '">' + escapeHtml(label) + "</a>";
  return { name, label, markdown, html };
}

export async function writeNamedLinkClipboard(payload, {
  clipboard = globalThis.navigator?.clipboard,
  ClipboardItemCtor = globalThis.ClipboardItem,
  BlobCtor = globalThis.Blob,
  writePlain,
  isCurrent = () => true,
} = {}) {
  if (!isCurrent()) return "stale";
  if (clipboard && typeof clipboard.write === "function" && typeof ClipboardItemCtor === "function" && typeof BlobCtor === "function") {
    try {
      const item = new ClipboardItemCtor({
        "text/html": new BlobCtor([payload.html], { type: "text/html" }),
        "text/plain": new BlobCtor([payload.markdown], { type: "text/plain" }),
      });
      await clipboard.write([item]);
      return isCurrent() ? "rich" : "stale";
    } catch {}
  }
  if (!isCurrent()) return "stale";
  if (typeof writePlain === "function") {
    await writePlain(payload.markdown);
    return isCurrent() ? "markdown" : "stale";
  }
  throw new Error("Rich and Markdown clipboard access are unavailable.");
}

export function isNamedLinkSnapshotCurrent(snapshot, current) {
  return Boolean(snapshot && current
    && snapshot.dialogSequence === current.dialogSequence
    && snapshot.dialogOpen
    && current.dialogOpen
    && snapshot.projectId === current.projectId
    && snapshot.projectName === current.projectName
    && snapshot.url === current.url);
}
