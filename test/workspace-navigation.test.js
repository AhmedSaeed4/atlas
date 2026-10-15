import test from "node:test";
import assert from "node:assert/strict";
import { WORKSPACE_NAVIGATION_KEY, createWorkspaceNavigation, readWorkspaceNavigation } from "../public/src/workspace-navigation.js";

const a = "AAAAAAAAAAAAAAAAAAAAAA", b = "BBBBBBBBBBBBBBBBBBBBBB";
const owner = "owner-a";
function storage(initial) {
  const values = new Map(initial ? [[WORKSPACE_NAVIGATION_KEY, JSON.stringify(initial)]] : []);
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
function remembered() { return { version: 1, library: "cloud", ownerUid: owner, workspaceId: a }; }
function ready(workspaces = [{ id: b, ownerId: owner }, { id: a, ownerId: owner }]) {
  return { ownerUid: owner, status: "ready", workspaces };
}

test("refresh remembers the exact cloud map instead of the first sidebar row", () => {
  const store = storage();
  createWorkspaceNavigation({ storage: store }).rememberCloud(owner, a);
  const refreshed = createWorkspaceNavigation({ storage: store });
  assert.equal(refreshed.initial.library, "cloud");
  assert.equal(refreshed.resolveRestore(ready()).item.id, a);
  assert.equal(refreshed.resolveRestore(ready()), null, "later list changes must not steal selection");
});
test("only navigation metadata is stored; local library and autosave data are untouched", () => {
  const store = storage();
  store.values.set("atlas.autosave.future.v1", "false");
  store.values.set("owner-graph", "unchanged");
  createWorkspaceNavigation({ storage: store }).rememberCloud(owner, a);
  assert.deepEqual(JSON.parse(store.getItem(WORKSPACE_NAVIGATION_KEY)), remembered());
  assert.equal(store.getItem("atlas.autosave.future.v1"), "false");
  assert.equal(store.getItem("owner-graph"), "unchanged");
});
test("cloud restoration waits for verified identity and an authoritative same-owner list", () => {
  const nav = createWorkspaceNavigation({ storage: storage(remembered()) });
  assert.deepEqual(nav.accountReady(""), { status: "signed-out" });
  assert.equal(nav.hasPending(), true);
  for (const status of ["loading", "offline", "error"]) {
    assert.equal(nav.resolveRestore({ ...ready(), status }), null);
    assert.equal(nav.hasPending(), true);
  }
  assert.equal(nav.resolveRestore(ready()).item.id, a);
});
test("a different account never opens the old account's remembered map", () => {
  const nav = createWorkspaceNavigation({ storage: storage(remembered()) });
  assert.deepEqual(nav.accountReady("owner-b"), { status: "mismatch" });
  assert.equal(nav.hasPending(), false);
  assert.equal(nav.resolveRestore(ready()), null);
});
test("another owner's matching ID is not a restore candidate", () => {
  const nav = createWorkspaceNavigation({ storage: storage(remembered()) });
  assert.deepEqual(nav.resolveRestore(ready([{ id: a, ownerId: "owner-b" }])), { status: "missing" });
});
test("a deleted remembered map is forgotten without selecting another map or deleting data", () => {
  const store = storage(remembered());
  const nav = createWorkspaceNavigation({ storage: store });
  assert.deepEqual(nav.resolveRestore(ready([{ id: b, ownerId: owner }])), { status: "missing" });
  assert.equal(readWorkspaceNavigation(store).workspaceId, "");
  assert.equal(readWorkspaceNavigation(store).library, "cloud");
});
test("new local navigation cancels delayed cloud restoration and persists across refresh", () => {
  const store = storage(remembered());
  const nav = createWorkspaceNavigation({ storage: store });
  nav.rememberLocal();
  assert.equal(nav.resolveRestore(ready()), null);
  assert.equal(createWorkspaceNavigation({ storage: store }).initial.library, "local");
});
test("new map or library choices supersede any startup candidate", () => {
  const nav = createWorkspaceNavigation({ storage: storage(remembered()) });
  nav.cancelRestore();
  assert.equal(nav.resolveRestore(ready()), null);
  nav.rememberCloud(owner, b);
  assert.equal(nav.snapshot().workspaceId, b);
  assert.equal(nav.resolveRestore(ready()), null);
  nav.rememberCloudLibrary(owner);
  assert.equal(nav.snapshot().workspaceId, b);
});
test("explicit map links and examples can bypass restoration without overwriting the hint", () => {
  const store = storage(remembered());
  const nav = createWorkspaceNavigation({ storage: store, restore: false });
  assert.equal(nav.initial.library, "local");
  assert.equal(nav.hasPending(), false);
  assert.equal(nav.resolveRestore(ready()), null);
  assert.deepEqual(readWorkspaceNavigation(store), remembered());
});
test("deleting a different account or map does not clear the current pointer", () => {
  const nav = createWorkspaceNavigation({ storage: storage(remembered()) });
  assert.equal(nav.forgetWorkspace("owner-b", a), false);
  assert.equal(nav.forgetWorkspace(owner, b), false);
  assert.equal(nav.snapshot().workspaceId, a);
  assert.equal(nav.forgetWorkspace(owner, a), true);
  assert.equal(nav.snapshot().workspaceId, "");
});
test("corrupt, oversized and invalid navigation metadata falls back safely", () => {
  for (const raw of ["{", "x".repeat(1025), JSON.stringify({ ...remembered(), version: 2 }), JSON.stringify({ ...remembered(), ownerUid: "" }), JSON.stringify({ ...remembered(), workspaceId: "../bad" })]) {
    const nav = createWorkspaceNavigation({ storage: { getItem: () => raw } });
    assert.equal(nav.initial.library, "local");
    assert.equal(nav.hasPending(), false);
  }
});
test("blocked storage does not prevent ordinary workspace navigation", () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  const nav = createWorkspaceNavigation({ storage: blocked });
  assert.equal(nav.initial.library, "local");
  assert.equal(nav.rememberCloud(owner, a), false);
  assert.equal(nav.snapshot().workspaceId, a);
  assert.equal(nav.rememberLocal(), false);
  assert.equal(nav.snapshot().library, "local");
});

test("malformed falsey IDs cannot become a cloud navigation record", () => {
  for (const workspaceId of [0, false, [], {}]) {
    assert.equal(readWorkspaceNavigation(storage({ ...remembered(), workspaceId })).library, "local");
  }
});
test("a map being deleted cannot reopen during refresh", () => {
  const nav = createWorkspaceNavigation({ storage: storage(remembered()) });
  assert.deepEqual(nav.resolveRestore(ready([{ id: a, ownerId: owner, deleting: true }])), { status: "missing" });
});
test("an unavailable storage write can be retried with the same selection", () => {
  const store = storage();
  let blocked = true;
  const setItem = store.setItem;
  store.setItem = (key, value) => { if (blocked) throw new Error("quota"); setItem(key, value); };
  const nav = createWorkspaceNavigation({ storage: store });
  assert.equal(nav.rememberCloud(owner, a), false);
  assert.equal(nav.rememberCloud(owner, a), false);
  blocked = false;
  assert.equal(nav.rememberCloud(owner, a), true);
  assert.equal(createWorkspaceNavigation({ storage: store }).resolveRestore(ready()).item.id, a);
});

test("separate tabs keep their own cloud target across reloads", () => {
  const durable = storage(), firstTab = storage(), secondTab = storage();
  createWorkspaceNavigation({ storage: durable, tabStorage: firstTab }).rememberCloud(owner, a);
  const other = createWorkspaceNavigation({ storage: durable, tabStorage: secondTab });
  assert.equal(other.initial.workspaceId, a, "new tabs can resume the last browser choice");
  other.rememberCloud(owner, b);
  assert.equal(createWorkspaceNavigation({ storage: durable, tabStorage: firstTab }).resolveRestore(ready()).item.id, a);
  assert.equal(createWorkspaceNavigation({ storage: durable, tabStorage: secondTab }).resolveRestore(ready()).item.id, b);
});
test("invalid or blocked tab storage falls back to the browser hint", () => {
  const durable = storage(remembered());
  for (const tabStorage of [{ getItem: () => "{" }, { getItem() { throw new Error("blocked"); } }]) {
    assert.equal(createWorkspaceNavigation({ storage: durable, tabStorage }).initial.workspaceId, a);
  }
});
test("a tab can retain its selection even when durable browser storage is unavailable", () => {
  const tabStorage = storage();
  createWorkspaceNavigation({ tabStorage }).rememberCloud(owner, b);
  assert.equal(createWorkspaceNavigation({ tabStorage }).resolveRestore(ready()).item.id, b);
});
