import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  getAccountPresentation,
  getAutosavePreferenceMessage,
  initAccountPanel,
  initSettingsPanel,
  safeAccountActionError,
} from "../public/src/account-ui.js";

const workspaceHtml = readFileSync(new URL("../public/workspace.html", import.meta.url), "utf8");
const landingHtml = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const landingJs = readFileSync(new URL("../public/src/landing.js", import.meta.url), "utf8");
const workspaceCss = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const landingCss = readFileSync(new URL("../public/landing.css", import.meta.url), "utf8");

class FakeElement {
  constructor(id = "") {
    this.id = id;
    this.listeners = new Map();
    this.attributes = new Map();
    this.hidden = false;
    this.disabled = false;
    this.checked = false;
    this.value = "";
    this.textContent = "";
    this.open = false;
  }
  addEventListener(type, listener) {
    const current = this.listeners.get(type) || [];
    current.push(listener);
    this.listeners.set(type, current);
  }
  async dispatch(type, event = {}) {
    const listeners = this.listeners.get(type) || [];
    for (const listener of listeners) await listener({ target: this, ...event });
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  querySelectorAll() { return []; }
  showModal() { this.open = true; }
  close() { this.open = false; void this.dispatch("close"); }
  click() { this.clickCount = (this.clickCount || 0) + 1; void this.dispatch("click"); }
}

function createRoot(ids, { triggers = [], pathname = "/workspace.html" } = {}) {
  const elements = new Map(ids.map((id) => [id, new FakeElement(id)]));
  const root = {
    location: { pathname },
    documentElement: { dataset: { theme: "dark" } },
    defaultView: {},
    getElementById(id) { return elements.get(id) || null; },
    querySelectorAll(selector) { return selector === "[data-open-account]" ? triggers : []; },
  };
  return { root, elements };
}

test("account panel state stays separate from the future-map preference", () => {
  assert.deepEqual(getAccountPresentation({ status: "idle", user: null }), {
    signedIn: false,
    initializing: false,
    failed: false,
    controlLabel: "Sign in",
    statusText: "Not signed in",
    identityText: "Sign in to open maps saved to your account.",
  });
  assert.equal(getAccountPresentation({ status: "ready", user: { uid: "u1", displayName: "Ada", email: "ada@example.test" } }).identityText, "Ada (ada@example.test)");
  assert.match(getAutosavePreferenceMessage(true), /future maps created while you are signed in/);
  assert.match(getAutosavePreferenceMessage(false), /stay in this browser/);
  assert.match(safeAccountActionError({ code: "auth/popup-closed-by-user" }), /was canceled/);
  assert.match(safeAccountActionError({ code: "auth/unauthorized-domain" }), /not enabled for this site/);
});

test("workspace presents separate Account and Settings controls plus one native Local/Cloud library picker", () => {
  assert.match(workspaceHtml, /id="account-control"[^>]*data-open-account/);
  assert.match(workspaceHtml, /id="settings-control"[^>]*>.*?Settings/);
  assert.match(workspaceHtml, /<label id="storage-heading" class="visually-hidden" for="workspace-library-select">Workspace library<\/label>/);
  assert.match(workspaceHtml, /<select id="workspace-library-select"[^>]*aria-controls="project-list">/);
  assert.match(workspaceHtml, /<option value="local" selected>Local Workspace<\/option>/);
  assert.match(workspaceHtml, /<option value="cloud">Cloud Workspace<\/option>/);
  assert.match(workspaceHtml, /<small id="storage-copy">/);
  assert.doesNotMatch(workspaceHtml, /local-workspace-switch|cloud-workspace-switch|sidebar-library-switch|library-switch-button/);
  assert.match(workspaceHtml, /id="project-list"[^>]*aria-label="Local Workspace maps"/);
  assert.match(workspaceHtml, /id="cloud-workspace-state" role="status"[^>]*hidden/);
  assert.match(workspaceHtml, /id="cloud-workspace-state-message"/);
  assert.match(workspaceHtml, /id="retry-cloud-workspaces" type="button" hidden/);
  assert.match(workspaceHtml, /id="map-settings-dialog"[^>]*aria-labelledby="map-settings-title"/);
  for (const id of ["map-settings-title", "map-settings-origin", "map-settings-message", "map-settings-error", "map-settings-actions", "map-settings-editor", "map-settings-name", "map-settings-description", "map-settings-type", "save-map-settings"]) {
    assert.match(workspaceHtml, new RegExp(`id="${id}"`));
  }
  const mapSettings = workspaceHtml.match(/<dialog class="modal map-settings-modal" id="map-settings-dialog"[\s\S]*?<\/dialog>/)?.[0];
  assert.ok(mapSettings);
  assert.doesNotMatch(mapSettings, /id="online-current"|id="online-library"/);
  assert.match(mapSettings, /data-map-settings-close/);
  assert.match(workspaceHtml, /id="online-current"[\s\S]*?id="retry-online-save"[\s\S]*?id="accept-conflict-online"[\s\S]*?id="reload-online-save"/);
  assert.match(workspaceHtml, /id="online-current" hidden aria-label="Cloud workspace status"/);
  assert.match(workspaceHtml, /id="online-route-banner"[^>]*hidden/);
  assert.doesNotMatch(workspaceHtml, /id="online-current-name"|Editing online as owner|Editing owner/);
  assert.doesNotMatch(workspaceHtml, /id="online-library-control"|id="online-library-dialog"|id="online-library"|id="retry-online-library"|id="save-online"|id="share-online"|id="delete-online"|id="retry-delete-online"|id="edit-online"|id="leave-owner-edit"/);
  assert.match(workspaceHtml, /id="autosave-notice" role="status"[^>]*hidden/);
  assert.match(workspaceHtml, /id="autosave-notice-message"/);
  assert.match(workspaceHtml, /id="retry-autosave" type="button" hidden/);
  assert.match(workspaceHtml, /When enabled, new local maps, local JSON imports, and maps opened from agent links are uploaded to your account/);
  assert.match(workspaceHtml, /does not upload repository files/);
  assert.match(workspaceHtml, /A map created or imported while signed out stays local after you sign in/);
  assert.match(workspaceHtml, /maps already saved to your account continue to sync while you edit them/);
  assert.match(workspaceHtml, /id="save-future-maps" type="checkbox"/);
  assert.match(workspaceHtml, /id="account-sign-in" type="button"[^>]*>/);
  assert.match(workspaceHtml, /Continue with Google/);
  assert.doesNotMatch(workspaceHtml, /password|Create account|Sign up/);
});
test("landing sign-in opens the shared account panel without requiring a map or touching consent", () => {
  assert.match(landingHtml, /id="landing-sign-in"[^>]*data-open-account/);
  assert.match(landingHtml, /id="account-modal"/);
  assert.match(landingHtml, /Continue with Google/);
  assert.match(landingHtml, /future maps upload only if you separately enable that preference/);
  assert.match(landingHtml, /Signing in alone does not upload maps/);
  assert.doesNotMatch(landingHtml, /Online mode uploads only the map you choose to save/);
  assert.doesNotMatch(landingHtml, /id="settings-modal"|id="save-future-maps"/);
  assert.match(landingJs, /getSharedAccountSession()/);
  assert.ok(landingJs.includes("initAccountPanel({ root: document, account })"));
  assert.doesNotMatch(landingJs, /getPreferenceState|setSaveFutureMaps|subscribePreference/);
});

test("Settings reads and changes only the local preference, never initializes or signs in", async () => {
  const dialog = new FakeElement("settings-modal");
  dialog.querySelectorAll = () => [];
  const trigger = new FakeElement("settings-control");
  const checkbox = new FakeElement("save-future-maps");
  const status = new FakeElement("save-future-status");
  const error = new FakeElement("settings-error");
  const themeSelect = new FakeElement("settings-theme-select");
  const themeToggle = new FakeElement("theme-toggle");
  const { root } = createRoot([], { pathname: "/workspace.html" });
  const elements = new Map([
    ["settings-modal", dialog], ["settings-control", trigger], ["save-future-maps", checkbox],
    ["save-future-status", status], ["settings-error", error], ["settings-theme-select", themeSelect],
    ["theme-toggle", themeToggle],
  ]);
  root.getElementById = (id) => elements.get(id) || null;
  themeToggle.click = () => { themeToggle.clickCount = (themeToggle.clickCount || 0) + 1; root.documentElement.dataset.theme = "light"; };
  let preference = { saveFutureMaps: false, persisted: true };
  let authCalls = 0;
  let getStateCalls = 0;
  const saved = [];
  const account = {
    getPreferenceState() { return preference; },
    subscribePreference(listener) { listener(preference); return () => {}; },
    setSaveFutureMaps(enabled) { saved.push(enabled); preference = { saveFutureMaps: enabled, persisted: true }; return true; },
    getState() { getStateCalls += 1; return { status: "idle", user: null }; },
    initialize() { authCalls += 1; return Promise.resolve(); },
    signIn() { authCalls += 1; return Promise.resolve(); },
  };
  initSettingsPanel({ root, account });
  assert.equal(checkbox.checked, false);
  assert.match(status.textContent, /stay in this browser/);
  assert.equal(authCalls, 0);
  assert.equal(getStateCalls, 0);
  checkbox.checked = true;
  await checkbox.dispatch("change");
  assert.deepEqual(saved, [true]);
  assert.match(status.textContent, /future maps created while you are signed in/);
  themeSelect.value = "light";
  await themeSelect.dispatch("change");
  assert.equal(themeToggle.clickCount, 1);
  assert.equal(root.documentElement.dataset.theme, "light");
  assert.equal(authCalls, 0);
});

test("failed autosave preference writes explain whether reload can restore the last saved choice", async () => {
  const dialog = new FakeElement("settings-modal");
  dialog.querySelectorAll = () => [];
  const trigger = new FakeElement("settings-control");
  const checkbox = new FakeElement("save-future-maps");
  const status = new FakeElement("save-future-status");
  const error = new FakeElement("settings-error");
  const { root } = createRoot([]);
  const elements = new Map([["settings-modal", dialog], ["settings-control", trigger], ["save-future-maps", checkbox], ["save-future-status", status], ["settings-error", error]]);
  root.getElementById = (id) => elements.get(id) || null;
  let preference = { saveFutureMaps: true, persisted: true };
  const account = {
    getPreferenceState() { return preference; },
    subscribePreference(listener) { listener(preference); return () => {}; },
    setSaveFutureMaps(enabled) {
      preference = { saveFutureMaps: false, persisted: false };
      return false;
    },
  };
  initSettingsPanel({ root, account });
  assert.equal(checkbox.checked, true);
  checkbox.checked = false;
  await checkbox.dispatch("change");
  assert.equal(checkbox.checked, false);
  assert.equal(error.hidden, false);
  assert.match(error.textContent, /off in this tab/);
  assert.match(error.textContent, /Reloading may restore the last saved setting/);
  checkbox.checked = true;
  await checkbox.dispatch("change");
  assert.equal(checkbox.checked, false);
  assert.match(error.textContent, /opt-in, so automatic saving remains off/);
});

test("opening the Account panel checks the shared session; Google Continue signs in without changing consent", async () => {
  const dialog = new FakeElement("account-modal");
  dialog.querySelectorAll = () => [];
  const trigger = new FakeElement("account-control");
  const status = new FakeElement("account-status");
  const identity = new FakeElement("account-identity");
  const signIn = new FakeElement("account-sign-in");
  const signOut = new FakeElement("account-sign-out");
  const error = new FakeElement("account-error");
  const { root } = createRoot([], { triggers: [trigger] });
  const elements = new Map([["account-modal", dialog], ["account-status", status], ["account-identity", identity], ["account-sign-in", signIn], ["account-sign-out", signOut], ["account-error", error]]);
  root.getElementById = (id) => elements.get(id) || null;
  let state = { status: "idle", user: null };
  let initializeCalls = 0;
  let signInCalls = 0;
  let signOutCalls = 0;
  let preferenceCalls = 0;
  const account = {
    getState() { return state; },
    subscribe(listener) { listener(state); return () => {}; },
    async initialize() { initializeCalls += 1; state = { status: "ready", user: null }; },
    async signIn() { signInCalls += 1; state = { status: "ready", user: { uid: "u1", email: "ada@example.test" } }; },
    async signOut() { signOutCalls += 1; state = { status: "ready", user: null }; },
    setSaveFutureMaps() { preferenceCalls += 1; return false; },
  };
  initAccountPanel({ root, account, startProgress: () => () => {} });
  assert.equal(initializeCalls, 0);
  await trigger.dispatch("click");
  await Promise.resolve();
  assert.equal(initializeCalls, 1);
  assert.equal(signInCalls, 0);
  await signIn.dispatch("click");
  assert.equal(signInCalls, 1);
  assert.equal(signOut.hidden, false);
  assert.match(identity.textContent, /ada@example.test/);
  assert.equal(preferenceCalls, 0);
  await signOut.dispatch("click");
  assert.equal(signOutCalls, 1);
});

test("account, library, and map settings surfaces stay usable at 390px with visible focus styling", () => {
  assert.match(workspaceCss, /.account-modal,.settings-modal/);
  assert.ok(workspaceCss.includes("@media(max-width:560px)"));
  assert.match(workspaceCss, /\.topbar \.theme-toggle #theme-value\{display:none\}/);
  assert.match(workspaceCss, /\.breadcrumbs>span,\.breadcrumbs \.crumb-sep\{display:none\}/);
  assert.match(landingCss, /@media\(max-width:540px\)\{\.header-nav\{display:none\}\}/);
  assert.match(workspaceCss, /\.settings-theme-field select:focus-visible\{outline:2px solid var\(--atlas-accent\);outline-offset:2px\}/);
  assert.match(workspaceCss, /\.workspace-library-select/);
  assert.match(workspaceCss, /#project-list \.project-row-settings/);
  assert.match(workspaceCss, /\.map-settings-modal input:focus-visible/);
  assert.match(workspaceCss, /@media\(max-width:560px\)\{[\s\S]*?\.map-settings-actions\{display:grid/);
  assert.match(workspaceCss, /@media\(max-width:560px\)\{[\s\S]*?\.workspace-library-select\{min-height:44px\}/);
  assert.match(workspaceCss, /@media\(pointer:coarse\)\{[\s\S]*?\.workspace-library-select\{min-height:44px\}/);
  assert.match(workspaceCss, /@media\(max-width:560px\)\{[\s\S]*?\.sidebar-library-retry\{min-height:44px/);
  assert.match(workspaceCss, /@media\(max-width:560px\)\{[\s\S]*?#project-list \.project-row-settings\{width:44px;min-width:44px;height:44px;min-height:44px\}/);
  assert.match(workspaceCss, /@media\(max-width:560px\)\{[\s\S]*?\.map-settings-actions \.button\{width:100%;min-height:44px\}/);
  assert.match(workspaceCss, /@media\(pointer:coarse\)\{[\s\S]*?\.project-row-settings\{width:44px;min-width:44px;height:44px;min-height:44px\}/);
  assert.match(workspaceCss, /@media\(pointer:coarse\)\{[\s\S]*?\.map-settings-actions \.button,\.map-settings-editor \.modal-foot \.button\{min-height:44px\}/);
  assert.match(workspaceCss, /prefers-reduced-motion:reduce/);
  assert.match(landingCss, /.account-dialog::backdrop/);
  assert.ok(landingCss.includes("@media(max-width:700px)"));
  assert.match(landingCss, /button:focus-visible/);
});

test("landing and workspace account panels restore without opening or starting sign-in", async () => {
  for (const pathname of ["/", "/workspace"]) {
    const ids = ["account-modal", "account-status", "account-identity", "account-sign-in", "account-sign-out", "account-control-label", "account-workspace-link"];
    const trigger = new FakeElement("account-control");
    const { root, elements } = createRoot(ids, { triggers: [trigger], pathname });
    let listener;
    let state = { status: "idle", user: null };
    let restores = 0;
    let signIns = 0;
    let consentChanges = 0;
    let resolveRestore;
    const pending = new Promise(resolve => { resolveRestore = resolve; });
    const account = {
      getState: () => state,
      subscribe(next) { listener = next; next(state); return () => {}; },
      restore() {
        restores++;
        state = { status: "initializing", user: null };
        listener(state);
        return pending;
      },
      signIn() { signIns++; },
      setSaveFutureMaps() { consentChanges++; },
    };
    initAccountPanel({ root, account });
    assert.equal(restores, 1);
    assert.equal(elements.get("account-modal").open, false);
    assert.equal(elements.get("account-control-label").textContent, "Checking…");
    assert.equal(elements.get("account-sign-in").disabled, true);
    state = { status: "ready", user: { uid: "owner-a", displayName: "QA Owner" } };
    listener(state);
    resolveRestore(state);
    await pending;
    assert.equal(elements.get("account-control-label").textContent, "Account");
    assert.equal(elements.get("account-sign-out").hidden, false);
    assert.equal(elements.get("account-workspace-link").hidden, pathname !== "/");
    assert.equal(elements.get("account-modal").open, false);
    assert.equal(signIns, 0);
    assert.equal(consentChanges, 0);
  }
});

test("landing header exposes a live account label and hidden account actions stay hidden", () => {
  assert.match(landingHtml, /id="landing-sign-in"[^>]*><span id="account-control-label">Sign in<\/span><\/button>/);
  assert.match(landingCss, /\.account-dialog \[hidden\]\{display:none\}/);
});
