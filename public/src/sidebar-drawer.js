// Off-canvas navigation blocks the map until it is dismissed; desktop stays unchanged.
export function createSidebarDrawer({ sidebar, main, trigger, backdrop, closeButton, onChange = () => {} }) {
  const doc = sidebar.ownerDocument;
  const narrow = doc.defaultView.matchMedia("(max-width: 820px)");
  let opened = false;
  function updateLabel() {
    const name = sidebar.dataset.sharedViewer === "true" ? "Atlas sidebar" : "projects";
    trigger.setAttribute("aria-label", (opened ? "Close " : "Open ") + name);
    trigger.setAttribute("aria-expanded", String(opened));
  }
  function setOpen(next, { restoreFocus = false } = {}) {
    const wasInside = sidebar.contains(doc.activeElement);
    const wasOpen = opened;
    opened = Boolean(next && narrow.matches);
    sidebar.classList.toggle("open", opened);
    backdrop.classList.toggle("is-visible", opened);
    doc.documentElement.classList.toggle("sidebar-drawer-open", opened);
    main.inert = opened;
    sidebar.inert = narrow.matches && !opened;
    if (narrow.matches) sidebar.setAttribute("aria-hidden", String(!opened));
    else sidebar.removeAttribute("aria-hidden");
    if (opened) { sidebar.setAttribute("role", "dialog"); sidebar.setAttribute("aria-modal", "true"); }
    else { sidebar.removeAttribute("role"); sidebar.removeAttribute("aria-modal"); }
    updateLabel();
    if (opened) closeButton.focus({ preventScroll: true });
    else if ((restoreFocus || wasInside) && !doc.querySelector("dialog[open]")) {
      const target = narrow.matches ? trigger : wasOpen ? sidebar.querySelector("a[href]") : null;
      target?.focus({ preventScroll: true });
    }
    onChange();
  }
  trigger.addEventListener("click", () => setOpen(!opened, { restoreFocus: opened }));
  closeButton.addEventListener("click", () => setOpen(false, { restoreFocus: true }));
  backdrop.addEventListener("click", () => setOpen(false, { restoreFocus: true }));
  sidebar.addEventListener("click", () => setTimeout(() => {
    const dialog = doc.querySelector("dialog[open]");
    if (!opened || !dialog) return;
    setOpen(false);
    dialog.addEventListener("close", () => setTimeout(() => {
      if (narrow.matches && !opened && !doc.querySelector("dialog[open]") &&
          (doc.activeElement === doc.body || sidebar.contains(doc.activeElement))) trigger.focus({ preventScroll: true });
    }, 0), { once: true });
  }, 0), true);
  doc.addEventListener("keydown", event => {
    if (!opened || event.defaultPrevented || doc.querySelector("dialog[open]")) return;
    if (event.key === "Escape") { event.preventDefault(); setOpen(false, { restoreFocus: true }); }
    else if (event.key === "Tab") {
      const items = [...sidebar.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]')]
        .filter(item => item.tabIndex >= 0 && item.getClientRects().length && !item.closest("[hidden], [inert]"));
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first?.focus(); }
      else if (!sidebar.contains(doc.activeElement)) { event.preventDefault(); first?.focus(); }
    }
  });
  narrow.addEventListener("change", () => setOpen(false));
  setOpen(false);
  return { setOpen, updateLabel };
}
