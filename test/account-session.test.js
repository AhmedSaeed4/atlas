import test from "node:test";
import assert from "node:assert/strict";
import {
  accountSessionKeys,
  createAccountSession,
  hasAccountSessionHint,
  readFutureAutosavePreference,
  writeFutureAutosavePreference,
} from "../public/src/account-session.js";

function makeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}

function makeService(initialUser = null) {
  let user = initialUser;
  let observer = null;
  let observerError = null;
  let observerCount = 0;
  return {
    get observerCount() { return observerCount; },
    onAuthStateChanged(next, onError) {
      observer = next;
      observerError = onError;
      observerCount += 1;
      queueMicrotask(() => next(user));
      return () => {
        if (observer === next) observer = null;
        if (observerError === onError) observerError = null;
      };
    },
    async signInWithGoogle() {
      user = { uid: "owner-a", displayName: "Atlas Owner", email: "owner@example.test", accessToken: "must-not-leak" };
      observer?.(user);
      return user;
    },
    async signOut() { user = null; observer?.(null); },
    failAuth(error) { observerError?.(error); },
  };
}

test("account access stays lazy and the old online flag never becomes upload consent", async () => {
  const storage = makeStorage({ "atlas.online.enabled.v1": "true" });
  const service = makeService({ uid: "owner-a" });
  let loads = 0;
  const account = createAccountSession({ storage, loadService: async () => { loads += 1; return service; } });
  let observed;
  account.subscribe((state) => { observed = state; });
  assert.equal(observed.status, "idle");
  assert.equal(loads, 0);
  assert.equal(account.getPreferenceState().saveFutureMaps, false);
  assert.equal(readFutureAutosavePreference(storage), false);

  const [first, second] = await Promise.all([account.initialize(), account.initialize()]);
  assert.equal(first.user.uid, "owner-a");
  assert.equal(second.user.uid, "owner-a");
  assert.equal(loads, 1);
  assert.equal(service.observerCount, 1);
  assert.equal(hasAccountSessionHint(storage), true);
  assert.equal(Object.hasOwn(account.getState().user, "accessToken"), false);
  account.disposeForTests();
});

test("sign-in and sign-out update identity without changing autosave consent", async () => {
  const storage = makeStorage();
  const service = makeService();
  const account = createAccountSession({ storage, loadService: async () => service });
  await account.initialize();
  const epoch = account.getAuthInteractionEpoch();
  const identity = await account.signIn();
  assert.equal(identity.uid, "owner-a");
  assert.equal(account.getState().user.uid, "owner-a");
  assert.equal(account.getAuthInteractionEpoch(), epoch + 1);
  assert.equal(account.getPreferenceState().saveFutureMaps, false);
  assert.equal(hasAccountSessionHint(storage), true);
  await account.signOut();
  assert.equal(account.getState().user, null);
  assert.equal(account.getAuthInteractionEpoch(), epoch + 2);
  assert.equal(account.getPreferenceState().saveFutureMaps, false);
  assert.equal(hasAccountSessionHint(storage), false);
  account.disposeForTests();
});

test("autosave preference writes an explicit false value and stays independent of sign-in", async () => {
  const storage = makeStorage({ [accountSessionKeys.futureAutosave]: "true" });
  const service = makeService({ uid: "owner-a" });
  const account = createAccountSession({ storage, loadService: async () => service });
  assert.equal(account.getPreferenceState().saveFutureMaps, true);
  assert.equal(account.setSaveFutureMaps(false), true);
  assert.equal(storage.getItem(accountSessionKeys.futureAutosave), "false");
  assert.equal(readFutureAutosavePreference(storage), false);
  assert.equal(account.getState().status, "idle");
  await account.initialize();
  assert.equal(account.getState().user.uid, "owner-a");
  assert.equal(account.getPreferenceState().saveFutureMaps, false);
  account.disposeForTests();
});

test("initialized sign-in invokes Google before yielding from the click call", async () => {
  const service = makeService();
  let popupStarted = false;
  service.signInWithGoogle = () => {
    popupStarted = true;
    const user = { uid: "owner-a", displayName: "Atlas Owner" };
    return Promise.resolve(user);
  };
  const account = createAccountSession({ storage: makeStorage(), loadService: async () => service });
  await account.initialize();
  const signingIn = account.signIn();
  assert.equal(popupStarted, true);
  await signingIn;
  account.disposeForTests();
});

test("auth observer errors clear identity but retain the hint for a later retry", async () => {
  const storage = makeStorage();
  const service = makeService({ uid: "owner-a" });
  const account = createAccountSession({ storage, loadService: async () => service });
  await account.initialize();
  assert.equal(account.getState().user.uid, "owner-a");
  service.failAuth(Object.assign(new Error("auth observer stopped"), { code: "auth/network-request-failed" }));
  assert.equal(account.getState().status, "error");
  assert.equal(account.getState().user, null);
  assert.equal(hasAccountSessionHint(storage), true);
  account.disposeForTests();
});
test("preference write errors are reported and failed enablement remains off", () => {
  const storage = {
    getItem(key) { return key === accountSessionKeys.futureAutosave ? null : null; },
    setItem() { throw new Error("storage full"); },
    removeItem() { throw new Error("remove blocked"); },
  };
  const account = createAccountSession({ storage, loadService: async () => makeService() });
  assert.equal(account.setSaveFutureMaps(true), false);
  const state = account.getPreferenceState();
  assert.equal(state.saveFutureMaps, false);
  assert.equal(state.persisted, false);
  assert.equal(state.error.code, "storage-unavailable");
  assert.equal(writeFutureAutosavePreference(storage, false), false);
  account.disposeForTests();
});
const settle = () => new Promise(resolve => setImmediate(resolve));
function makeEvents() {
  const listeners = new Set();
  return {
    addEventListener(type, listener) { if (type === "storage") listeners.add(listener); },
    removeEventListener(type, listener) { if (type === "storage") listeners.delete(listener); },
    emit(event) { for (const listener of [...listeners]) listener(event); },
    get size() { return listeners.size; },
  };
}

test("restoration stays local and lazy without a prior account hint", async () => {
  const storage = makeStorage();
  const events = makeEvents();
  let loads = 0;
  const account = createAccountSession({ storage, eventTarget: events, loadService: async () => { loads++; return makeService(); } });
  const restored = await account.restore();
  assert.equal(restored.status, "idle");
  assert.equal(loads, 0);
  assert.equal(events.size, 1);
  account.disposeForTests();
  assert.equal(events.size, 0);
});

test("a new document or tab restores verified account identity without enabling uploads", async () => {
  const storage = makeStorage({ [accountSessionKeys.sessionHint]: "true" });
  let loads = 0;
  const createPage = () => createAccountSession({ storage, eventTarget: makeEvents(), loadService: async () => {
    loads++;
    return makeService({ uid: "owner-a", email: "owner@example.test" });
  } });
  for (let page = 0; page < 3; page++) {
    const account = createPage();
    const pending = account.restore();
    assert.equal(account.getState().status, "initializing");
    assert.equal(account.getState().user, null);
    assert.equal((await pending).user.uid, "owner-a");
    assert.equal(account.getPreferenceState().saveFutureMaps, false);
    account.disposeForTests();
  }
  assert.equal(loads, 3);
});

test("a stale session hint never supplies identity and a verified signed-out result clears it", async () => {
  const storage = makeStorage({ [accountSessionKeys.sessionHint]: "true" });
  const account = createAccountSession({ storage, eventTarget: makeEvents(), loadService: async () => makeService(null) });
  await account.restore();
  assert.equal(account.getState().user, null);
  assert.equal(hasAccountSessionHint(storage), false);
  assert.equal(account.getPreferenceState().saveFutureMaps, false);
  account.disposeForTests();
});

test("an idle landing tab wakes after another tab signs in and follows SDK sign-out", async () => {
  const storage = makeStorage();
  const events = makeEvents();
  const service = makeService({ uid: "owner-a" });
  let loads = 0;
  const account = createAccountSession({ storage, eventTarget: events, loadService: async () => { loads++; return service; } });
  await account.restore();
  events.emit({ key: accountSessionKeys.sessionHint, newValue: "true", storageArea: makeStorage() });
  await settle();
  assert.equal(loads, 0);
  storage.setItem(accountSessionKeys.sessionHint, "true");
  events.emit({ key: accountSessionKeys.sessionHint, newValue: "true", storageArea: storage });
  await settle();
  assert.equal(loads, 1);
  assert.equal(account.getState().user.uid, "owner-a");
  assert.equal(account.getPreferenceState().saveFutureMaps, false);
  // Firebase LOCAL delivers cross-tab sign-out via its auth observer, not a hint identity.
  await service.signOut();
  assert.equal(account.getState().user, null);
  assert.equal(hasAccountSessionHint(storage), false);
  account.disposeForTests();
  events.emit({ key: accountSessionKeys.sessionHint, storageArea: storage });
  assert.equal(events.size, 0);
});

test("a failed restoration retains only the retry hint and can recover on a later page", async () => {
  const storage = makeStorage({ [accountSessionKeys.sessionHint]: "true" });
  const service = makeService();
  service.onAuthStateChanged = (_next, onError) => {
    queueMicrotask(() => onError(new Error("temporary account check failure")));
    return () => {};
  };
  const failed = createAccountSession({ storage, eventTarget: makeEvents(), loadService: async () => service });
  await assert.rejects(failed.restore(), /temporary/);
  assert.equal(failed.getState().status, "error");
  assert.equal(failed.getState().user, null);
  assert.equal(hasAccountSessionHint(storage), true);
  failed.disposeForTests();
  const retry = createAccountSession({ storage, eventTarget: makeEvents(), loadService: async () => makeService({ uid: "owner-a" }) });
  assert.equal((await retry.restore()).user.uid, "owner-a");
  retry.disposeForTests();
});
