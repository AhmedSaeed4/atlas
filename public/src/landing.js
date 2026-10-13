import { mountLandingScene } from "./landing-scene.js";
import { mountLandingNetwork } from "./landing-network.js";
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
  mountLandingNetwork(document.querySelector("[data-landing-network]"));
  mountLandingScene(document.querySelector("[data-landing-scene]"));
  bindPromptCopy();
  const account = getSharedAccountSession();
  initAccountPanel({ root: document, account });
}

if (typeof window !== "undefined" && typeof document !== "undefined") initializeLanding();