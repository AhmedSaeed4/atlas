import test from "node:test";
import assert from "node:assert/strict";
import { verifyCloudAssociation } from "../public/src/cloud-reference-recovery.js";
import { workspaceForLocalAssociation } from "../public/src/cloud-associations.js";

const workspaceId = "A".repeat(22);
function fixture(overrides = {}) {
  // A new object models a receipt that predates the deployed fix and survived reload.
  const associations = JSON.parse(JSON.stringify({ local: { workspaceId, ownerUid: "owner-a", pending: false, committed: true, ...overrides } }));
  let uid = "owner-a", active = true, reads = 0, writes = 0, persisted;
  const options = {
    associations, projectId: "local", workspaceId, ownerUid: uid,
    getCurrentOwnerUid: () => uid, isCurrent: () => active,
    listWorkspaces: async () => { reads += 1; return { status: "ready", workspaces: [] }; },
    saveAssociations: () => { writes += 1; persisted = JSON.stringify(associations); return true; },
  };
  return { associations, options, setOwner: value => { uid = value; }, leave: () => { active = false; }, inspect: () => ({ reads, writes, persisted }) };
}

test("a persisted old committed receipt is retired only after a server-confirmed missing cloud copy", async () => {
  const f = fixture();
  const localMap = { id: "local", graph: { project: { name: "Keep this local map" }, nodes: [{ id: "api" }], edges: [] } };
  const before = JSON.stringify(localMap);
  assert.equal(workspaceForLocalAssociation(f.associations.local, "owner-a"), workspaceId);
  const result = await verifyCloudAssociation(f.options);
  assert.equal(result.status, "missing");
  assert.equal(workspaceForLocalAssociation(f.associations.local, "owner-a"), "");
  assert.equal(f.inspect().persisted, "{}");
  assert.equal(JSON.stringify(localMap), before);
  assert.equal(f.inspect().reads, 1);
  assert.equal(f.inspect().writes, 1);
});

test("a confirmed but still-pending admission receipt can recover its missing cloud copy", async () => {
  const f = fixture({ source: "fragment", pending: true, committed: true });
  assert.equal((await verifyCloudAssociation(f.options)).status, "missing");
  assert.deepEqual(f.associations, {});
});

test("an existing cloud copy is preserved even while its deletion is incomplete", async () => {
  for (const deleting of [false, true]) {
    const f = fixture(); const record = f.associations.local;
    const workspace = { id: workspaceId, ownerId: "owner-a", deleting };
    f.options.listWorkspaces = async () => ({ status: "ready", workspaces: [workspace] });
    const result = await verifyCloudAssociation(f.options);
    assert.equal(result.status, "present"); assert.equal(result.workspace, workspace);
    assert.equal(f.associations.local, record); assert.equal(f.inspect().writes, 0);
  }
});

test("offline, loading, malformed and permission failures never erase a saved reference", async () => {
  const results = [
    { status: "offline", workspaces: [] }, { status: "loading", workspaces: [] },
    { status: "error", workspaces: [] }, { status: "ready" },
    { status: "ready", workspaces: [{ id: workspaceId, ownerId: "owner-b" }] },
  ];
  for (const result of results) {
    const f = fixture(); const record = f.associations.local;
    f.options.listWorkspaces = async () => result;
    await assert.rejects(verifyCloudAssociation(f.options), /could not confirm/);
    assert.equal(f.associations.local, record); assert.equal(f.inspect().writes, 0);
  }
  const f = fixture(); const record = f.associations.local;
  f.options.listWorkspaces = async () => { throw Object.assign(new Error("Permission denied"), { code: "permission-denied" }); };
  await assert.rejects(verifyCloudAssociation(f.options), { code: "permission-denied" });
  assert.equal(f.associations.local, record); assert.equal(f.inspect().writes, 0);
});

test("unconfirmed candidates are kept without querying or replacing their receipt", async () => {
  for (const pending of [true, false]) {
    const f = fixture({ source: "manual", pending, committed: false, graphFingerprint: "original submitted version" });
    const record = f.associations.local;
    assert.equal((await verifyCloudAssociation(f.options)).status, "pending");
    assert.equal(f.associations.local, record);
    assert.deepEqual(f.inspect(), { reads: 0, writes: 0, persisted: undefined });
  }
});

test("references for another owner, unknown legacy ownership or another target stay untouched", async () => {
  for (const record of [
    { workspaceId, ownerUid: "owner-b", pending: false }, workspaceId,
    { workspaceId: "B".repeat(22), ownerUid: "owner-a", pending: false },
  ]) {
    const f = fixture(); f.associations.local = record;
    assert.equal((await verifyCloudAssociation(f.options)).status, "unverified");
    assert.equal(f.associations.local, record); assert.equal(f.inspect().reads, 0);
    assert.equal(f.inspect().writes, 0);
  }
});

test("changing account, route or receipt during the check prevents stale recovery", async () => {
  for (const change of [f => f.setOwner("owner-b"), f => f.leave(), f => { f.associations.local = { workspaceId: "B".repeat(22), ownerUid: "owner-a" }; }]) {
    const f = fixture(); let latest;
    f.options.listWorkspaces = async () => { change(f); latest = f.associations.local; return { status: "ready", workspaces: [] }; };
    assert.equal((await verifyCloudAssociation(f.options)).status, "stale");
    assert.equal(f.associations.local, latest); assert.equal(f.inspect().writes, 0);
  }
  const f = fixture(); f.leave();
  assert.equal((await verifyCloudAssociation(f.options)).status, "stale");
  assert.equal(f.inspect().reads, 0);
});

test("failed persistence restores the exact original receipt so recovery can be retried", async () => {
  for (const fail of [() => false, () => { throw new Error("storage full"); }]) {
    const f = fixture(); const record = f.associations.local;
    f.options.saveAssociations = fail;
    await assert.rejects(verifyCloudAssociation(f.options), /could not save/);
    assert.equal(f.associations.local, record);
  }
});
