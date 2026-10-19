import { searchComponents } from "./graph-exploration.js";
const node = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};
export function initComponentFinder({
  input,
  panel,
  getGraph,
  getFilters = () => ({}),
  onChoose,
}) {
  let results = [],
    active = 0,
    open = false;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-controls", panel.id);
  input.setAttribute("aria-expanded", "false");
  function close() {
    open = false;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    try {
      panel.hidePopover();
    } catch {}
    panel.hidden = true;
  }
  function highlight() {
    const options = [...panel.querySelectorAll("[role=option]")];
    for (let index = 0; index < options.length; index++)
      options[index].setAttribute("aria-selected", String(index === active));
    if (options[active]) {
      input.setAttribute("aria-activedescendant", options[active].id);
      options[active].scrollIntoView({ block: "nearest" });
    }
  }
  function choose(index) {
    const item = results[index];
    if (!item) return;
    close();
    onChoose(item.node.id);
  }
  function refresh({ show = document.activeElement === input } = {}) {
    const query = input.value.trim();
    if (!query || !show) {
      close();
      return;
    }
    const found = searchComponents(getGraph(), query, getFilters());
    results = found.results;
    active = Math.min(active, Math.max(0, results.length - 1));
    panel.replaceChildren();
    const status = node(
      "p",
      "finder-count",
      found.total
        ? found.total +
            " matching " +
            (found.total === 1 ? "component" : "components") +
            (found.total > results.length
              ? " · first " + results.length + " shown"
              : "")
        : "No matching components",
    );
    status.setAttribute("role", "status");
    panel.append(status);
    results.forEach((item, index) => {
      const option = node("button", "finder-option");
      option.type = "button";
      option.id = "component-result-" + index;
      option.setAttribute("role", "option");
      option.tabIndex = -1;
      option.append(
        node("strong", "", item.node.label),
        node(
          "span",
          "",
          item.node.type + (item.node.source ? " · " + item.node.source : ""),
        ),
        ...(item.hidden
          ? [
              node(
                "small",
                "",
                "Hidden by your view filters · select to reveal",
              ),
            ]
          : []),
      );
      option.addEventListener("pointerdown", (event) => event.preventDefault());
      option.addEventListener("click", () => choose(index));
      panel.append(option);
    });
    const hint = node(
      "p",
      "finder-hint",
      "↑ ↓ to choose · Enter to focus · Esc to close",
    );
    panel.append(hint);
    const rect = input.getBoundingClientRect();
    panel.style.left =
      Math.max(8, Math.min(rect.left, innerWidth - 340)) + "px";
    panel.style.top = rect.bottom + 8 + "px";
    panel.style.width = Math.min(360, innerWidth - 16) + "px";
    panel.hidden = false;
    try {
      panel.showPopover();
    } catch {}
    open = true;
    input.setAttribute("aria-expanded", "true");
    highlight();
  }
  input.addEventListener("input", () => {
    active = 0;
    refresh();
  });
  input.addEventListener("focus", () => refresh());
  input.addEventListener("keydown", (event) => {
    if (event.isComposing) return;
    if (["ArrowDown", "ArrowUp"].includes(event.key) && input.value.trim()) {
      event.preventDefault();
      if (!open) refresh();
      else if (results.length)
        active =
          (active + (event.key === "ArrowDown" ? 1 : -1) + results.length) %
          results.length;
      highlight();
    } else if (event.key === "Enter" && open && results.length) {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape" && (open || input.value)) {
      event.preventDefault();
      event.stopPropagation();
      if (open) close();
      else {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target !== input && !panel.contains(event.target)) close();
  });
  window.addEventListener("resize", close, { passive: true });
  return Object.freeze({ refresh, close });
}

export function initExplorationControls({
  root = document,
  getState,
  onMode,
  onGroup,
  onReset,
}) {
  const byId = (id) => root.getElementById(id),
    panel = byId("explore-panel"),
    button = byId("explore-map");
  let signature = "";
  panel.addEventListener("beforetoggle", (event) => {
    if (event.newState === "open") {
      const rect = button.getBoundingClientRect();
      panel.style.left =
        Math.max(8, Math.min(rect.left, innerWidth - 320)) + "px";
      panel.style.top =
        Math.min(rect.bottom + 8, Math.max(8, innerHeight - 360)) + "px";
    }
  });
  byId("explore-direction").addEventListener("change", (event) =>
    onMode(event.target.value),
  );
  byId("explore-reset").addEventListener("click", () => {
    onReset();
    try {
      panel.hidePopover();
    } catch {}
  });
  return Object.freeze({
    update() {
      const state = getState();
      button.disabled = !state.graph.nodes.length;
      byId("explore-direction").value = state.mode;
      byId("explore-direction").disabled = !state.selectedId;
      const selected = state.graph.nodes.find(
        (node) => node.id === state.selectedId,
      );
      byId("explore-context").textContent = selected
        ? "Connections from " + selected.label
        : "Select a component to explore its connections.";
      const groups = new Map();
      for (const item of state.graph.nodes)
        if (item.group)
          groups.set(item.group, (groups.get(item.group) || 0) + 1);
      const next =
        JSON.stringify([...groups]) + JSON.stringify([...state.collapsed]);
      if (next === signature) return;
      signature = next;
      const list = byId("explore-groups");
      list.replaceChildren();
      if (!groups.size)
        list.append(
          node(
            "p",
            "settings-copy",
            "This map has no named groups. Agents can include a group on each component.",
          ),
        );
      for (const [name, count] of groups) {
        const action = node(
          "button",
          "group-fold-button",
          (state.collapsed.has(name) ? "Expand " : "Collapse ") +
            name +
            " · " +
            count,
        );
        action.type = "button";
        action.setAttribute("aria-pressed", String(state.collapsed.has(name)));
        action.addEventListener("click", () => onGroup(name));
        list.append(action);
      }
    },
  });
}
