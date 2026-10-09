import test from "node:test";
import assert from "node:assert/strict";
import { accountProfileFromClaims, accountUid, workspaceLimit, validateWorkspaceLimit } from "../public/src/account-access.js";
import { addRegistryWorkspace, removeRegistryWorkspace } from "../public/src/cloud-quota.js";
const ids = Array.from({ length: 42 }, (_, n) => String(n).padStart(22, "A"));
const quota = count => Object.freeze({ schemaVersion: 1, workspaceIds: Object.freeze(ids.slice(0, count)) });
test("default, custom and unlimited allowances never reset or mutate existing workspace membership", () => {
  assert.equal(workspaceLimit(null), 20);
  for (const maximum of [20, 30, 40]) {
    assert.equal(workspaceLimit({ schemaVersion: 1, maxWorkspaces: maximum }), maximum);
    assert.equal(addRegistryWorkspace(quota(maximum - 1), ids[maximum - 1], maximum).length, maximum);
    assert.throws(() => addRegistryWorkspace(quota(maximum), ids[maximum], maximum), { code: "workspace-limit" });
  }
  assert.equal(addRegistryWorkspace(quota(41), ids[41], null).length, 42);
  assert.throws(() => addRegistryWorkspace(quota(30), ids[31], 20), { code: "workspace-limit" });
  assert.equal(removeRegistryWorkspace(quota(30), ids[0]).length, 29);
});
test("corrupt allowance values fail closed instead of accidentally granting unlimited", () => {
  for (const value of [undefined, false, "unlimited", -1, 0, 21, 100, Infinity]) {
    assert.throws(() => workspaceLimit({ schemaVersion: 1, maxWorkspaces: value }), { code: "quota-invalid" });
    assert.throws(() => validateWorkspaceLimit(value), { code: "invalid-limit" });
  }
  assert.throws(() => workspaceLimit({ schemaVersion: 2, maxWorkspaces: null }), { code: "quota-invalid" });
});
test("directory enrollment uses verified token claims only and rejects unsafe identifiers", () => {
  assert.deepEqual(accountProfileFromClaims("member", { email_verified: true, email: "member@example.test", name: "Member" }), { schemaVersion: 1, uid: "member", email: "member@example.test", name: "Member" });
  assert.equal(accountProfileFromClaims("member", { email_verified: false, email: "member@example.test", name: "Member" }), null);
  assert.equal(accountProfileFromClaims("member", { email_verified: true, email: "member@example.test" }), null);
  for (const uid of ["", "../admin", "a/b", "x".repeat(129), null]) assert.throws(() => accountUid(uid), { code: "invalid-account" });
});
