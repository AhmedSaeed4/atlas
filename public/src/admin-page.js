import { getSharedAccountSession } from "./account-session.js";
import { createAdminController } from "./admin-controller.js";
import { createAllowancePicker } from "./admin-allowance-picker.js";
import { startButtonProgress } from "./action-feedback.js";

const byId = id => document.getElementById(id);
if (location.pathname.endsWith("/admin.html")) history.replaceState(null, "", location.pathname.replace(/admin\.html$/, "admin") + location.search + location.hash);
const account = getSharedAccountSession();
const drafts = new Map();
let pickers = [];
let last = null, oldUid = "", authBusy = false, authError = "", authActionLabel = "";
const controller = createAdminController({ account, onState: render });
function cell(text, className = "") { const element = document.createElement("td"); element.textContent = text; element.className = className; return element; }
function render(next) {
  last = next;
  const focusLabel = document.activeElement?.closest(".allowance-picker")?.querySelector("button")?.getAttribute("aria-label");
  pickers.forEach(picker => picker.dispose()); pickers = [];
  const uid = next.user?.uid || "";
  if (uid !== oldUid) { drafts.clear(); authError = ""; oldUid = uid; }
  const ready = next.status === "ready", checking = next.status === "checking";
  byId("admin-status").textContent = authError || (authBusy ? authActionLabel : next.message);
  byId("admin-status").classList.toggle("is-error", Boolean(authError) || next.error);
  byId("admin-status").setAttribute("aria-busy", String(checking || Boolean(next.pendingUid) || authBusy));
  byId("admin-gate").hidden = ready || (checking && next.accounts.length > 0);
  byId("admin-directory").hidden = !ready && !(checking && next.accounts.length > 0);
  byId("admin-sign-in").hidden = Boolean(uid) || checking;
  byId("admin-sign-in").disabled = authBusy;
  byId("admin-sign-out").hidden = !uid;
  byId("admin-sign-out").disabled = authBusy || Boolean(next.pendingUid);
  byId("admin-refresh").disabled = checking || authBusy || Boolean(next.pendingUid);
  byId("gate-heading").textContent = checking ? "Checking your account" : next.status === "signed-out" ? "Administrator sign-in" : next.status === "denied" ? "Administrator access required" : "Could not check access";
  byId("gate-description").textContent = checking ? "Restoring your account and checking access." : next.message;
  byId("admin-identity").textContent = uid ? "Signed in as " + (next.user.email || next.user.displayName || "Google account") : "";
  if (!ready && !next.accounts.length) { byId("admin-accounts").replaceChildren(); return; }
  const filter = byId("admin-search").value.trim().toLowerCase();
  const rows = next.accounts.filter(row => (row.name + " " + row.email).toLowerCase().includes(filter));
  byId("admin-count").textContent = next.accounts.length + " account" + (next.accounts.length === 1 ? "" : "s") + " loaded";
  byId("admin-more").hidden = !next.nextCursor;
  byId("admin-more").disabled = checking || authBusy || Boolean(next.pendingUid);
  byId("admin-empty").hidden = rows.length > 0;
  byId("admin-empty").textContent = next.accounts.length ? "No accounts match your search." : "No accounts are in the directory yet.";
  const elements = rows.map(row => {
    const tr = document.createElement("tr");
    const identity = cell("");
    const name = document.createElement("span"); name.className = "account-name"; name.textContent = row.name || "Google account";
    if (row.isAdmin) { const badge = document.createElement("span"); badge.className = "admin-badge"; badge.textContent = "Administrator"; name.append(badge); }
    const email = document.createElement("span"); email.className = "account-email"; email.textContent = row.email;
    identity.append(name, email); tr.append(identity, cell(row.workspaceCount === null ? "Not initialized" : String(row.workspaceCount)));
    const allowance = cell(""); const actions = cell("");
    if (row.isAdmin) allowance.textContent = "Unlimited";
    else {
      const selected = drafts.has(row.uid) ? drafts.get(row.uid) : row.maxWorkspaces;
      const save = document.createElement("button"); save.type = "button"; save.className = "button"; save.textContent = "Save";
      save.setAttribute("aria-label", "Save allowance for " + (row.name || row.email));
      save.disabled = !ready || authBusy || Boolean(next.pendingUid) || selected === row.maxWorkspaces;
      const picker = createAllowancePicker({ value: selected, label: "Workspace allowance for " + (row.name || row.email),
        disabled: !ready || authBusy || Boolean(next.pendingUid),
        onChange(value) { drafts.set(row.uid, value); save.disabled = !ready || authBusy || Boolean(next.pendingUid) || value === row.maxWorkspaces; }
      });
      pickers.push(picker);
      save.addEventListener("click", () => { void controller.save(row.uid, drafts.get(row.uid)).then(() => { if (controller.getState().accounts.find(entry => entry.uid === row.uid)?.maxWorkspaces === drafts.get(row.uid)) drafts.delete(row.uid); render(controller.getState()); }); });
      if (next.pendingUid === row.uid) startButtonProgress(save, "Saving…");
      allowance.append(picker.element); actions.append(save);
    }
    tr.append(allowance, actions); return tr;
  });
  byId("admin-accounts").replaceChildren(...elements);
  if (focusLabel) pickers.find(picker => picker.trigger.getAttribute("aria-label") === focusLabel && !picker.trigger.disabled)?.trigger.focus({ preventScroll: true });
}
byId("admin-search").addEventListener("input", () => last && render(last));
byId("admin-refresh").addEventListener("click", () => { authError = ""; void controller.refresh(); });
byId("admin-more").addEventListener("click", () => { void controller.loadMore(); });
for (const [id, action, text] of [["admin-sign-in", "signIn", "Signing in…"], ["admin-sign-out", "signOut", "Signing out…"]]) {
  byId(id).addEventListener("click", async () => {
    if (authBusy) return;
    authBusy = true; authError = ""; authActionLabel = text; byId(id).disabled = true;
    const finish = startButtonProgress(byId(id), text);
    render(controller.getState());
    try { await account[action](); }
    catch (error) { authError = error?.message || "The account request failed. Try again."; }
    finally { authBusy = false; finish(); render(controller.getState()); }
  });
}
void controller.start();
window.addEventListener("pagehide", () => { pickers.forEach(picker => picker.dispose()); controller.dispose(); }, { once: true });
