import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { bootstrapWrites, privateRequestOptions } from "../scripts/admin-bootstrap-model.js";
const users = [{ localId: "admin", displayName: "Administrator", email: "admin@example.test", emailVerified: true }, { localId: "member", displayName: "Member", email: "member@example.test", emailVerified: true }];
const setup = overrides => bootstrapWrites({ project: "demo-atlas-admin", users, administratorUid: "admin", ...overrides });
test("bootstrap is limited to verified admin configuration, own unlimited allowance and Auth profile metadata", () => {
  const writes = setup();
  assert.equal(writes.length, 4);
  assert.equal(writes[0].currentDocument.exists, false);
  assert.equal(writes[1].update.fields.maxWorkspaces.nullValue, null);
  assert.ok(writes.every(write => !write.update.name.includes("workspaces/") && !write.update.name.includes("workspaceQuota/")));
  assert.ok(!JSON.stringify(writes).match(/password|token|photoURL|lastLogin/i));
});
test("bootstrap never replaces another admin, trusts an unverified account, or overwrites concurrent setup", () => {
  assert.throws(() => setup({ existingAdmin: { fields: { adminUid: { stringValue: "someone-else" } } } }), { code: "administrator-mismatch" });
  assert.throws(() => setup({ users: [{ ...users[0], emailVerified: false }] }), { code: "invalid-administrator" });
  assert.throws(() => setup({ users: [{ ...users[0], disabled: true }] }), { code: "invalid-administrator" });
  const existingAdmin = { updateTime: "2026-01-01T00:00:00Z", fields: { adminUid: { stringValue: "admin" } } };
  const writes = setup({ existingAdmin });
  assert.deepEqual(writes[0], { verify: "projects/demo-atlas-admin/databases/(default)/documents/system/adminAccess", currentDocument: { updateTime: existingAdmin.updateTime } });
});
test("repeat bootstrap is idempotent and preserves profile creation timestamps", () => {
  const writes = setup();
  const profiles = new Map(writes.filter(write => write.update.name.includes("/accountProfiles/")).map(write => [write.update.fields.uid.stringValue, { fields: { ...write.update.fields, createdAt: { timestampValue: "2026-01-01T00:00:00Z" } }, updateTime: "version" }]));
  const repeated = setup({ profiles, existingAdmin: { fields: { adminUid: { stringValue: "admin" } }, updateTime: "version" }, ownLimit: { fields: { schemaVersion: { integerValue: "1" }, maxWorkspaces: { nullValue: null } } } });
  assert.equal(repeated.length, 1); assert.ok(repeated[0].verify);
  const updated = setup({ profiles, users: [users[0], { ...users[1], displayName: "New name" }] });
  assert.deepEqual(updated.at(-1).update.fields.createdAt, { timestampValue: "2026-01-01T00:00:00Z" });
  assert.equal(updated.at(-1).currentDocument.updateTime, "version");
});

test("parallel metadata reads and post-commit confirmation keep separate CLI request paths and bodies", async () => {
  const require = createRequire(import.meta.url);
  const { Client } = require("firebase-tools/lib/apiv2.js");
  const client = new Client({ urlPrefix: "https://example.test", auth: false });
  client.request = async options => {
    await Promise.resolve();
    return { body: { path: options.path, method: options.method, payload: options.body } };
  };
  const [config, allowance, profile] = await Promise.all([
    client.get("/system/adminAccess", privateRequestOptions()),
    client.get("/accountLimits/admin", privateRequestOptions()),
    client.get("/accountProfiles/member", privateRequestOptions())
  ]);
  assert.deepEqual([config.body.path, allowance.body.path, profile.body.path],
    ["/system/adminAccess", "/accountLimits/admin", "/accountProfiles/member"]);
  await client.post("/documents:commit", { writes: [] }, privateRequestOptions());
  const confirmed = await client.get("/system/adminAccess", privateRequestOptions());
  assert.equal(confirmed.body.method, "GET");
  assert.equal(confirmed.body.payload, undefined);
  assert.deepEqual(privateRequestOptions().skipLog,
    { body: true, resBody: true, queryParams: true, reqHeaders: true, resHeaders: true });
});
