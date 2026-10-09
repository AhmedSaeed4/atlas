import { validateWorkspaceLimit } from "./account-access.js";

export function createAdminController({ account, onState = () => {} }) {
  let service = null, epoch = 0, identityUid = "", unsubscribe = null;
  let state = { status: "checking", user: null, accounts: [], nextCursor: null, pendingUid: "", message: "Checking administrator access…", error: false };
  const snapshot = () => Object.freeze({ ...state, accounts: Object.freeze(state.accounts.map(row => Object.freeze({ ...row }))) });
  function emit(next) { state = { ...state, ...next }; onState(snapshot()); }
  const current = (scope, uid) => scope === epoch && identityUid === uid && account.getState().user?.uid === uid;
  async function load({ append = false } = {}) {
    const uid = identityUid;
    if (!uid || state.pendingUid || (append && !state.nextCursor)) return;
    const scope = ++epoch;
    const cursor = append ? state.nextCursor : "";
    const previous = append ? state.accounts : [];
    emit({ status: "checking", accounts: previous, message: append ? "Loading more accounts…" : "Checking administrator access…", error: false });
    try {
      service = await account.getService();
      if (!current(scope, uid)) return;
      const access = await service.getAdminAccess();
      if (!current(scope, uid)) return;
      if (!access.isAdmin) { emit({ status: "denied", accounts: [], nextCursor: null, message: "This page is only available to the administrator." }); return; }
      emit({ message: "Loading accounts…" });
      const result = await service.listAdminAccounts({ afterUid: cursor });
      if (!current(scope, uid)) return;
      const unique = new Map([...previous, ...result.accounts].map(row => [row.uid, row]));
      emit({ status: "ready", accounts: [...unique.values()], nextCursor: result.nextCursor, message: "", error: false });
    } catch (error) {
      if (!current(scope, uid)) return;
      emit({ status: "error", accounts: [], nextCursor: null, message: error?.message || "Accounts could not be loaded. Try again.", error: true });
    }
  }
  async function save(targetUid, maximum) {
    if (state.status !== "ready" || state.pendingUid) return;
    const row = state.accounts.find(entry => entry.uid === targetUid);
    if (!row || row.isAdmin) return;
    validateWorkspaceLimit(maximum);
    const uid = identityUid, scope = epoch;
    emit({ pendingUid: targetUid, message: "Saving workspace allowance…", error: false });
    try {
      const result = await service.setAccountLimit({ targetUid, maxWorkspaces: maximum,
        expectedUpdatedAt: row.allowanceUpdatedAt, expectedAdminUid: uid });
      if (!current(scope, uid)) return;
      emit({ accounts: state.accounts.map(entry => entry.uid === targetUid ? { ...entry, ...result } : entry),
        pendingUid: "", message: "Workspace allowance saved.", error: false });
    } catch (error) {
      if (!current(scope, uid)) return;
      emit({ pendingUid: "", message: error?.message || "The allowance could not be saved. Try again.", error: true });
      if (["permission-denied", "admin-required", "account-changed"].includes(error?.code)) {
        emit({ status: "denied", accounts: [], nextCursor: null });
      }
    }
  }
  function observe(next) {
    const nextUid = next.user?.uid || "";
    if (nextUid && nextUid === identityUid && next.status !== "error") return;
    identityUid = nextUid; epoch += 1;
    emit({ user: next.user, accounts: [], nextCursor: null, pendingUid: "", error: next.status === "error",
      status: nextUid ? "checking" : next.status === "error" ? "error" : next.initialized ? "signed-out" : "checking",
      message: nextUid ? "Checking administrator access…" : next.status === "error" ? "Your account could not be checked. Try again." : next.initialized ? "Sign in with your administrator account to continue." : "Restoring your account…" });
    if (nextUid) void load();
  }
  return Object.freeze({
    getState: snapshot,
    async start() {
      unsubscribe = account.subscribe(observe);
      try { await account.initialize(); } catch { observe(account.getState()); }
    },
    refresh: () => identityUid ? load() : account.initialize().catch(() => observe(account.getState())),
    loadMore: () => load({ append: true }),
    save,
    dispose() { epoch += 1; identityUid = ""; unsubscribe?.(); },
  });
}
