import test from "node:test";
import assert from "node:assert/strict";
import { createPopupSignIn } from "../public/src/auth-popup.js";
import { createFirebaseAdapter } from "../public/src/cloud-service.js";

const longLink = "https://atlas.example/workspace?example=flow#map=g." + "A".repeat(50000);
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function browserAt(href = longLink, initialState = { returnTo: "map", position: { x: 12, y: 34 } }) {
  const location = { href };
  let state = structuredClone(initialState);
  const changes = [];
  const history = {
    get state() { return state; },
    replaceState(nextState, title, url) {
      changes.push({ title, url });
      state = structuredClone(nextState);
      location.href = new URL(url, location.href).href;
    },
  };
  const eventTarget = new EventTarget();
  return { location, history, eventTarget, changes };
}

test("long map payload stays out of delayed auth URL construction and the exact link/state return on success", async () => {
  const browser = browserAt();
  const state = structuredClone(browser.history.state);
  const completion = deferred();
  let popupStarted = false;
  const signIn = createPopupSignIn(() => {
    popupStarted = true;
    return Promise.resolve().then(() => {
      const handler = new URL("https://auth.example/__/auth/handler");
      handler.searchParams.set("redirectUrl", browser.location.href);
      assert.ok(handler.href.length < 200);
      assert.equal(handler.searchParams.get("redirectUrl"), "https://atlas.example/workspace");
      return completion.promise;
    });
  }, browser);
  const result = { user: { uid: "disposable-owner" } };
  const pending = signIn();
  assert.equal(popupStarted, true);
  assert.equal(browser.location.href, "https://atlas.example/workspace");
  await Promise.resolve();
  completion.resolve(result);
  assert.equal(await pending, result);
  assert.equal(browser.location.href, longLink);
  assert.deepEqual(browser.history.state, state);
  assert.equal(browser.changes.length, 2);
});

for (const code of ["auth/popup-closed-by-user", "auth/popup-blocked", "auth/network-request-failed"]) {
  test("restore the map link after " + code + " and allow retry", async () => {
    const browser = browserAt();
    const error = Object.assign(new Error(code), { code });
    let calls = 0;
    const signIn = createPopupSignIn(() => {
      calls += 1;
      assert.equal(browser.location.href, "https://atlas.example/workspace");
      return calls === 1 ? Promise.reject(error) : Promise.resolve("signed-in");
    }, browser);
    await assert.rejects(signIn(), failure => failure === error);
    assert.equal(browser.location.href, longLink);
    assert.equal(await signIn(), "signed-in");
    assert.equal(browser.location.href, longLink);
  });
}

test("synchronous popup errors restore the map without masking the error", async () => {
  const browser = browserAt();
  const error = new Error("popup setup failed");
  const signIn = createPopupSignIn(() => { throw error; }, browser);
  await assert.rejects(signIn(), failure => failure === error);
  assert.equal(browser.location.href, longLink);
});

test("concurrent sign-in clicks share a single popup and cannot restore its URL prematurely", async () => {
  const browser = browserAt();
  const completion = deferred();
  let calls = 0;
  const signIn = createPopupSignIn(() => { calls += 1; return completion.promise; }, browser);
  const first = signIn();
  const second = signIn();
  assert.equal(first, second);
  assert.equal(calls, 1);
  assert.equal(browser.location.href, "https://atlas.example/workspace");
  completion.resolve("done");
  await Promise.all([first, second]);
  assert.equal(browser.location.href, longLink);
});

for (const navigation of ["cloud-workspace", "back-to-same-path", "new-history-state", "hashchange"]) {
  test("do not replace a newer route/history after " + navigation, async () => {
    const browser = browserAt();
    const completion = deferred();
    const signIn = createPopupSignIn(() => completion.promise, browser);
    const pending = signIn();
    if (navigation === "cloud-workspace") browser.history.replaceState(null, "", "/workspace?view=new-workspace");
    if (navigation === "back-to-same-path") browser.eventTarget.dispatchEvent(new Event("popstate"));
    if (navigation === "new-history-state") browser.history.replaceState({ returnTo: "another-map" }, "", "/workspace");
    if (navigation === "hashchange") {
      browser.location.href = "https://atlas.example/workspace#other-map";
      browser.eventTarget.dispatchEvent(new Event("hashchange"));
    }
    const nextUrl = browser.location.href;
    const nextState = browser.history.state;
    completion.resolve("done");
    await pending;
    assert.equal(browser.location.href, nextUrl);
    assert.equal(browser.history.state, nextState);
  });
}

test("plain landing/workspace/admin URLs invoke auth without a history change", async () => {
  for (const route of ["/", "/workspace", "/admin"]) {
    const browser = browserAt("https://atlas.example" + route, null);
    assert.equal(await createPopupSignIn(() => "signed-in", browser)(), "signed-in");
    assert.equal(browser.changes.length, 0);
  }
});

test("a browser that cannot shorten the URL refuses to send the map to auth", async () => {
  for (const mode of ["throws", "no-op"]) {
    const browser = browserAt();
    browser.history.replaceState = () => { if (mode === "throws") throw new Error("history unavailable"); };
    let started = false;
    const signIn = createPopupSignIn(() => { started = true; }, browser);
    await assert.rejects(signIn(), { code: "auth/sign-in-url-unavailable" });
    assert.equal(started, false);
    assert.equal(browser.location.href, longLink);
  }
});

test("the Firebase adapter waits for persistence then starts its Google popup from a short URL", async () => {
  const browser = browserAt();
  const ready = deferred();
  const auth = { currentUser: null };
  let calls = 0;
  const adapter = createFirebaseAdapter({ projectId: "demo-atlas-local" }, {
    app: { options: { projectId: "demo-atlas-local" } }, auth, db: {},
    persistenceReady: ready.promise, signInBrowser: browser,
    signInPopup: async (popupAuth, provider) => {
      calls += 1;
      assert.equal(popupAuth, auth);
      assert.equal(provider.providerId, "google.com");
      assert.deepEqual(provider.getCustomParameters(), { prompt: "select_account" });
      await Promise.resolve();
      assert.equal(browser.location.href, "https://atlas.example/workspace");
      return { user: { uid: "disposable-owner" } };
    },
  });
  const pending = adapter.signInGoogle();
  assert.equal(calls, 0);
  assert.equal(browser.location.href, longLink);
  ready.resolve();
  assert.equal((await pending).user.uid, "disposable-owner");
  assert.equal(calls, 1);
  assert.equal(browser.location.href, longLink);
});
