import test from "node:test";
import assert from "node:assert/strict";
import { CloudConflictError, CloudServiceError, createCloudService } from "../public/src/cloud-service.js";

const id = "A".repeat(22);
const revision = "R".repeat(22);
const graph = {
  schemaVersion: 1,
  project: { name: "Service test", description: "" , type: "Software project" },
  nodes: [{ id: "node-1", label: "API", type: "Service", description: "" }],
  edges: [],
};
const metadata = (overrides = {}) => ({
  schemaVersion: 1,
  ownerId: "owner-1",
  shared: false,
  deleting: false,
  name: "Service test",
  projectType: "Software project",
  currentRevision: revision,
  previousRevision: null,
  chunkCount: 1,
  byteLength: 128,
  nodeCount: 1,
  edgeCount: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

function makeAdapter() {
  let authCallback;
  let user = { uid: "owner-1", displayName: "Atlas Owner", email: "owner@example.test", getIdToken: () => "do-not-expose" };
  const calls = { creates: [], saves: [], ownerWatches: [], workspaceWatches: [], unsubscribed: 0 };
  const adapter = {
    observeAuth(callback) { authCallback = callback; callback(user); return () => {}; },
    signInGoogle: async () => ({ user }),
    signOut: async () => { user = null; authCallback?.(null); },
    listWorkspaces: async () => ({ status: "ready", workspaces: [metadata({ id })] }),
    watchOwnedWorkspaces(uid, callback) {
      const entry = { uid, callback, active: true };
      calls.ownerWatches.push(entry);
      return () => { entry.active = false; calls.unsubscribed += 1; };
    },
    createWorkspace: async (uid, encoded, candidateWorkspaceId = "") => {
      calls.creates.push({ uid, encoded, candidateWorkspaceId });
      return metadata({ id: candidateWorkspaceId || id, ownerId: uid, currentRevision: revision, byteLength: encoded.byteLength, nodeCount: encoded.graph.nodes.length, edgeCount: encoded.graph.edges.length });
    },
    saveWorkspace: async (uid, workspaceId, encoded, expectedRevision) => {
      calls.saves.push({ uid, workspaceId, encoded, expectedRevision });
      return metadata({ id: workspaceId, ownerId: uid, previousRevision: expectedRevision, currentRevision: "S".repeat(22), byteLength: encoded.byteLength, nodeCount: encoded.graph.nodes.length, edgeCount: encoded.graph.edges.length });
    },
    watchWorkspace(uid, workspaceId, callback) {
      const entry = { uid, workspaceId, callback, active: true };
      calls.workspaceWatches.push(entry);
      return () => { entry.active = false; calls.unsubscribed += 1; };
    },
    deleteWorkspace: async () => {},
    setShared: async (_uid, _workspaceId, enabled) => enabled,
  };
  return { adapter, calls, setUser(next) { user = next; authCallback?.(next); } };
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

test("auth observers receive a safe identity without Firebase tokens", async () => {
  const { adapter } = makeAdapter();
  const service = createCloudService({ adapter });
  let seen;
  const unsubscribe = service.onAuthStateChanged((identity) => { seen = identity; });
  assert.deepEqual(seen, {
    uid: "owner-1",
    displayName: "Atlas Owner",
    email: "owner@example.test",
    photoURL: "",
  });
  assert.equal("getIdToken" in seen, false);
  unsubscribe();
  service.dispose();
});

test("create validates the graph and returns a full owner summary", async () => {
  const { adapter, calls } = makeAdapter();
  const service = createCloudService({ adapter });
  const created = await service.createWorkspace({ graph });
  assert.equal(created.id, id);
  assert.equal(created.ownerId, "owner-1");
  assert.equal(created.currentRevision, revision);
  assert.equal(calls.creates.length, 1);
  assert.equal(calls.creates[0].encoded.graph.nodes.length, 1);
  await assert.rejects(service.createWorkspace({ graph: { project: {}, nodes: [{ id: "n1", label: "Node", type: "Service" }], edges: [{ source: "missing", target: "n1" }] } }), { code: "invalid-graph" });
  service.dispose();
});

test("create passes a stable candidate and rejects an unexpected creator UID before adapter writes", async () => {
  const { adapter, calls } = makeAdapter();
  const service = createCloudService({ adapter });
  const created = await service.createWorkspace({ graph, workspaceId: id, expectedOwnerUid: "owner-1" });
  assert.equal(created.id, id);
  assert.equal(calls.creates.length, 1);
  assert.equal(calls.creates[0].candidateWorkspaceId, id);
  await assert.rejects(
    service.createWorkspace({ graph, workspaceId: id, expectedOwnerUid: "owner-2" }),
    { code: "account-changed" },
  );
  assert.equal(calls.creates.length, 1);
  service.dispose();
});

test("owner list and live watch retain ownerId and loading states", async () => {
  const { adapter, calls } = makeAdapter();
  const service = createCloudService({ adapter });
  const listed = await service.listWorkspaces();
  assert.equal(listed.workspaces[0].ownerId, "owner-1");
  const events = [];
  const stop = service.watchOwnedWorkspaces((event) => events.push(event));
  await settle();
  const listener = calls.ownerWatches.at(-1);
  listener.callback({ status: "loading", workspaces: [] });
  listener.callback({ status: "ready", workspaces: [metadata({ id })] });
  assert.equal(events.some((event) => event.status === "loading"), true);
  assert.equal(events.at(-1).workspaces[0].ownerId, "owner-1");
  stop();
  service.dispose();
});

test("save exposes an explicit compare-and-swap conflict without false success", async () => {
  const { adapter } = makeAdapter();
  adapter.saveWorkspace = async (_uid, _workspaceId, _encoded, expected) => {
    throw new CloudConflictError(expected, "T".repeat(22));
  };
  const service = createCloudService({ adapter });
  await assert.rejects(
    service.saveWorkspace({ workspaceId: id, graph, expectedRevision: revision }),
    (error) => error.code === "conflict" && error.status === "conflict" && error.actualRevision === "T".repeat(22),
  );
  service.dispose();
});

test("watch callbacks are unsubscribed and restarted on account changes", async () => {
  const { adapter, calls, setUser } = makeAdapter();
  const service = createCloudService({ adapter });
  const events = [];
  const stop = service.watchWorkspace({ workspaceId: id }, (event) => events.push(event));
  await settle();
  assert.equal(calls.workspaceWatches[0].uid, "owner-1");
  calls.workspaceWatches[0].callback({
    status: "ready",
    metadata: metadata({ id }),
    chunks: { graph },
  });
  assert.equal(events.at(-1).status, "ready");
  assert.equal(events.at(-1).workspace.ownerId, "owner-1");
  setUser({ uid: "owner-2", displayName: "Other" });
  await settle();
  assert.equal(calls.workspaceWatches[0].active, false);
  assert.equal(calls.workspaceWatches[1].uid, "owner-2");
  stop();
  assert.equal(calls.workspaceWatches[1].active, false);
  service.dispose();
});

test("disabled configuration fails clearly and popup blocking has an actionable message", async () => {
  const disabled = createCloudService({ config: {} });
  await assert.rejects(disabled.signInWithGoogle(), { code: "disabled", status: "disabled" });
  disabled.dispose();

  const { adapter } = makeAdapter();
  adapter.signInGoogle = async () => { throw Object.assign(new Error("blocked"), { code: "auth/popup-blocked" }); };
  const service = createCloudService({ adapter });
  await assert.rejects(service.signInWithGoogle(), (error) => error.code === "popup-blocked" && /Allow popups/.test(error.message));
  service.dispose();
});

test("cleanup failures after revocation remain an explicit retry status", async () => {
  const { adapter } = makeAdapter();
  adapter.deleteWorkspace = async () => { throw new CloudServiceError("Sharing was revoked, but deletion did not finish.", "delete-incomplete", { status: "delete-incomplete" }); };
  const service = createCloudService({ adapter });
  await assert.rejects(service.deleteWorkspace(id), { code: "delete-incomplete", status: "delete-incomplete" });
  service.dispose();
});
test("asynchronous auth persistence failure is replayed as an error and does not hang owner requests", async () => {
  const failure = Object.assign(new Error("browser persistence unavailable"), { code: "auth/unsupported-persistence-type" });
  const { adapter, calls } = makeAdapter();
  let notify;
  adapter.observeAuth = callback => { notify = callback; return () => {}; };
  const service = createCloudService({ adapter });
  let errorSeen;
  let identities = 0;
  service.onAuthStateChanged(() => identities++, error => { errorSeen = error; });
  const pendingCreate = service.createWorkspace({ graph });
  notify(null, failure);
  await assert.rejects(pendingCreate, { code: "auth/unsupported-persistence-type" });
  assert.equal(errorSeen.code, "auth/unsupported-persistence-type");
  assert.equal(identities, 0);
  assert.equal(calls.creates.length, 0);
  let lateError;
  service.onAuthStateChanged(() => assert.fail("Failure cannot be a verified sign-out"), error => { lateError = error; });
  assert.equal(lateError.code, errorSeen.code);
  service.dispose();
});

test("synchronous adapter auth failure reaches a late account subscriber", () => {
  const { adapter } = makeAdapter();
  adapter.observeAuth = () => { throw new Error("auth startup failed"); };
  const service = createCloudService({ adapter });
  let seen;
  service.onAuthStateChanged(() => assert.fail("No verified identity"), error => { seen = error; });
  assert.match(seen.message, /startup failed/);
  service.dispose();
});
