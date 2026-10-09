import test from "node:test";
import assert from "node:assert/strict";
import { createAdminController } from "../public/src/admin-controller.js";
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function fixture({ user = { uid: "admin", email: "admin@example.test" }, admin = true, list, save } = {}) {
  let state = { initialized: true, status: "ready", user }, listener;
  const calls = [];
  const service = { getAdminAccess: async () => ({ isAdmin: admin }), listAdminAccounts: list || (async () => ({ accounts: [{ uid: "member", name: "Member", maxWorkspaces: 20, allowanceUpdatedAt: null, workspaceCount: 1 }], nextCursor: null })),
    setAccountLimit: async options => { calls.push(options); return save ? save(options) : { maxWorkspaces: options.maxWorkspaces, allowanceUpdatedAt: "new-time" }; } };
  const account = { getState: () => state, getService: async () => service, initialize: async () => state, subscribe(fn) { listener = fn; fn(state); return () => {}; } };
  const controller = createAdminController({ account });
  return { controller, calls, change(user) { state = { ...state, user }; listener(state); } };
}
test("signed-out and non-admin visitors get no directory or allowance actions", async () => {
  const signedOut = fixture({ user: null }); await signedOut.controller.start();
  assert.equal(signedOut.controller.getState().status, "signed-out");
  const denied = fixture({ admin: false, list: () => { throw Error("Must not list"); } }); await denied.controller.start(); await tick();
  assert.equal(denied.controller.getState().status, "denied");
  await denied.controller.save("member", null); assert.equal(denied.calls.length, 0);
});
test("changing accounts clears private rows immediately and ignores a late directory result", async () => {
  let resolve; const pending = new Promise(done => { resolve = done; });
  const setup = fixture({ list: () => pending }); await setup.controller.start(); await tick(); setup.change(null);
  assert.deepEqual(setup.controller.getState().accounts, []);
  resolve({ accounts: [{ uid: "secret", maxWorkspaces: 40 }], nextCursor: null }); await tick();
  assert.equal(setup.controller.getState().status, "signed-out"); assert.deepEqual(setup.controller.getState().accounts, []);
});
test("save is scoped, blocks duplicates and confirms only the returned allowance", async () => {
  let resolve; const pending = new Promise(done => { resolve = done; });
  const setup = fixture({ save: () => pending }); await setup.controller.start(); await tick();
  const first = setup.controller.save("member", 40); await setup.controller.save("member", 30);
  assert.equal(setup.calls.length, 1); assert.equal(setup.controller.getState().pendingUid, "member");
  assert.equal(setup.calls[0].expectedAdminUid, "admin"); assert.equal(setup.calls[0].expectedUpdatedAt, null);
  resolve({ maxWorkspaces: 40, allowanceUpdatedAt: "time" }); await first;
  assert.equal(setup.controller.getState().accounts[0].maxWorkspaces, 40); assert.equal(setup.controller.getState().pendingUid, "");
});
test("save failure restores actions and stale completions cannot expose another account's data", async () => {
  const failed = fixture({ save: async () => { throw Error("Offline"); } }); await failed.controller.start(); await tick(); await failed.controller.save("member", null);
  assert.equal(failed.controller.getState().accounts[0].maxWorkspaces, 20); assert.equal(failed.controller.getState().pendingUid, ""); assert.equal(failed.controller.getState().error, true);
  let resolve; const changed = fixture({ save: () => new Promise(done => { resolve = done; }) }); await changed.controller.start(); await tick();
  const saving = changed.controller.save("member", 30); changed.change(null); resolve({ maxWorkspaces: 30 }); await saving;
  assert.deepEqual(changed.controller.getState().accounts, []); assert.equal(changed.controller.getState().status, "signed-out");
});
