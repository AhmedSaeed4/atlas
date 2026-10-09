let pickerNumber = 0;
const svgNamespace = "http://www.w3.org/2000/svg";
function icon(path, className) {
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("viewBox", "0 0 16 16"); svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false"); svg.classList.add(className);
  const line = document.createElementNS(svgNamespace, "path"); line.setAttribute("d", path); svg.append(line);
  return svg;
}

export function createChoicePicker({ choices, value, label, disabled = false, onChange, classPrefix = "choice", minimumMenuWidth = 146 }) {
  const values = choices.map(choice => choice.value);
  const labelFor = current => choices.find(choice => choice.value === current)?.label || "";
  const element = document.createElement("div"); element.className = classPrefix + "-picker";
  const trigger = document.createElement("button"); trigger.type = "button"; trigger.className = classPrefix + "-trigger";
  trigger.disabled = disabled; trigger.setAttribute("aria-label", label); trigger.setAttribute("aria-haspopup", "listbox"); trigger.setAttribute("aria-expanded", "false");
  const text = document.createElement("span"); text.textContent = labelFor(value);
  trigger.append(text, icon("M4 6l4 4 4-4", classPrefix + "-chevron"));
  const menu = document.createElement("div"); menu.className = classPrefix + "-menu"; menu.id = classPrefix + "-menu-" + (++pickerNumber);
  menu.setAttribute("role", "listbox"); menu.setAttribute("aria-label", label); menu.setAttribute("popover", "auto"); menu.hidden = true;
  trigger.setAttribute("aria-controls", menu.id);
  text.id = menu.id + "-value"; trigger.setAttribute("aria-describedby", text.id);
  let opened = false;
  const buttons = values.map(choice => {
    const button = document.createElement("button"); button.type = "button"; button.className = classPrefix + "-option";
    button.setAttribute("role", "option"); button.setAttribute("aria-selected", String(choice === value)); button.tabIndex = -1;
    const title = document.createElement("span"); title.textContent = labelFor(choice);
    button.append(title, icon("M3.5 8l3 3 6-6", classPrefix + "-check"));
    button.addEventListener("click", () => {
      if (trigger.disabled) return;
      const changed = choice !== value;
      setValue(choice); close(true); if (changed) onChange(value);
    });
    menu.append(button); return button;
  });
  const nativePopover = typeof menu.showPopover === "function";
  function position() {
    if (!opened) return;
    const rect = trigger.getBoundingClientRect(), gutter = 8;
    const width = Math.max(rect.width, minimumMenuWidth);
    menu.style.width = Math.min(width, window.innerWidth - gutter * 2) + "px";
    menu.style.maxHeight = Math.max(80, window.innerHeight - gutter * 2) + "px";
    const height = menu.getBoundingClientRect().height;
    const below = rect.bottom + 6;
    const top = below + height <= window.innerHeight - gutter ? below : Math.max(gutter, rect.top - height - 6);
    menu.style.left = Math.max(gutter, Math.min(rect.left, window.innerWidth - menu.getBoundingClientRect().width - gutter)) + "px";
    menu.style.top = top + "px";
  }
  function outside(event) { if (!element.contains(event.target)) close(); }
  function detach() {
    document.removeEventListener("pointerdown", outside, true);
    window.removeEventListener("resize", position);
    window.removeEventListener("scroll", position, true);
  }
  function close(restoreFocus = false) {
    if (nativePopover && menu.matches(":popover-open")) menu.hidePopover();
    opened = false; menu.hidden = true; trigger.setAttribute("aria-expanded", "false"); detach();
    if (restoreFocus && trigger.isConnected && !trigger.disabled) trigger.focus({ preventScroll: true });
  }
  function open(index = values.indexOf(value)) {
    if (trigger.disabled || opened) return;
    opened = true; menu.hidden = false;
    if (nativePopover) menu.showPopover();
    trigger.setAttribute("aria-expanded", "true"); position();
    document.addEventListener("pointerdown", outside, true);
    window.addEventListener("resize", position); window.addEventListener("scroll", position, true);
    buttons[Math.max(0, index)].focus({ preventScroll: true });
  }
  trigger.addEventListener("click", () => opened ? close() : open());
  trigger.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); open(event.key === "ArrowUp" ? buttons.length - 1 : values.indexOf(value));
    }
  });
  menu.addEventListener("toggle", event => {
    if (event.newState === "closed" && opened && !menu.matches(":popover-open")) close();
  });
  menu.addEventListener("keydown", event => {
    const current = buttons.indexOf(document.activeElement);
    const key = event.key;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      event.preventDefault();
      const index = key === "Home" ? 0 : key === "End" ? buttons.length - 1 : (current + (key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[index].focus({ preventScroll: true });
    } else if (key === "Escape") { event.preventDefault(); event.stopPropagation(); close(true); }
    else if (key === "Tab") {
      const focusable = [...document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]')].filter(item => !menu.contains(item) && item.getClientRects().length && !item.closest("[hidden]"));
      const target = focusable[focusable.indexOf(trigger) + (event.shiftKey ? -1 : 1)];
      close(); if (target) { event.preventDefault(); target.focus({ preventScroll: true }); }
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const match = buttons.find(button => button.textContent.toLowerCase().startsWith(key.toLowerCase()));
      if (match) { event.preventDefault(); match.focus({ preventScroll: true }); }
    }
  });
  function setValue(next) {
    if (!values.includes(next)) return;
    value = next; text.textContent = labelFor(value);
    buttons.forEach((item, index) => item.setAttribute("aria-selected", String(values[index] === value)));
  }
  function setDisabled(next) { trigger.disabled = next; if (next) close(); }
  element.append(trigger, menu);
  return { element, trigger, setValue, setDisabled, close, dispose: () => close() };
}
