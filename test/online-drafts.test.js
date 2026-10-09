import test from "node:test";
import assert from "node:assert/strict";
import { createCloudUiController } from "../public/src/cloud-ui.js";
import {
  clearOnlineOwnerDraft,
  clearOnlineOwnerDraftIfMatches,
  readOnlineOwnerDraft,
  readOnlineOwnerDraftForOwnerEdit,
  writeOnlineOwnerDraft,
} from "../public/src/online-drafts.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    keys: () => [...values.keys()],
  };
}

const sampleGraph = {
  schemaVersion: 1,
  project: { name: "Private online map", description: "", type: "Software project" },
  nodes: [{ id: "one", label: "API", type: "API" }],
  edges: [],
};

test("online recovery drafts survive reload and are scoped to the owner UID and workspace", () => {
  const storage = memoryStorage();
  const workspaceId = "A".repeat(22);
  assert.equal(writeOnlineOwnerDraft(storage, {
    ownerUid: "owner-a", workspaceId, graph: sampleGraph, updatedAt: 100,
  }), true);
  assert.deepEqual(readOnlineOwnerDraft(storage, "owner-a", workspaceId), {
    version: 1, ownerUid: "owner-a", workspaceId, updatedAt: 100, graph: sampleGraph,
  });
  assert.equal(readOnlineOwnerDraft(storage, "owner-b", workspaceId), null);
  assert.equal(readOnlineOwnerDraft(storage, "", workspaceId), null);
  assert.equal(readOnlineOwnerDraft(storage, "owner-a", "B".repeat(22)), null);
});

test("an offline save keeps the owner draft available after a fresh workspace session", async () => {
  const storage = memoryStorage();
  const workspaceId = "A".repeat(22);
  const edited = { ...sampleGraph, nodes: [{ id: "one", label: "Changed API", type: "API" }] };
  const owner = { uid: "owner-a", displayName: "Owner" };
  const serviceFor = (saveWorkspace) => ({
    onAuthStateChanged(callback) { callback(owner); return () => {}; },
    async signInWithGoogle() { return owner; },
    async signOut() {},
    watchOwnedWorkspaces() { return () => {}; },
    watchWorkspace(target, callback) {
      callback({ status: "ready", workspace: { id: workspaceId, ownerId: "owner-a", name: "Private online map", currentRevision: 1, shared: false }, graph: sampleGraph });
      return () => {};
    },
    async saveWorkspace(input) { return saveWorkspace(input); },
    async createWorkspace() { throw new Error("not used"); },
    async setShared() { return null; },
    async deleteWorkspace() {},
  });
  const failingService = serviceFor(async () => { const error = new Error("offline"); error.code = "offline"; throw error; });
  const first = createCloudUiController({ loadService: async () => failingService, storage, saveDelay: 0 });
  await first.enableOnline();
  await first.openOwnedWorkspace(workspaceId);
  assert.equal(first.enterOwnerEditMode(), true);
  assert.equal(writeOnlineOwnerDraft(storage, { ownerUid: owner.uid, workspaceId, graph: edited }), true);
  first.queueSave(edited);
  await new Promise((resolve) => setTimeout(resolve, 15));
  assert.equal(first.state().status, "offline");
  assert.deepEqual(readOnlineOwnerDraftForOwnerEdit(storage, { mode: "owner", userUid: owner.uid, ownerUid: owner.uid, workspaceId })?.graph, edited);

  const freshService = serviceFor(async () => ({ currentRevision: 2 }));
  const afterReload = createCloudUiController({ loadService: async () => freshService, storage, saveDelay: 0 });
  await afterReload.enableOnline();
  await afterReload.openOwnedWorkspace(workspaceId);
  assert.equal(afterReload.enterOwnerEditMode(), true);
  assert.deepEqual(readOnlineOwnerDraftForOwnerEdit(storage, { mode: "owner", userUid: owner.uid, ownerUid: owner.uid, workspaceId })?.graph, edited);
});

test("a recovery draft is available only in explicit matching-owner edit mode", () => {
  const storage = memoryStorage();
  const workspaceId = "A".repeat(22);
  writeOnlineOwnerDraft(storage, { ownerUid: "owner-a", workspaceId, graph: sampleGraph });
  assert.equal(readOnlineOwnerDraftForOwnerEdit(storage, { mode: "viewer", userUid: "owner-a", ownerUid: "owner-a", workspaceId }), null);
  assert.equal(readOnlineOwnerDraftForOwnerEdit(storage, { mode: "owner", userUid: "owner-b", ownerUid: "owner-a", workspaceId }), null);
  assert.deepEqual(readOnlineOwnerDraftForOwnerEdit(storage, { mode: "owner", userUid: "owner-a", ownerUid: "owner-a", workspaceId })?.graph, sampleGraph);
});

test("clearing a recovery draft affects only the exact owner-workspace pair", () => {
  const storage = memoryStorage();
  const workspaceId = "A".repeat(22);
  writeOnlineOwnerDraft(storage, { ownerUid: "owner-a", workspaceId, graph: sampleGraph });
  writeOnlineOwnerDraft(storage, { ownerUid: "owner-b", workspaceId, graph: sampleGraph });
  assert.equal(clearOnlineOwnerDraft(storage, "owner-a", workspaceId), true);
  assert.equal(readOnlineOwnerDraft(storage, "owner-a", workspaceId), null);
  assert.ok(readOnlineOwnerDraft(storage, "owner-b", workspaceId));
});

test("failed saves and remote reloads keep the draft until the exact graph is server-confirmed", () => {
  const storage = memoryStorage();
  const workspaceId = "A".repeat(22);
  const edited = { ...sampleGraph, nodes: [{ id: "one", label: "Changed API", type: "API" }] };
  writeOnlineOwnerDraft(storage, { ownerUid: "owner-a", workspaceId, graph: edited, updatedAt: 200 });
  const remoteBeforeSave = { ...sampleGraph, nodes: [{ id: "one", label: "API", type: "API" }] };
  assert.equal(clearOnlineOwnerDraftIfMatches(storage, { ownerUid: "owner-a", workspaceId, confirmedGraph: remoteBeforeSave }), false);
  assert.deepEqual(readOnlineOwnerDraftForOwnerEdit(storage, { mode: "owner", userUid: "owner-a", ownerUid: "owner-a", workspaceId })?.graph, edited);
  assert.equal(clearOnlineOwnerDraftIfMatches(storage, { ownerUid: "owner-a", workspaceId, confirmedGraph: edited }), true);
  assert.equal(readOnlineOwnerDraft(storage, "owner-a", workspaceId), null);
});

test("invalid records and storage failures never produce a draft", () => {
  const storage = {
    getItem: () => JSON.stringify({ version: 1, ownerUid: "owner-a", workspaceId: "A".repeat(22), graph: { nodes: [], edges: [] } }),
    setItem: () => { throw new Error("quota"); },
    removeItem: () => { throw new Error("blocked"); },
  };
  assert.equal(readOnlineOwnerDraft(storage, "owner-a", "A".repeat(22)), null);
  assert.equal(writeOnlineOwnerDraft(storage, { ownerUid: "owner-a", workspaceId: "A".repeat(22), graph: sampleGraph }), false);
  assert.equal(clearOnlineOwnerDraft(storage, "owner-a", "A".repeat(22)), false);
});
