export function createRevisionGate() {
  let revision = 0;
  return {
    begin() { revision += 1; return revision; },
    invalidate() { revision += 1; return revision; },
    isCurrent(token) { return token === revision; },
  };
}

export async function readImportSource({ tab, pastedText, file, readFile, token, isCurrent }) {
  if (tab !== "file") {
    return typeof isCurrent === "function" && !isCurrent(token) ? null : String(pastedText ?? "");
  }
  if (!file) throw new Error("Choose a JSON file or switch to Paste JSON.");
  const source = await readFile(file);
  return typeof isCurrent === "function" && !isCurrent(token) ? null : source;
}

export function fitScaleForBounds(bounds, viewport) {
  const width = Math.max(1, Number.isFinite(Number(bounds?.width)) ? Number(bounds.width) : 1);
  const height = Math.max(1, Number.isFinite(Number(bounds?.height)) ? Number(bounds.height) : 1);
  const viewportWidth = Math.max(1, Number.isFinite(Number(viewport?.width)) ? Number(viewport.width) : 1);
  const viewportHeight = Math.max(1, Number.isFinite(Number(viewport?.height)) ? Number(viewport.height) : 1);
  const fit = Math.min((viewportWidth - 86) / width, (viewportHeight - 100) / height);
  return Number.isFinite(fit) ? Math.min(1.25, Math.max(0.001, fit)) : 0.001;
}

export function shouldSaveOnEnter(event) {
  const target = event?.target;
  const tagName = String(target?.tagName || "").toUpperCase();
  return event?.key === "Enter"
    && !event.isComposing
    && event.keyCode !== 229
    && !event.repeat
    && !event.altKey
    && !event.ctrlKey
    && !event.metaKey
    && !event.shiftKey
    && tagName !== "TEXTAREA"
    && !target?.isContentEditable;
}
export function removeProjectSnapshot(projects, context, activeId) {
  if (!Array.isArray(projects) || typeof context?.projectId !== "string" || !context.projectRef || !context.graphRef) return null;
  const project = projects.find((item) => item === context.projectRef && item.id === context.projectId && item.graph === context.graphRef);
  if (!project) return null;
  const remaining = projects.filter((item) => item !== project);
  const wasActive = activeId === project.id;
  return {
    project,
    projects: remaining,
    activeId: wasActive ? (remaining[0]?.id || "") : activeId,
    wasActive,
  };
}

export function isFlowExampleRoute(search, hash) {
  return !String(hash || "") && new URLSearchParams(String(search || "")).get("example") === "flow";
}

export function consumeFlowExampleQuery(search) {
  const current = String(search || "");
  const params = new URLSearchParams(current);
  if (params.get("example") !== "flow") return current;
  params.delete("example");
  const remainder = params.toString();
  return remainder ? "?" + remainder : "";
}
export function createShareLoadTracker() {
  let revision = 0;
  let pending = null;
  const isMapFragment = (fragment) => typeof fragment === "string" && fragment.startsWith("#map=");
  return {
    begin(fragment) {
      const request = { revision: ++revision, fragment: String(fragment || "") };
      pending = isMapFragment(request.fragment) ? request : null;
      return request;
    },
    isCurrent(request, currentHash) {
      return Boolean(request) && request.revision === revision && request.fragment === currentHash;
    },
    finish(request) {
      if (pending?.revision === request?.revision) pending = null;
    },
    cancel() {
      revision += 1;
      pending = null;
    },
    interruptPending() {
      const fragment = pending?.revision === revision ? pending.fragment : "";
      if (!fragment) return null;
      revision += 1;
      pending = null;
      return { revision, fragment, transferred: false, consumed: false };
    },
    transfer(interruption) {
      if (!interruption || interruption.revision !== revision || interruption.transferred || interruption.consumed) return null;
      interruption.transferred = true;
      return interruption;
    },
    shouldResume(interruption, currentHash) {
      if (!interruption || interruption.consumed) return false;
      interruption.consumed = true;
      return interruption.revision === revision
        && interruption.fragment === currentHash
        && isMapFragment(interruption.fragment);
    },
  };
}
