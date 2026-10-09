import { workspaceBaseUrl } from "./routing.js";
import { buildAgentPrompt } from "./prompt.js";
import { getSharedAccountSession } from "./account-session.js";
import { initAccountPanel } from "./account-ui.js";

export function getLegacyShareRedirect(locationLike, workspacePath = "./workspace") {
  const pathname = String(locationLike?.pathname || "/");
  const isLandingEntry = pathname === "/" || pathname.endsWith("/index.html");
  const hash = String(locationLike?.hash || "");
  if (!isLandingEntry || !hash.startsWith("#map=")) return null;
  return String(workspacePath) + String(locationLike?.search || "") + hash;
}

export function getWorkspaceBaseUrl(inputUrl) {
  return workspaceBaseUrl(inputUrl);
}

export function isLocalViewerUrl(inputUrl) {
  const url = new URL(String(inputUrl));
  if (url.protocol !== "http:" && url.protocol !== "https:") return true;
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1" || host === "::1";
}

export function getPreviewNodeDetails(node) {
  const data = node?.dataset;
  if (!data) return null;
  return {
    title: String(data.title || ""),
    kind: String(data.kind || ""),
    description: String(data.description || ""),
  };
}

function getPreviewNode(target) {
  return target && typeof target.closest === "function"
    ? target.closest("[data-preview-node]")
    : null;
}

function bindPreview() {
  const preview = document.getElementById("architecture-preview");
  if (!preview) return;
  const nodes = Array.from(preview.querySelectorAll("[data-preview-node]"));
  const title = document.getElementById("preview-detail-title");
  const kind = document.getElementById("preview-detail-kind");
  const description = document.getElementById("preview-description");
  const initial = document.getElementById("preview-detail-initial");
  if (!title || !kind || !description || !initial) return;

  let selectedNode = nodes.find((node) => node.getAttribute("aria-pressed") === "true") || nodes[0] || null;
  let hoveredNode = null;
  let focusedNode = null;

  function renderDetails() {
    const source = focusedNode || hoveredNode || selectedNode;
    const details = getPreviewNodeDetails(source);
    if (!details) return;
    title.textContent = details.title;
    kind.textContent = details.kind;
    description.textContent = details.description;
    initial.textContent = Array.from(details.title.trim())[0]?.toUpperCase() || "•";
  }

  function selectNode(node) {
    if (!node) return;
    selectedNode = node;
    for (const item of nodes) {
      const selected = item === selectedNode;
      item.setAttribute("aria-pressed", String(selected));
      item.classList.toggle("is-selected", selected);
    }
    renderDetails();
  }

  preview.addEventListener("pointerover", (event) => {
    const node = getPreviewNode(event.target);
    if (!node || node.contains(event.relatedTarget)) return;
    hoveredNode = node;
    renderDetails();
  });

  preview.addEventListener("pointerout", (event) => {
    const node = getPreviewNode(event.target);
    if (!node || node.contains(event.relatedTarget)) return;
    if (hoveredNode === node) hoveredNode = null;
    renderDetails();
  });

  preview.addEventListener("focusin", (event) => {
    const node = getPreviewNode(event.target);
    if (!node) return;
    focusedNode = node;
    renderDetails();
  });

  preview.addEventListener("focusout", (event) => {
    const node = getPreviewNode(event.target);
    if (!node || node.contains(event.relatedTarget)) return;
    if (focusedNode === node) focusedNode = null;
    renderDetails();
  });

  preview.addEventListener("click", (event) => {
    const node = getPreviewNode(event.target);
    if (node) selectNode(node);
  });

  preview.addEventListener("keydown", (event) => {
    const node = getPreviewNode(event.target);
    if (!node || (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar")) return;
    event.preventDefault();
    selectNode(node);
  });

  renderDetails();
}

function bindPromptCopy() {
  const dialog = document.getElementById("prompt-dialog");
  const promptField = document.getElementById("agent-prompt");
  const copyButton = document.getElementById("copy-agent-prompt");
  const status = document.getElementById("copy-status");
  const fallbackNote = document.getElementById("copy-fallback-note");
  if (!dialog || !promptField || !copyButton || !status || !fallbackNote) return;

  const viewerBaseUrl = getWorkspaceBaseUrl(window.location.href);
  promptField.value = buildAgentPrompt(viewerBaseUrl, isLocalViewerUrl(window.location.href));

  function resetFeedback() {
    status.textContent = "";
    fallbackNote.hidden = true;
  }

  function closeDialog() {
    resetFeedback();
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  for (const button of document.querySelectorAll("[data-open-prompt]")) {
    button.addEventListener("click", () => {
      resetFeedback();
      if (typeof dialog.showModal === "function") dialog.showModal();
      else {
        dialog.setAttribute("open", "");
        dialog.querySelector("[data-close-prompt]")?.focus();
      }
    });
  }

  for (const button of dialog.querySelectorAll("[data-close-prompt]")) {
    button.addEventListener("click", closeDialog);
  }

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", resetFeedback);

  copyButton.addEventListener("click", async () => {
    resetFeedback();
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(promptField.value);
      status.textContent = "Prompt copied. Paste it into your coding agent.";
    } catch {
      fallbackNote.hidden = false;
      status.textContent = "The clipboard could not be opened. The prompt is selected below.";
      promptField.focus();
      promptField.select();
    }
  });
}

function initializeLanding() {
  const redirect = getLegacyShareRedirect(window.location);
  if (redirect) {
    window.location.replace(redirect);
    return;
  }
  bindPreview();
  bindPromptCopy();
  const account = getSharedAccountSession();
  initAccountPanel({ root: document, account });
}

if (typeof window !== "undefined" && typeof document !== "undefined") initializeLanding();