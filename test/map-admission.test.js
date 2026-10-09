import { addRegistryWorkspace } from "../public/src/cloud-quota.js";
import test from "node:test";
import assert from "node:assert/strict";
import { createMapAdmissionController } from "../public/src/map-admission.js";

const graph = (name = "New map") => ({ schemaVersion: 1, project: { name }, nodes: [], edges: [] });
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
  return { promise, resolve, reject };
};
function makeAccount({ enabled = true, initialized = true, user = { uid: "owner-a" } } = {}) {
  let state = { status: initialized ? "ready" : "idle", initialized, user };
  let authEpoch = 0;
  let preference = enabled;
  const gate = deferred();
  const account = {
    getState: () => state,
    getPreferenceState: () => ({ saveFutureMaps: preference }),
    getAuthInteractionEpoch: () => authEpoch,
    initialize: async () => { await gate.promise; return state; },
    getService: async () => ({ name: "shared-service" }),
    setPreference(value) { preference = Boolean(value); },
    setIdentity(next) { state = { ...state, status: "ready", initialized: true, user: next }; },
    beginInteractiveSignIn(next = { uid: "owner-b" }) {
      authEpoch += 1;
      state = { ...state, status: "ready", initialized: true, user: next };
    },
    resolveInitialization(next = user) { state = { ...state, status: "ready", initialized: true, user: next }; gate.resolve(); },
  };
  if (initialized) gate.resolve();
  return account;
}

function makeController(account, createWorkspace) {
  return createMapAdmissionController({ account, createWorkspace });
}

test("admission is opt-in by preference and only known user events are classified", async () => {
  const account = makeAccount({ enabled: false, initialized: false });
  let creates = 0;
  let initializes = 0;
  const originalInitialize = account.initialize;
  account.initialize = async () => { initializes += 1; return originalInitialize(); };
  const controller = makeController(account, async () => { creates += 1; });
  const ignored = await controller.admit({ source: "selection", projectId: "p1", graph: graph() });
  const local = await controller.admit({ source: "new", projectId: "p1", graph: graph() });
  assert.equal(ignored.status, "ignored");
  assert.equal(local.status, "local");
  assert.equal(initializes, 0);
  assert.equal(creates, 0);
});

test("a restored signed-in session uploads once; duplicate admission returns the same promise", async () => {
  const account = makeAccount();
  const gate = deferred();
  const started = deferred();
  let creates = 0;
  const controller = makeController(account, async ({ ownerUid, service, graph: admittedGraph }) => {
    creates += 1;
    started.resolve();
    assert.equal(ownerUid, "owner-a");
    assert.equal(service.name, "shared-service");
    assert.equal(admittedGraph.project.name, "New map");
    await gate.promise;
    return { id: "workspace-1234567890123456789" };
  });
  const admission = { source: "new", projectId: "p1", graph: graph(), isCurrent: () => true };
  const first = controller.admit(admission);
  const second = controller.admit(admission);
  assert.equal(first, second);
  await started.promise;
  assert.equal(creates, 1);
  gate.resolve();
  const result = await first;
  assert.equal(result.status, "saved");
  assert.equal(controller.pendingCount(), 0);
});

test("duplicate failed admissions never auto-retry; explicit retry reuses the captured intent", async () => {
  const account = makeAccount();
  let creates = 0;
  const attempted = [];
  const controller = makeController(account, async ({ graph: admittedGraph, candidateWorkspaceId, idempotencyKey }) => {
    creates += 1;
    attempted.push({ candidateWorkspaceId, idempotencyKey });
    if (creates === 1) throw new Error("network response lost");
    return { id: "workspace-1234567890123456789", graphName: admittedGraph.project.name };
  });
  const admission = {
    source: "import", key: "p2", projectId: "p2", graph: graph("Imported"), isCurrent: () => true,
    candidateWorkspaceId: "candidate-1234567890123456789", idempotencyKey: "import:p2",
  };
  const failed = await controller.admit(admission);
  assert.equal(failed.status, "failed");
  assert.equal((await controller.admit(admission)).status, "failed");
  assert.equal(creates, 1);
  const saved = await controller.retry({ source: "import", key: "p2", projectId: "p2", graph: graph("Captured retry"), isCurrent: () => true });
  assert.equal(saved.status, "saved");
  assert.equal(saved.graph.project.name, "Captured retry");
  assert.equal(creates, 2);
  assert.deepEqual(attempted, [
    { candidateWorkspaceId: "candidate-1234567890123456789", idempotencyKey: "import:p2" },
    { candidateWorkspaceId: "candidate-1234567890123456789", idempotencyKey: "import:p2" },
  ]);
});

test("a sign-in that starts after admission requires a separate explicit retry", async () => {
  const account = makeAccount({ initialized: false, user: null });
  let creates = 0;
  const controller = makeController(account, async () => { creates += 1; return { id: "workspace-1234567890123456789" }; });
  const pending = controller.admit({ source: "fragment", key: "hash-a", projectId: "p3", graph: graph("Agent map") });
  await Promise.resolve();
  account.beginInteractiveSignIn({ uid: "owner-a" });
  account.resolveInitialization({ uid: "owner-a" });
  assert.equal((await pending).status, "needs-confirmation");
  assert.equal(creates, 0);
  const result = await controller.retry({ source: "fragment", key: "hash-a", projectId: "p3", graph: graph("Agent map") });
  assert.equal(result.status, "saved");
  assert.equal(creates, 1);
});

test("route and preference changes while Auth restores suppress the upload", async () => {
  const account = makeAccount({ initialized: false, user: { uid: "owner-a" } });
  let creates = 0;
  const controller = makeController(account, async () => { creates += 1; return { id: "workspace-1234567890123456789" }; });
  let current = true;
  const routeAdmission = controller.admit({ source: "new", projectId: "p4", graph: graph(), isCurrent: () => current });
  await Promise.resolve();
  current = false;
  account.resolveInitialization();
  assert.equal((await routeAdmission).status, "stale");
  assert.equal(creates, 0);

  const nextAccount = makeAccount({ initialized: false, user: { uid: "owner-a" } });
  const nextController = makeController(nextAccount, async () => { creates += 1; return {}; });
  const prefAdmission = nextController.admit({ source: "import", projectId: "p5", graph: graph() });
  await Promise.resolve();
  nextAccount.setPreference(false);
  nextAccount.resolveInitialization();
  assert.equal((await prefAdmission).status, "local");
  assert.equal(creates, 0);
});

test("signed-out admissions stay local and later sign-in only saves after explicit retry", async () => {
  const account = makeAccount({ user: null });
  let creates = 0;
  const controller = makeController(account, async () => { creates += 1; return { id: "workspace-1234567890123456789" }; });
  const admission = { source: "fragment", key: "hash-b", projectId: "p6", graph: graph("Shared fragment") };
  assert.equal((await controller.admit(admission)).status, "needs-sign-in");
  account.beginInteractiveSignIn({ uid: "owner-a" });
  assert.equal((await controller.admit(admission)).status, "needs-sign-in");
  assert.equal(creates, 0);
  assert.equal((await controller.retry({ ...admission, isCurrent: () => false })).status, "stale");
  const result = await controller.retry({ ...admission, isCurrent: () => true });
  assert.equal(result.status, "saved");
  assert.equal(creates, 1);
});

test("admission captures the latest local graph and rejects a changed owner before create", async () => {
  const account = makeAccount();
  let currentGraph = graph("Initial");
  let captured;
  const controller = makeController(account, async (input) => {
    captured = input;
    return { id: "workspace-1234567890123456789", ownerId: input.ownerUid };
  });
  const admission = controller.admit({
    source: "new", key: "p-latest", projectId: "p-latest", graph: currentGraph,
    getGraph: () => currentGraph, candidateWorkspaceId: "stable-candidate-1234567890",
    idempotencyKey: "new:p-latest", isCurrent: () => true,
  });
  currentGraph = graph("Latest local edit");
  const saved = await admission;
  assert.equal(saved.status, "saved");
  assert.equal(captured.graph.project.name, "Latest local edit");
  assert.equal(captured.candidateWorkspaceId, "stable-candidate-1234567890");
  assert.equal(captured.idempotencyKey, "new:p-latest");

  account.setIdentity({ uid: "owner-b" });
  const secondController = makeController(account, async () => { throw new Error("must not create under a different owner"); });
  const blocked = await secondController.admit({
    source: "fragment", key: "same-hash", projectId: "p-cross-account", graph: graph(),
    candidateWorkspaceId: "owner-a-candidate-1234567890", expectedOwnerUid: "owner-a",
  });
  assert.equal(blocked.status, "needs-confirmation");
  assert.equal(blocked.reason, "pending-admission-owner-changed");
});


test("a pending-record persistence failure stops before any cloud create", async () => {
  const account = makeAccount();
  let creates = 0;
  const controller = makeController(account, async () => { creates += 1; return {}; });
  const result = await controller.admit({
    source: "new", key: "p-no-storage", projectId: "p-no-storage", graph: graph(),
    prepareCreate: () => { throw new Error("could not persist admission candidate"); },
  });
  assert.equal(result.status, "failed");
  assert.equal(result.reason, "create-error");
  assert.equal(creates, 0);
});

test("a quota rejection preserves each new map and can retry after space is available", async () => {
  for (const source of ["new", "import", "fragment"]) {
    const account = makeAccount();
    let ids = Array.from({length:20},(_,index)=>String(index).padStart(22,"Q"));
    const original = graph("Keep " + source);
    const controller = makeController(account, async ({ graph: admittedGraph }) => {
      ids = addRegistryWorkspace({schemaVersion:1,workspaceIds:ids},"N".repeat(22));
      return {id:"N".repeat(22),ownerId:"owner-a",name:admittedGraph.project.name};
    });
    const failed = await controller.admit({source,key:source,projectId:"local-"+source,graph:original});
    assert.equal(failed.status,"failed");
    assert.equal(failed.error.code,"workspace-limit");
    assert.deepEqual(failed.graph,original);
    assert.equal(original.project.name,"Keep " + source);
    ids = ids.slice(1);
    const saved = await controller.retry({source,key:source,projectId:"local-"+source});
    assert.equal(saved.status,"saved");
    assert.equal(ids.length,20);
  }
});
