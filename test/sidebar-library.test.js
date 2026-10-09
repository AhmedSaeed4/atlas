import test from "node:test";
import assert from "node:assert/strict";
import { authInitializingInvalidatesMapSettingsTarget, createManualMoveAttemptTracker, createMapSettingsTargetController, commitManualMoveAssociation, hasUnresolvedLocalCloudCandidate, reusableManualMoveAttempt, onlineStatusVisibility, reusableManualMoveCandidate, resolveMapSettingsTarget } from "../public/src/sidebar-library.js";

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

test("settings target resolution stays on map A while map B is the active graph", async () => {
  const localA = { id: "local-a", graph: { project: { name: "Map A" } } };
  const activeGraphB = { id: "local-b", graph: { project: { name: "Map B" } } };
  const cloudA = { id: "cloud-a", ownerId: "owner-a", name: "Cloud A", shared: true };
  let currentUid = "owner-a";
  const context = () => ({ projects: [localA, activeGraphB], workspaces: [cloudA], currentUid });
  const controller = createMapSettingsTargetController({ getContext: context });
  const calls = [];
  const exported = [];
  const moved = [];
  const deleted = [];
  const actions = {
    rename: (target) => {
      calls.push(["rename", target.origin, target.id]);
      target.project.graph.project.name = "Renamed Map A";
    },
    delete: (target) => { calls.push(["delete", target.origin, target.id]); deleted.push(target.id); },
    export: (target) => { calls.push(["export", target.origin, target.id]); exported.push(target.id); },
    move: (target) => { calls.push(["move", target.origin, target.id]); moved.push(target.id); },
    share: (target) => { calls.push(["share", target.origin, target.id, target.ownerUid]); target.item.shared = true; },
  };

  const local = controller.open({ origin: "local", id: "local-a" });
  assert.equal(local.project, localA);
  for (const action of ["rename", "export", "move", "delete"]) {
    const result = await controller.run(local, actions[action]);
    assert.equal(result.cancelled, false);
  }
  assert.deepEqual(calls.slice(0, 4).map((call) => call.slice(0, 3)), [
    ["rename", "local", "local-a"],
    ["export", "local", "local-a"],
    ["move", "local", "local-a"],
    ["delete", "local", "local-a"],
  ]);
  assert.equal(localA.graph.project.name, "Renamed Map A");
  assert.equal(activeGraphB.graph.project.name, "Map B");
  assert.deepEqual(exported, ["local-a"]);
  assert.deepEqual(moved, ["local-a"]);
  assert.deepEqual(deleted, ["local-a"]);

  const cloud = controller.open({ origin: "cloud", id: "cloud-a", ownerUid: "owner-a" });
  assert.equal(cloud.item, cloudA);
  const shared = await controller.run(cloud, actions.share);
  assert.equal(shared.cancelled, false);
  assert.deepEqual(calls.at(-1), ["share", "cloud", "cloud-a", "owner-a"]);
  assert.equal(cloudA.shared, true);
  assert.equal(activeGraphB.id, "local-b", "target resolution never substitutes the active graph");
});

test("cold account initialization preserves a local Move target and lets its confirmed flow continue", async () => {
  let currentUid = "";
  let accountStatus = "uninitialized";
  const project = { id: "local-a", graph: { project: { name: "Map A" } } };
  const controller = createMapSettingsTargetController({
    getContext: () => ({ projects: [project], workspaces: [], currentUid }),
  });
  const localTarget = controller.open({ origin: "local", id: "local-a" });
  assert.equal(authInitializingInvalidatesMapSettingsTarget(localTarget), false);

  const initialization = deferred();
  accountStatus = "initializing";
  if (accountStatus === "initializing" && authInitializingInvalidatesMapSettingsTarget(controller.getCurrent())) {
    controller.invalidate();
  }
  assert.equal(controller.isCurrent(localTarget), true, "the local settings dialog must survive account bootstrap");
  initialization.resolve();
  await initialization.promise;
  accountStatus = "ready";
  currentUid = "owner-a";
  let movedProjectId = "";
  const move = await controller.run(localTarget, (target) => {
    movedProjectId = target.project.id;
    return target.project.graph.project.name;
  });
  assert.equal(move.cancelled, false);
  assert.equal(movedProjectId, "local-a");
  assert.equal(move.value, "Map A");
  assert.equal(accountStatus, "ready");

  const cloud = { id: "cloud-a", ownerId: "owner-a" };
  const cloudController = createMapSettingsTargetController({
    getContext: () => ({ projects: [project], workspaces: [cloud], currentUid }),
  });
  const cloudTarget = cloudController.open({ origin: "cloud", id: "cloud-a", ownerUid: "owner-a" });
  assert.equal(authInitializingInvalidatesMapSettingsTarget(cloudTarget), true, "cloud settings remain fenced while auth identity is unresolved");
  currentUid = "";
  if (authInitializingInvalidatesMapSettingsTarget(cloudController.getCurrent())) cloudController.invalidate();
  assert.equal(cloudController.getCurrent(), null, "cloud settings close while identity is unresolved");
});
test("account switch invalidates a cloud settings menu and suppresses stale async completion", async () => {
  let currentUid = "owner-a";
  const cloudA = { id: "cloud-a", ownerId: "owner-a", name: "Cloud A" };
  const deferredAction = deferred();
  let cleared = 0;
  const controller = createMapSettingsTargetController({
    getContext: () => ({ projects: [], workspaces: [cloudA], currentUid }),
    onChange: (target) => { if (!target) cleared += 1; },
  });
  const target = controller.open({ origin: "cloud", id: "cloud-a", ownerUid: "owner-a" });
  let applied = 0;
  const pending = controller.run(target, async (captured) => {
    assert.equal(captured.id, "cloud-a");
    assert.equal(captured.ownerUid, "owner-a");
    await deferredAction.promise;
    if (!controller.isCurrent(captured)) return;
    applied += 1;
  });

  currentUid = "owner-b";
  controller.invalidate();
  deferredAction.resolve();
  const result = await pending;
  assert.equal(result.cancelled, true);
  assert.equal(applied, 0, "stale async completion must not apply after the account changes");
  assert.equal(controller.getCurrent(), null);
  assert.equal(cleared, 1);
  assert.equal(controller.isCurrent(target), false);
});

test("pending and unresolved cloud candidates block local deletion, including a stale confirmation", () => {
  const automatic = { workspaceId: "candidate-auto", ownerUid: "owner-a", source: "fragment", pending: true, committed: false };
  const manual = { workspaceId: "candidate-manual", ownerUid: "owner-a", source: "manual", pending: true, committed: false };
  const confirmation = { workspaceId: "candidate-confirm", ownerUid: "", source: "fragment", pending: false, committed: false, confirmationRequired: true };
  assert.equal(hasUnresolvedLocalCloudCandidate(automatic), true);
  assert.equal(hasUnresolvedLocalCloudCandidate(manual), true);
  assert.equal(hasUnresolvedLocalCloudCandidate(confirmation), true);
  assert.equal(hasUnresolvedLocalCloudCandidate(null, "verify:candidate"), true);
  assert.equal(hasUnresolvedLocalCloudCandidate({ workspaceId: "settled", pending: false, committed: true }), false);

  let record = { workspaceId: "settled", pending: false, committed: true };
  let deletions = 0;
  const confirmDelete = () => {
    if (hasUnresolvedLocalCloudCandidate(record)) return false;
    deletions += 1;
    return true;
  };
  assert.equal(hasUnresolvedLocalCloudCandidate(record), false, "dialog can open before a candidate begins");
  record = { ...automatic, workspaceId: "candidate-started-after-dialog-open" };
  assert.equal(confirmDelete(), false, "the latest confirmation callback must recheck pending candidate state");
  assert.equal(deletions, 0);
});

test("manual move attempts reject concurrency and preserve a candidate for explicit retry", () => {
  const attempts = createManualMoveAttemptTracker();
  const record = { workspaceId: "stable-candidate", idempotencyKey: "manual:key", ownerUid: "owner-a", source: "manual", pending: true, committed: false };
  const first = reusableManualMoveCandidate(record, "owner-a");
  assert.deepEqual(first, { workspaceId: "stable-candidate", idempotencyKey: "manual:key" });
  assert.equal(attempts.begin("local-a"), true);
  assert.equal(attempts.isActive("local-a"), true);
  assert.equal(attempts.begin("local-a"), false, "a second confirmation cannot start a concurrent create");
  assert.equal(hasUnresolvedLocalCloudCandidate(record, "", attempts.isActive("local-a")), true);
  attempts.finish("local-a");
  assert.equal(attempts.begin("local-a"), true, "an explicit retry is allowed after the failed attempt releases its lock");
  assert.deepEqual(reusableManualMoveCandidate(record, "owner-a"), first, "retry reuses the exact candidate and key");
  attempts.finish("local-a");
  assert.equal(reusableManualMoveCandidate(record, "owner-b"), null, "another owner cannot inherit the candidate");
});
test("stale or cross-owner settings targets fail closed", () => {
  const projects = [{ id: "local-a" }];
  const workspaces = [{ id: "cloud-a", ownerId: "owner-a" }];
  assert.equal(resolveMapSettingsTarget({ origin: "local", id: "missing" }, { projects }), null);
  assert.equal(resolveMapSettingsTarget({ origin: "cloud", id: "cloud-a", ownerUid: "owner-a" }, { workspaces, currentUid: "owner-b" }), null);
  assert.equal(resolveMapSettingsTarget({ origin: "cloud", id: "cloud-a", ownerUid: "owner-a" }, { workspaces: [], currentUid: "owner-a" }), null);
});

test("healthy owner and viewer routes hide status cards while recovery states expose only needed controls", () => {
  assert.deepEqual(onlineStatusVisibility({ openSession: true, status: "ready", hasGraph: true }), {
    current: false, banner: false, returnLocal: false,
  }, "a healthy owner or viewer route has no persistent card");
  assert.deepEqual(onlineStatusVisibility({ openSession: true, status: "loading", hasGraph: true }), {
    current: false, banner: false, returnLocal: false,
  }, "a stale preview uses the stable read-only status without a layout-shifting banner");
  assert.deepEqual(onlineStatusVisibility({ openSession: true, status: "conflict", hasGraph: true, dirty: true }), {
    current: true, banner: false, returnLocal: false,
  }, "a conflict exposes the recovery controls");
  assert.deepEqual(onlineStatusVisibility({ openSession: true, status: "ready", pendingUpload: true }), {
    current: true, banner: false, returnLocal: false,
  }, "an explicit local-to-online apply remains reachable while the owner map is ready");
  assert.deepEqual(onlineStatusVisibility({ openSession: true, explicitViewRoute: true, routeUnavailable: true, status: "permission-denied" }), {
    current: false, banner: true, returnLocal: true,
  }, "only an unavailable explicit viewer route gets a local escape");
  assert.deepEqual(onlineStatusVisibility({ openSession: true, status: "offline", hasGraph: false }), {
    current: true, banner: true, returnLocal: false,
  }, "offline opening reports the failure in the compact route slot");
  assert.deepEqual(onlineStatusVisibility({ openSession: false, status: "ready" }), {
    current: false, banner: false, returnLocal: false,
  });
});

test("a failed association commit preserves the unresolved manual candidate for safe retry", () => {
  const associations = { "local-a": { workspaceId: "candidate-a", ownerUid: "owner-a", pending: true, committed: false, source: "manual", idempotencyKey: "key-a" } };
  const pending = associations["local-a"];
  assert.equal(commitManualMoveAssociation(associations, "local-a", () => false), false);
  assert.equal(associations["local-a"], pending, "failed local persistence keeps the pending delete guard");
  assert.deepEqual(reusableManualMoveCandidate(associations["local-a"], "owner-a"), { workspaceId: "candidate-a", idempotencyKey: "key-a" });
  assert.equal(commitManualMoveAssociation(associations, "local-a", () => true), true);
  assert.equal(associations["local-a"].committed, true);
  assert.equal(associations["local-a"].pending, false);
});

test("manual retry reconstructs the exact original submitted graph after later local edits", () => {
  const originalGraph = { schemaVersion: 1, project: { name: "Original" }, nodes: [{ id: "old-node" }], edges: [] };
  const changedLocalGraph = { schemaVersion: 1, project: { name: "Edited later" }, nodes: [{ id: "new-node" }], edges: [] };
  const record = { source: "manual", pending: true, ownerUid: "owner-a", workspaceId: "candidate-a", idempotencyKey: "key-a", graphFingerprint: JSON.stringify(originalGraph) };
  const retry = reusableManualMoveAttempt(record, "owner-a");
  assert.equal(retry.workspaceId, "candidate-a");
  assert.equal(retry.idempotencyKey, "key-a");
  assert.deepEqual(retry.graph, originalGraph);
  assert.notDeepEqual(retry.graph, changedLocalGraph, "the retry never submits later local edits under the old candidate");
  assert.equal(reusableManualMoveAttempt(record, "owner-b"), null, "another owner cannot reconstruct this candidate");
});


test("transient library refreshes retain rows; server results and loss of permission replace them", async () => {
  const { updateOnlineLibrarySnapshot } = await import("../public/src/sidebar-library.js");
  const cache = { snapshot: [{ id: "a", ownerId: "owner-a" }] };
  updateOnlineLibrarySnapshot(cache, { status: "loading", workspaces: [] });
  updateOnlineLibrarySnapshot(cache, { status: "offline", workspaces: [] });
  assert.equal(cache.snapshot[0].id, "a");
  updateOnlineLibrarySnapshot(cache, { status: "ready", workspaces: [] });
  assert.deepEqual(cache.snapshot, []);
  cache.snapshot = [{ id: "a" }];
  updateOnlineLibrarySnapshot(cache, { status: "error", error: { code: "permission-denied" } });
  assert.equal(cache.snapshot, null);
});

test("first-cloud selection waits for the owner list, preserves its order and is consumed only once", async () => {
  const { createCloudLibraryFirstSelection } = await import("../public/src/sidebar-library.js");
  const selection = createCloudLibraryFirstSelection();
  const token = selection.begin();
  assert.equal(selection.bindOwner(token, "owner-a"), true);
  const context = { mode:"cloud", currentUid:"owner-a" };
  assert.equal(selection.takeFirst(context), null);
  const first = { id:"first", ownerId:"owner-a", name:"Zulu first row" };
  const second = { id:"second", ownerId:"owner-a", name:"Alpha second row" };
  assert.equal(selection.takeFirst({ ...context, workspaces:[{id:"foreign",ownerId:"owner-b"},first,second] }), first);
  assert.equal(selection.takeFirst({ ...context, workspaces:[second,first] }), null);
});

test("manual navigation, returning local and identity change prevent a late cloud auto-selection", async () => {
  const { createCloudLibraryFirstSelection } = await import("../public/src/sidebar-library.js");
  for (const reason of ["manual", "local", "account"]) {
    const selection = createCloudLibraryFirstSelection();
    const token = selection.begin();
    selection.bindOwner(token,"owner-a");
    const item = {id:"first",ownerId:"owner-a"};
    if (reason === "manual") selection.cancel();
    assert.equal(selection.takeFirst({ mode:reason === "local" ? "local" : "cloud", currentUid:reason === "account" ? "owner-b" : "owner-a", workspaces:[item] }),null);
    assert.equal(selection.takeFirst({mode:"cloud",currentUid:"owner-a",workspaces:[item]}),null);
  }
});

test("a superseded switch cannot bind an old account and empty ready lists do not select later additions", async () => {
  const { createCloudLibraryFirstSelection } = await import("../public/src/sidebar-library.js");
  const selection = createCloudLibraryFirstSelection();
  const oldToken = selection.begin();
  const token = selection.begin();
  assert.equal(selection.bindOwner(oldToken,"owner-a"),false);
  assert.equal(selection.bindOwner(token,"owner-b"),true);
  assert.equal(selection.takeFirst({mode:"cloud",currentUid:"owner-b",workspaces:[]}),null);
  assert.equal(selection.takeFirst({mode:"cloud",currentUid:"owner-b",workspaces:[{id:"later",ownerId:"owner-b"}]}),null);
});

test("a deliberate cloud switch made while signed out can select after verified sign-in", async () => {
  const { createCloudLibraryFirstSelection } = await import("../public/src/sidebar-library.js");
  const selection = createCloudLibraryFirstSelection();
  selection.begin();
  assert.equal(selection.takeFirst({mode:"cloud",currentUid:"",workspaces:[]}),null);
  const item={id:"first",ownerId:"owner-a"};
  assert.equal(selection.takeFirst({mode:"cloud",currentUid:"owner-a",workspaces:[item]}),item);
  assert.equal(selection.takeFirst({mode:"cloud",currentUid:"owner-a",workspaces:[item]}),null);
});


test("local-only fragment reservations do not block deletion or an explicit move after reload", () => {
  const legacy = {
    workspaceId: "reserved-fragment", ownerUid: "", source: "fragment", key: "fragment-key",
    pending: true, committed: false, admissionStatus: "local", confirmationRequired: true,
  };
  const restored = JSON.parse(JSON.stringify(legacy));
  assert.equal(hasUnresolvedLocalCloudCandidate(restored, "pending:" + restored.workspaceId), false);
  assert.equal(hasUnresolvedLocalCloudCandidate({ ...restored, ownerUid: "signed-in-owner" }, "pending:" + restored.workspaceId), false);
  for (const source of ["new", "import", "fragment"]) {
    for (const admissionStatus of ["needs-sign-in", "needs-confirmation", "stale"]) {
      assert.equal(hasUnresolvedLocalCloudCandidate({ ...restored, source, admissionStatus }, "pending:" + restored.workspaceId), false);
    }
  }
  assert.equal(hasUnresolvedLocalCloudCandidate(restored, "pending:" + restored.workspaceId, true), true, "a move beginning while confirmation is open still blocks deletion");
  assert.equal(hasUnresolvedLocalCloudCandidate({ ...restored, admissionStatus: "starting" }, "pending:" + restored.workspaceId), true, "an admission still able to prepare a write stays guarded");
});

test("previous cloud submissions stay protected even if a later attempt is local or signed out", () => {
  const submitted = {
    workspaceId: "submitted-fragment", ownerUid: "owner-a", source: "fragment",
    pending: true, committed: false, graphFingerprint: '{"project":{"name":"Original payload"},"nodes":[],"edges":[]}',
  };
  for (const admissionStatus of ["local", "needs-sign-in", "needs-confirmation", "stale", "failed"]) {
    assert.equal(hasUnresolvedLocalCloudCandidate({ ...submitted, admissionStatus }, "pending:" + submitted.workspaceId), true);
  }
  assert.equal(hasUnresolvedLocalCloudCandidate({ ...submitted, graphFingerprint: "", committed: true, admissionStatus: "local" }), true, "an acknowledged cloud create remains guarded until association settlement");
  assert.equal(hasUnresolvedLocalCloudCandidate({ ...submitted, graphFingerprint: "", source: "manual", admissionStatus: "local" }), true, "legacy manual candidates remain conservative");
  assert.equal(hasUnresolvedLocalCloudCandidate({ ...submitted, graphFingerprint: "", source: "unknown", admissionStatus: "local" }), true);
});


test("cloud rows rank newest creation first without mutating frozen service summaries", async () => {
  const { sortCloudWorkspacesByCreation } = await import("../public/src/sidebar-library.js");
  const older = Object.freeze({ id: "old", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2026-10-09T00:00:00Z" });
  const newer = Object.freeze({ id: "new", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" });
  const input = Object.freeze([older, newer]);
  const ranked = sortCloudWorkspacesByCreation(input);
  assert.deepEqual(ranked, [newer, older]);
  assert.deepEqual(input, [older, newer]);
  assert.notEqual(ranked, input);
  assert.equal(ranked[0], newer);
});

test("editing, renaming and sharing do not move cloud rows", async () => {
  const { updateOnlineLibrarySnapshot } = await import("../public/src/sidebar-library.js");
  const old = { id: "old", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" };
  const newer = { id: "new", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" };
  const cache = {};
  updateOnlineLibrarySnapshot(cache, { status: "ready", workspaces: [old, newer] });
  assert.deepEqual(cache.snapshot.map(item => item.id), ["new", "old"]);
  updateOnlineLibrarySnapshot(cache, { status: "ready", workspaces: [{ ...old, name: "Renamed", shared: true, updatedAt: "2026-10-09T00:00:00Z" }, newer] });
  assert.deepEqual(cache.snapshot.map(item => item.id), ["new", "old"]);
});

test("equal creation times and unavailable dates preserve their relative input order", async () => {
  const { sortCloudWorkspacesByCreation } = await import("../public/src/sidebar-library.js");
  const input = [
    { id: "missing" }, { id: "first-tie", createdAt: "2026-01-01T00:00:00Z" },
    { id: "invalid", createdAt: "invalid" }, { id: "second-tie", createdAt: "2026-01-01T00:00:00Z" },
    { id: "older", createdAt: "2025-01-01T00:00:00Z" },
  ];
  assert.deepEqual(sortCloudWorkspacesByCreation(input).map(item => item.id), ["first-tie", "second-tie", "older", "missing", "invalid"]);
});

test("switching to cloud selects the newest visible row once; later additions do not steal selection", async () => {
  const { updateOnlineLibrarySnapshot, createCloudLibraryFirstSelection } = await import("../public/src/sidebar-library.js");
  const cache = {};
  const old = { id: "old", ownerId: "owner-a", createdAt: "2025-01-01T00:00:00Z" };
  const newer = { id: "new", ownerId: "owner-a", createdAt: "2026-01-01T00:00:00Z" };
  const context = { mode: "cloud", currentUid: "owner-a" };
  const selection = createCloudLibraryFirstSelection();
  selection.bindOwner(selection.begin(), context.currentUid);
  updateOnlineLibrarySnapshot(cache, { status: "ready", workspaces: [old, newer] });
  assert.equal(selection.takeFirst({ ...context, workspaces: cache.snapshot }), newer);
  updateOnlineLibrarySnapshot(cache, { status: "ready", workspaces: [old, newer, { id: "imported", ownerId: "owner-a", createdAt: "2026-10-09T00:00:00Z" }] });
  assert.equal(cache.snapshot[0].id, "imported");
  assert.equal(selection.takeFirst({ ...context, workspaces: cache.snapshot }), null);
});
