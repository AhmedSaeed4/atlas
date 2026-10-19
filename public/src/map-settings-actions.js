// Presentation only. Account checks, confirmations and operations stay in app.js.
const details = {
  "Pin in sidebar": ["manage", "pin", "Keep this map near the top of your list."],
  "Unpin from sidebar": ["manage", "pin", "Return this map to its usual place in the list."],
  "Edit details": ["manage", "edit", "Change the map name, project type and description."],
  "Cancel editing": ["manage", "close", "Return to map actions without saving your edits."],
  "Download JSON": ["manage", "download", "Save a copy of this map to your device."],
  "Retry map details": ["manage", "retry", "Try loading this map's details again."],
  "Move to Cloud Workspace": ["cloud", "cloud", "Save online and keep your local copy."],
  "Moving to Cloud Workspace...": ["cloud", "cloud", "Your existing move is still in progress."],
  "Retry move to Cloud Workspace": ["cloud", "retry", "Continue the existing move to your cloud account."],
  "Open Account": ["cloud", "account", "Check the account linked to this map."],
  "Open local map to retry save": ["cloud", "retry", "Open this map to continue its pending save."],
  "Check Cloud Workspace": ["cloud", "cloud", "Check for this map's existing cloud copy."],
  "Open Cloud Workspace": ["cloud", "cloud", "Open the cloud copy linked to this local map."],
  "Share live link": ["cloud", "link", "Let people view this map with a live link."],
  "Copy live link": ["cloud", "link", "Copy the viewing link for this shared map."],
  "Revoke live link": ["cloud", "unlink", "Turn off access through the existing live link."],
  "Delete local map": ["remove", "trash", "Remove this map from this browser."],
  "Delete cloud map": ["remove", "trash", "Delete this map from Cloud Workspace."],
  "Retry cloud deletion": ["remove", "retry", "Finish removing this map from Cloud Workspace."],
};
const headings = { manage: "Manage map", cloud: "Cloud & sharing", remove: "Remove map" };
const paths = {
  pin: "m7 3 6 0-1 5 3 3H5l3-3-1-5Zm3 8v6",
  edit: "m12 4 4 4M4 16l1-5L13 3a1.4 1.4 0 0 1 2 0l2 2a1.4 1.4 0 0 1 0 2l-8 8-5 1Z",
  download: "M10 3v9m-4-4 4 4 4-4M4 13v3h12v-3",
  cloud: "M6 15H5a3 3 0 0 1-.3-6A5 5 0 0 1 14 6a4.5 4.5 0 0 1 1 9h-1M10 16V8m-3 3 3-3 3 3",
  trash: "M4 6h12M8 6V4h4v2m-7 0 .8 10h8.4L15 6M8.5 9v4.5M11.5 9v4.5",
  link: "m8 12 4-4M7 13l-1 1a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4 0m2 0 1-1a3 3 0 0 1 4 4l-3 3a3 3 0 0 1-4 0",
  unlink: "M3 3l14 14M7 13l-1 1a3 3 0 0 1-4-4l2-2m8-2 1-1a3 3 0 0 1 4 4l-1 1",
  retry: "M16 8a6 6 0 1 0-1 7M16 3v5h-5",
  account: "M7 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0M4 17a6 6 0 0 1 12 0",
  close: "m6 6 8 8m0-8-8 8",
  chevron: "m8 6 4 4-4 4",
};

export function appendMapSettingsAction(container, label, onActivate, { danger = false, disabled = false } = {}) {
  const doc = container.ownerDocument;
  const element = (tag, className, text) => {
    const node = doc.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const icon = name => {
    const node = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    node.setAttribute("viewBox", "0 0 20 20");
    node.setAttribute("class", "ui-icon");
    node.setAttribute("aria-hidden", "true");
    node.setAttribute("focusable", "false");
    const path = doc.createElementNS(node.namespaceURI, "path");
    path.setAttribute("d", paths[name] || paths.chevron);
    node.append(path);
    return node;
  };
  const [group, symbol, hint] = details[label] || [danger ? "remove" : "manage", "chevron", ""];
  let section = container.querySelector(`[data-settings-group="${group}"]`);
  if (!section) {
    section = element("section", "map-settings-group");
    section.dataset.settingsGroup = group;
    const heading = element("h3", "map-settings-group-title", headings[group]);
    heading.id = container.id + "-" + group;
    section.setAttribute("aria-labelledby", heading.id);
    section.append(heading, element("div", "map-settings-rows"));
    container.append(section);
  }
  const button = element("button", "button map-settings-action" + (danger ? " danger" : " secondary"));
  button.type = "button";
  button.dataset.actionLabel = label;
  button.setAttribute("aria-label", label);
  button.disabled = Boolean(disabled);
  const mark = element("span", "map-settings-action-icon");
  mark.append(icon(symbol));
  const copy = element("span", "map-settings-action-copy");
  copy.append(element("span", "map-settings-action-label", label));
  if (hint) {
    const description = element("span", "map-settings-action-hint", hint);
    description.id = container.id + "-hint-" + container.querySelectorAll("button").length;
    button.setAttribute("aria-describedby", description.id);
    copy.append(description);
  }
  button.append(mark, copy, icon("chevron"));
  button.addEventListener("click", onActivate);
  section.lastElementChild.append(button);
  return button;
}
