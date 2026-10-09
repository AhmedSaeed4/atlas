import { startButtonProgress } from "./action-feedback.js";
const byId = (root, id) => root?.getElementById?.(id) || root?.querySelector?.(`#${id}`) || null;

export function getAccountPresentation(state = {}) {
  const user = state?.user && typeof state.user === "object" ? state.user : null;
  const signedIn = Boolean(user?.uid);
  const initializing = state?.status === "initializing";
  const failed = state?.status === "error" || Boolean(state?.error);
  const displayName = String(user?.displayName || "").trim();
  const email = String(user?.email || "").trim();
  const identityText = signedIn
    ? (displayName && email ? displayName + " (" + email + ")" : displayName || email || "Google account")
    : "Sign in to open maps saved to your account.";
  return {
    signedIn,
    initializing,
    failed,
    controlLabel: signedIn ? "Account" : initializing ? "Checking…" : "Sign in",
    statusText: initializing ? (signedIn ? "Restoring your account" : "Checking your account")
      : failed ? "Could not check your account"
        : signedIn ? "Signed in with Google" : "Not signed in",
    identityText,
  };
}

export function getAutosavePreferenceMessage(enabled) {
  return enabled
    ? "Automatic saving is on for future maps created while you are signed in."
    : "Future maps stay in this browser unless you choose to move one online.";
}

export function safeAccountActionError(error, action = "sign in") {
  const code = String(error?.code || "");
  if (code.includes("popup-closed-by-user") || code.includes("cancelled-popup-request")) {
    return "Google sign-in was canceled. You can try again whenever you are ready.";
  }
  if (code.includes("unauthorized-domain")) {
    return "Google sign-in is not enabled for this site yet.";
  }
  if (code.includes("network-request-failed")) {
    return "A network connection is needed to " + action + ". Check your connection and try again.";
  }
  if (action === "check your account") return "Atlas could not check your account. Try again.";
  if (action === "sign out") return "Sign-out did not finish. Try again.";
  return "Google sign-in did not finish. Try again.";
}

function dialogOpen(dialog, trigger) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
  trigger?.setAttribute("aria-expanded", "true");
}

function dialogClose(dialog, triggers) {
  if (!dialog) return;
  if (typeof dialog.close === "function" && dialog.open) dialog.close();
  else dialog.removeAttribute("open");
  for (const trigger of triggers) trigger.setAttribute("aria-expanded", "false");
}

function bindDialogDismissal({ dialog, closeButtons, triggers }) {
  if (!dialog) return;
  for (const button of closeButtons) {
    button.addEventListener("click", () => dialogClose(dialog, triggers));
  }
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialogClose(dialog, triggers);
  });
  dialog.addEventListener("close", () => {
    for (const trigger of triggers) trigger.setAttribute("aria-expanded", "false");
  });
}


export function initAccountPanel({ root = document, account, startProgress = startButtonProgress } = {}) {
  const dialog = byId(root, "account-modal");
  const triggers = Array.from(root.querySelectorAll?.("[data-open-account]") || []);
  const status = byId(root, "account-status");
  const identity = byId(root, "account-identity");
  const signIn = byId(root, "account-sign-in");
  const signOut = byId(root, "account-sign-out");
  const retry = byId(root, "account-retry");
  const errorBox = byId(root, "account-error");
  const controlLabel = byId(root, "account-control-label");
  const workspaceLink = byId(root, "account-workspace-link");
  const adminLink = byId(root, "account-admin-link");
  let adminLinkEpoch = 0, adminLinkUid = null;
  function updateAdminLink(user) {
    if (!adminLink || adminLinkUid === (user?.uid || "")) return;
    adminLinkUid = user?.uid || "";
    const scope = ++adminLinkEpoch;
    adminLink.hidden = true;
    if (!adminLinkUid || !account.getService) return;
    void account.getService().then(service => service.getAdminAccess?.()).then(access => {
      if (scope === adminLinkEpoch && account.getState?.().user?.uid === adminLinkUid) adminLink.hidden = access?.isAdmin !== true;
    }).catch(() => {});
  }
  if (!dialog || !account || !status || !identity || !signIn || !signOut) return () => {};

  let initializationRequested = false;
  let busy = false;
  let finishProgress = null;
  let localError = "";
  let retryAction = "initialize";
  let lastState = account.getState?.() || { status: "idle", user: null };

  function render(state = lastState) {
    if (!busy && finishProgress) { finishProgress(); finishProgress = null; }
    lastState = state || { status: "idle", user: null };
    const view = getAccountPresentation(lastState);
    updateAdminLink(lastState.user);
    status.textContent = busy && retryAction === "signIn" ? "Waiting for Google sign-in…" : busy && retryAction === "signOut" ? "Signing out…" : view.statusText;
    status.setAttribute("aria-busy", String(busy || view.initializing));
    identity.textContent = view.identityText;
    if (controlLabel) controlLabel.textContent = view.controlLabel;
    const workspacePath = String(root.location?.pathname || "");
    const onLanding = workspacePath === "/" || workspacePath.endsWith("/index.html");
    if (workspaceLink) workspaceLink.hidden = !(view.signedIn && onLanding);
    signIn.hidden = view.signedIn;
    signOut.hidden = !view.signedIn;
    signIn.disabled = busy || view.initializing;
    signOut.disabled = busy || view.initializing;
    if (busy && retryAction !== "initialize" && !finishProgress) {
      finishProgress = startProgress(retryAction === "signOut" ? signOut : signIn, retryAction === "signOut" ? "Signing out…" : "Signing in…");
    }
    if (retry) {
      retry.hidden = !(view.failed || Boolean(localError));
      retry.textContent = retryAction === "initialize" ? "Try again" : retryAction === "signOut" ? "Try sign out again" : "Try Google sign-in again";
      retry.disabled = busy;
    }
    const errorAction = retryAction === "initialize" ? "check your account" : retryAction === "signOut" ? "sign out" : "sign in";
    const message = localError || (lastState?.error ? safeAccountActionError(lastState.error, errorAction) : "");
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.hidden = !message;
    }
    for (const trigger of triggers) trigger.setAttribute("aria-expanded", String(Boolean(dialog.open)));
  }

  async function initializeAccount() {
    if (busy) return;
    busy = true;
    localError = "";
    retryAction = "initialize";
    render(lastState);
    try {
      await account.initialize();
    } catch (error) {
      localError = safeAccountActionError(error, "check your account");
    } finally {
      busy = false;
      render(account.getState?.() || lastState);
    }
  }

  for (const trigger of triggers) {
    trigger.addEventListener("click", () => {
      dialogOpen(dialog, trigger);
      if (!initializationRequested) {
        initializationRequested = true;
        void initializeAccount();
      }
    });
  }

  signIn.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    localError = "";
    retryAction = "signIn";
    render(lastState);
    try {
      await account.signIn();
    } catch (error) {
      localError = safeAccountActionError(error, "sign in");
    } finally {
      busy = false;
      render(account.getState?.() || lastState);
    }
  });

  signOut.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    localError = "";
    retryAction = "signOut";
    render(lastState);
    try {
      await account.signOut();
    } catch (error) {
      localError = safeAccountActionError(error, "sign out");
    } finally {
      busy = false;
      render(account.getState?.() || lastState);
    }
  });

  retry?.addEventListener("click", () => {
    if (retryAction === "signIn") {
      signIn.click();
      return;
    }
    if (retryAction === "signOut") {
      signOut.click();
      return;
    }
    initializationRequested = false;
    void initializeAccount();
  });

  const closeButtons = Array.from(dialog.querySelectorAll("[data-account-close]"));
  bindDialogDismissal({ dialog, closeButtons, triggers });
  const unsubscribe = account.subscribe?.((state) => {
    if (state?.status === "error") retryAction = "initialize";
    localError = "";
    render(state);
  });
  render(lastState);
  // Both the landing page and workspace use this panel. Restore without opening
  // it; first-time local visitors still do not load the Firebase service.
  if (typeof account.restore === "function") void account.restore().catch(() => {});
  return () => { adminLinkEpoch += 1; if (typeof unsubscribe === "function") unsubscribe(); };
}

export function initSettingsPanel({ root = document, account } = {}) {
  const dialog = byId(root, "settings-modal");
  const trigger = byId(root, "settings-control");
  const preference = byId(root, "save-future-maps");
  const preferenceStatus = byId(root, "save-future-status");
  const settingsError = byId(root, "settings-error");
  const themeSelect = byId(root, "settings-theme-select");
  if (!dialog || !trigger || !preference || !account?.getPreferenceState || !account?.subscribePreference || !account?.setSaveFutureMaps) return () => {};

  function renderPreference(state = account.getPreferenceState()) {
    const enabled = state?.saveFutureMaps === true;
    preference.checked = enabled;
    if (preferenceStatus) preferenceStatus.textContent = getAutosavePreferenceMessage(enabled);
    if (settingsError) {
      const failedToPersist = state?.persisted === false;
      settingsError.textContent = failedToPersist
        ? enabled
          ? "Atlas could not save this opt-in, so automatic saving remains off."
          : "Automatic saving is off in this tab, but Atlas could not save the change. Reloading may restore the last saved setting."
        : "";
      settingsError.hidden = !failedToPersist;
    }
  }
  function renderTheme() {
    if (!themeSelect) return;
    themeSelect.value = root.documentElement?.dataset?.theme === "light" ? "light" : "dark";
  }
  function show() {
    dialogOpen(dialog, trigger);
    renderTheme();
  }

  trigger.addEventListener("click", show);
  bindDialogDismissal({
    dialog,
    closeButtons: Array.from(dialog.querySelectorAll("[data-settings-close]")),
    triggers: [trigger],
  });

  preference.addEventListener("change", () => {
    const requested = preference.checked;
    const saved = account.setSaveFutureMaps(requested);
    renderPreference(account.getPreferenceState());
    if (saved !== true && settingsError) {
      settingsError.textContent = requested
        ? "Atlas could not save this opt-in, so automatic saving remains off."
        : "Automatic saving is off in this tab, but Atlas could not save the change. Reloading may restore the last saved setting.";
      settingsError.hidden = false;
    }
  });

  themeSelect?.addEventListener("change", () => {
    const requested = themeSelect.value === "light" ? "light" : "dark";
    const current = root.documentElement?.dataset?.theme === "light" ? "light" : "dark";
    if (requested === current) return;
    const toggle = byId(root, "theme-toggle");
    if (toggle) toggle.click();
    renderTheme();
  });

  const Observer = root.defaultView?.MutationObserver || globalThis.MutationObserver;
  const themeObserver = typeof Observer === "function" && root.documentElement
    ? new Observer(renderTheme) : null;
  themeObserver?.observe(root.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const unsubscribe = account.subscribePreference(renderPreference);
  renderPreference();
  renderTheme();
  return () => {
    if (typeof unsubscribe === "function") unsubscribe();
    themeObserver?.disconnect();
  };
}
