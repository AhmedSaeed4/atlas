// Tickets prevent duplicate submissions and stale cleanup from unlocking a new action.
export function createActionGate() {
  const active = new Map();
  return Object.freeze({
    begin(key) {
      if (active.has(key)) return null;
      const ticket = Object.freeze({ key });
      active.set(key, ticket);
      return ticket;
    },
    finish(ticket) {
      if (!ticket || active.get(ticket.key) !== ticket) return false;
      active.delete(ticket.key);
      return true;
    },
    isBusy(key) { return active.has(key); },
  });
}

const buttonProgress = new WeakMap();
export function startButtonProgress(button, label = "Working…") {
  if (!button) return () => {};
  buttonProgress.get(button)?.();
  const compact = button.getBoundingClientRect().width < 86;
  const original = [...button.childNodes];
  const disabled = button.disabled;
  const ariaLabel = button.getAttribute("aria-label");
  const ariaBusy = button.getAttribute("aria-busy");
  const content = button.ownerDocument.createElement("span");
  content.className = "action-original";
  content.setAttribute("aria-hidden", "true");
  content.append(...original);
  const progress = button.ownerDocument.createElement("span");
  progress.className = "action-progress";
  if (compact) progress.classList.add("is-compact");
  progress.setAttribute("aria-hidden", "true");
  const spinner = button.ownerDocument.createElement("span");
  spinner.className = "action-spinner";
  const text = button.ownerDocument.createElement("span");
  text.textContent = label;
  progress.append(spinner, text);
  button.replaceChildren(content, progress);
  button.classList.add("is-action-pending");
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-busy", "true");
  button.disabled = true;
  function finish() {
    if (buttonProgress.get(button) !== finish) return;
    buttonProgress.delete(button);
    button.classList.remove("is-action-pending");
    button.replaceChildren(...original);
    button.disabled = disabled;
    for (const [name, value] of [["aria-label", ariaLabel], ["aria-busy", ariaBusy]]) {
      if (value === null) button.removeAttribute(name); else button.setAttribute(name, value);
    }
  }
  buttonProgress.set(button, finish);
  return finish;
}

if (typeof document !== "undefined") {
  const updateVisibility = () => { document.documentElement.dataset.actionPageHidden = String(document.hidden); };
  document.addEventListener("visibilitychange", updateVisibility);
  updateVisibility();
}
