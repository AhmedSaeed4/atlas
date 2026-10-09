import test from "node:test";
import assert from "node:assert/strict";
import { subscribeWhenReady, waitForAuthSession } from "../public/src/cloud-subscription.js";

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("subscription starts after the session is ready and returns its cleanup", async () => {
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });
  let starts = 0;
  let stops = 0;
  const unsubscribe = subscribeWhenReady(ready, () => {
    starts += 1;
    return () => { stops += 1; };
  });
  await settle();
  assert.equal(starts, 0);
  resolveReady();
  await settle();
  assert.equal(starts, 1);
  unsubscribe();
  assert.equal(stops, 1);
});

test("cancel before readiness prevents a late listener from starting", async () => {
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });
  let starts = 0;
  const unsubscribe = subscribeWhenReady(ready, () => { starts += 1; return () => {}; });
  unsubscribe();
  resolveReady();
  await settle();
  assert.equal(starts, 0);
});

test("a persistence failure reaches the listener error handler", async () => {
  const failure = Object.assign(new Error("session persistence unavailable"), { code: "auth/unsupported-persistence-type" });
  let seen;
  const unsubscribe = subscribeWhenReady(Promise.reject(failure), () => assert.fail("Listener must not start"), (error) => { seen = error; });
  await settle();
  assert.equal(seen, failure);
  unsubscribe();
});
test("auth readiness waits for persistence and token refresh for the same UID", async () => {
  let resolvePersistence;
  let resolveToken;
  const persistenceReady = new Promise((resolve) => { resolvePersistence = resolve; });
  const tokenReady = new Promise((resolve) => { resolveToken = resolve; });
  let tokenStarted = false;
  const auth = { currentUser: { uid: "owner-a", getIdToken: () => { tokenStarted = true; return tokenReady; } } };
  let finished = false;
  const readiness = waitForAuthSession({ auth, persistenceReady, uid: "owner-a" }).then(() => { finished = true; });
  await settle();
  assert.equal(tokenStarted, false);
  resolvePersistence();
  await settle();
  assert.equal(tokenStarted, true);
  assert.equal(finished, false);
  resolveToken();
  await readiness;
  assert.equal(finished, true);
});

test("auth readiness rejects a mismatched current UID before a Firestore operation", async () => {
  let tokenRequested = false;
  const auth = { currentUser: { uid: "owner-b", getIdToken: async () => { tokenRequested = true; } } };
  await assert.rejects(waitForAuthSession({ auth, persistenceReady: Promise.resolve(), uid: "owner-a" }), { code: "unauthenticated" });
  assert.equal(tokenRequested, false);
});

test("auth readiness rejects if the account changes during token refresh", async () => {
  const user = { uid: "owner-a", getIdToken: async () => { auth.currentUser = { uid: "owner-b" }; } };
  const auth = { currentUser: user };
  await assert.rejects(waitForAuthSession({ auth, persistenceReady: Promise.resolve(), uid: "owner-a" }), { code: "unauthenticated" });
});