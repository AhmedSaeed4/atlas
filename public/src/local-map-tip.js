// A creation-only reminder: restored library entries have already passed creation.
export function initLocalMapTip({ element, messageElement, okayButton, getAnchor, existingProjectIds = [] }) {
  const presented = new Set(existingProjectIds);
  let projectId = "";
  let message = "";
  const hide = () => { element.hidden = true; };
  const clear = () => { projectId = ""; message = ""; hide(); };
  function refresh() {
    const anchor = projectId ? getAnchor(projectId) : null;
    if (!anchor) { hide(); return; }
    const rect = anchor.getBoundingClientRect();
    const listRect = anchor.parentElement.getBoundingClientRect();
    if (rect.right <= 0 || rect.left >= innerWidth || rect.bottom <= listRect.top || rect.top >= listRect.bottom) {
      hide(); return;
    }
    const wasHidden = element.hidden;
    messageElement.textContent = message;
    element.hidden = false;
    presented.add(projectId);
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const gap = 12;
    const margin = 12;
    const clamp = (value, min, max) => Math.max(min, Math.min(value, Math.max(min, max)));
    let left;
    let top;
    let side;
    let arrow;
    if (rect.right + gap + width <= innerWidth - margin) {
      side = "left";
      left = rect.right + gap;
      top = clamp(rect.top + rect.height / 2 - height / 2, margin, innerHeight - height - margin);
      arrow = clamp(rect.top + rect.height / 2 - top, 18, height - 18);
    } else {
      left = clamp(rect.left, margin, innerWidth - width - margin);
      const below = rect.bottom + gap;
      side = below + height <= innerHeight - margin ? "top" : "bottom";
      top = side === "top" ? below : rect.top - gap - height;
      top = clamp(top, margin, innerHeight - height - margin);
      arrow = clamp(rect.left + rect.width / 2 - left, 18, width - 18);
    }
    element.dataset.arrowSide = side;
    element.style.left = left + "px";
    element.style.top = top + "px";
    element.style.setProperty("--tip-arrow", arrow + "px");
    if (wasHidden) element.dataset.entering = "true";
  }
  function dismiss() {
    if (!projectId) return;
    presented.add(projectId);
    const anchor = getAnchor(projectId);
    const restoreFocus = element.contains(document.activeElement);
    clear();
    if (restoreFocus) anchor?.querySelector(".project-row-open")?.focus({ preventScroll: true });
  }
  okayButton.addEventListener("click", dismiss);
  element.addEventListener("animationend", () => { delete element.dataset.entering; });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !element.hidden) dismiss();
  });
  window.addEventListener("pagehide", clear);
  window.addEventListener("resize", refresh, { passive: true });
  document.addEventListener("scroll", refresh, { passive: true, capture: true });
  return Object.freeze({
    show(id, text) {
      const nextId = String(id || "");
      if (!nextId || (nextId !== projectId && presented.has(nextId))) { clear(); return; }
      projectId = nextId;
      message = String(text || "");
      refresh();
    },
    hide: clear,
    refresh,
  });
}
