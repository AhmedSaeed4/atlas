import test from "node:test";
import assert from "node:assert/strict";
import { createCloudImportController, canImportArchitecture } from "../public/src/cloud-import.js";

const graph = { schemaVersion: 1, project: { name: "Fictional import", type: "Backend", description: "QA" }, nodes: [{ id: "api", label: "API", type: "API" }], edges: [] };
function fixture() {
  const values = new Map([["owner-library", "unchanged"]]);
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  let uid = "owner-a", ids = 0;
  const calls = [];
  const account = { getState: () => ({ status: "ready", user: uid ? { uid } : null }), getService: async () => ({}) };
  const createWorkspace = async input => { calls.push(input); return { id: input.workspaceId, ownerId: input.ownerUid, name: input.graph.project.name }; };
  const options = { account, storage, createWorkspace, idFactory: () => String.fromCharCode(65 + ids++).repeat(22) };
  return { values, storage, account, calls, options, setOwner: value => { uid = value; } };
}

test("cloud import is independent of active-map edit state, while viewers and signed-out users are blocked", () => {
  assert.equal(canImportArchitecture({ destination: "cloud", ownerUid: "a", canEdit: false }), true);
  assert.equal(canImportArchitecture({ destination: "cloud", ownerUid: "", canEdit: true }), false);
  assert.equal(canImportArchitecture({ destination: "cloud", ownerUid: "a", sharedViewer: true }), false);
  assert.equal(canImportArchitecture({ destination: "local", canEdit: true }), true);
  assert.equal(canImportArchitecture({ destination: "local", canEdit: false }), false);
});

test("explicit cloud import ignores automatic-save preference and touches only candidate metadata", async () => {
  const f = fixture();
  f.account.getPreferenceState = () => ({ saveFutureMaps: false });
  f.options.createWorkspace = async input => {
    f.calls.push(input);
    assert.equal(f.values.get("owner-library"), "unchanged");
    const candidates = [...f.values].filter(([key]) => key.startsWith("atlas.cloud-import.candidate.v1:"));
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0][1], input.workspaceId);
    assert.ok(!candidates[0][1].includes("Fictional import"));
    return { id: input.workspaceId, ownerId: input.ownerUid };
  };
  const result = await createCloudImportController(f.options).importMap({ graph, ownerUid: "owner-a" });
  assert.equal(result.status, "saved");
  assert.equal(result.current, true);
  assert.equal(f.calls.length, 1);
  assert.equal(f.values.size, 1);
  assert.equal(f.values.get("owner-library"), "unchanged");
});

test("repeated submit while upload is pending sends only one snapshot", async () => {
  const f = fixture();
  let complete;
  const started = new Promise(resolve => { f.options.createWorkspace = input => { f.calls.push(input); resolve(); return new Promise(done => { complete = () => done({ id: input.workspaceId, ownerId: input.ownerUid }); }); }; });
  const controller = createCloudImportController(f.options);
  const a = controller.importMap({ graph, ownerUid: "owner-a" });
  const b = controller.importMap({ graph, ownerUid: "owner-a" });
  assert.equal(a, b);
  await started;
  complete();
  await a;
  assert.equal(f.calls.length, 1);
});

test("lost response retry after controller recreation reuses the same workspace ID", async () => {
  const f = fixture();
  f.options.createWorkspace = async input => { f.calls.push(input); throw new Error("Reply lost after commit"); };
  await assert.rejects(createCloudImportController(f.options).importMap({ graph, ownerUid: "owner-a" }), /Reply lost/);
  f.options.createWorkspace = async input => { f.calls.push(input); return { id: input.workspaceId, ownerId: input.ownerUid }; };
  const result = await createCloudImportController(f.options).importMap({ graph, ownerUid: "owner-a" });
  assert.equal(result.status, "saved");
  assert.equal(f.calls[0].workspaceId, f.calls[1].workspaceId);
  assert.equal(f.values.size, 1);
});

test("closing the import during service initialization prevents uploading", async () => {
  const f = fixture();
  let active = true, finish;
  const started = new Promise(resolve => { f.account.getService = () => { resolve(); return new Promise(done => { finish = done; }); }; });
  const pending = createCloudImportController(f.options).importMap({ graph, ownerUid: "owner-a", isCurrent: () => active });
  await started;
  active = false;
  finish({});
  assert.equal((await pending).status, "stale");
  assert.equal(f.calls.length, 0);
});

test("account changes prevent sending a pending import to another owner", async () => {
  const f = fixture();
  f.account.getService = async () => { f.setOwner("owner-b"); return {}; };
  assert.equal((await createCloudImportController(f.options).importMap({ graph, ownerUid: "owner-a" })).status, "stale");
  assert.equal(f.calls.length, 0);
});

test("completed upload after close is reported as saved without permission to navigate", async () => {
  const f = fixture();
  let active = true;
  f.options.createWorkspace = async input => { active = false; return { id: input.workspaceId, ownerId: input.ownerUid }; };
  const result = await createCloudImportController(f.options).importMap({ graph, ownerUid: "owner-a", isCurrent: () => active });
  assert.equal(result.status, "saved");
  assert.equal(result.current, false);
  assert.equal(f.values.size, 1);
});

test("quota errors retain only the retry candidate and never create a local graph", async () => {
  const f = fixture();
  f.options.createWorkspace = async () => { const error = new Error("Workspace limit reached"); error.code = "workspace-limit"; throw error; };
  await assert.rejects(createCloudImportController(f.options).importMap({ graph, ownerUid: "owner-a" }), /limit reached/);
  assert.equal(f.values.size, 2);
  assert.equal(f.values.get("owner-library"), "unchanged");
  assert.ok([...f.values.values()].every(value => !value.includes("schemaVersion")));
});

test("storage failure refuses an upload whose retry candidate could be lost", async () => {
  const f = fixture();
  f.storage.setItem = () => { throw new Error("Storage full"); };
  await assert.rejects(createCloudImportController(f.options).importMap({ graph, ownerUid: "owner-a" }), /No map was uploaded/);
  assert.equal(f.calls.length, 0);
});
