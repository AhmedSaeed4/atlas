// Expanded graph viewing stays in the page, so menus and dialogs keep working.
export function createGraphFullscreen({ toggle, beforeEnter = () => {}, captureView = () => null, onChange = () => {} }) {
  const doc = toggle.ownerDocument;
  const win = doc.defaultView;
  const root = doc.documentElement;
  const label = toggle.querySelector("[data-fullscreen-label]");
  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
  let active = false, requested = false, previous = null;
  let transition = null, revision = 0;

  function apply(next) {
    if (next === active) return;
    if (next) {
      previous = { x: win.scrollX, y: win.scrollY, view: captureView() };
      beforeEnter();
    }
    active = next;
    root.classList.toggle("graph-fullscreen", active);
    toggle.setAttribute("aria-pressed", String(active));
    toggle.setAttribute("aria-label", active ? "Exit full screen graph" : "Enter full screen graph");
    toggle.title = active ? "Exit full screen (Esc)" : "Expand graph to full screen";
    label.textContent = active ? "Exit full screen" : "Full screen";
    onChange(active, previous?.view);
    if (!active) {
      win.scrollTo(previous.x, previous.y);
      previous = null;
    }
    toggle.focus({ preventScroll: true });
  }

  function setActive(next) {
    next = Boolean(next);
    if (next === requested) return;
    requested = next;
    const token = ++revision;
    transition?.skipTransition();
    transition = null;
    const update = () => { if (token === revision) apply(next); };
    const clean = () => {
      if (token !== revision) return;
      transition = null;
      root.classList.remove("graph-fullscreen-transition");
    };
    if (reduced.matches || doc.hidden || typeof doc.startViewTransition !== "function") {
      update(); clean(); return;
    }
    root.classList.add("graph-fullscreen-transition");
    try {
      const current = doc.startViewTransition(update);
      transition = current;
      current.ready.catch(() => {});
      current.updateCallbackDone.catch(() => {
        if (token === revision) { requested = active; clean(); }
      });
      current.finished.then(clean, clean);
    } catch {
      update(); clean();
    }
  }

  function handleKeydown(event) {
    if (!requested || event.key !== "Escape" || event.defaultPrevented || event.isComposing) return false;
    if (doc.querySelector("dialog[open]")) return false;
    // Interactive popovers use Escape first; passive status toasts never block exit.
    for (const popover of doc.querySelectorAll("[popover]:not(.toast-region)")) {
      try { if (popover.matches(":popover-open")) return false; } catch {}
    }
    event.preventDefault();
    setActive(false);
    return true;
  }

  toggle.addEventListener("click", () => setActive(!requested));
  win.addEventListener("resize", () => transition?.skipTransition(), { passive: true });
  reduced.addEventListener("change", () => { if (reduced.matches) transition?.skipTransition(); });
  doc.addEventListener("visibilitychange", () => { if (doc.hidden) transition?.skipTransition(); });
  return Object.freeze({ setActive, handleKeydown, isActive: () => active });
}
