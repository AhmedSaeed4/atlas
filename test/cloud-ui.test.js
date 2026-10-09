import test from "node:test";
import assert from "node:assert/strict";
import { createCloudUiController, mayMutateWorkspace, onlineViewIdFromSearch, readOnlineEnabled, resetOnlineLibraryForIdentityChange } from "../public/src/cloud-ui.js";

const settle = () => new Promise((resolve) => setTimeout(resolve, 5));
const graph = (name = "Atlas sample", count = 1) => ({
  schemaVersion: 1,
  project: { name, description: "A supported description", type: "Software project" },
  nodes: [{ id: "node-1", label: "API", type: "API", description: "Entry" }],
  edges: [],
  revisionMarker: count,
});
function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}
function fakeCloud() {
  let authCallback = null;
  let user = null;
  const workspaces = [];
  const libraries = [];
  const saves = [];
  const created = [];
  const deleted = [];
  const sharing = [];
  let deleteImpl = async () => {};
  let shareImpl = async () => ({ sharedId: "B".repeat(22), viewUrl: "https://atlas.test/workspace.html?view=" + "B".repeat(22) });
  let saveImpl = async ({ expectedRevision }) => ({ currentRevision: expectedRevision + 1 });
  const service = {
    onAuthStateChanged(callback) { authCallback = callback; callback(user); return () => { authCallback = null; }; },
    setUser(next) { user = next; authCallback?.(next); },
    async signInWithGoogle() { const next = { uid: "owner-1", displayName: "Atlas Owner", email: "owner@example.test" }; this.setUser(next); return next; },
    async signOut() { user = null; authCallback?.(null); },
    watchOwnedWorkspaces(callback) { const entry = { callback, active: true }; libraries.push(entry); return () => { entry.active = false; }; },
    watchWorkspace(target, callback) { const entry = { target, callback, active: true }; workspaces.push(entry); return () => { entry.active = false; }; },
    emitWorkspace(event, index = workspaces.length - 1) { workspaces[index]?.callback(event); },
    emitLibrary(event) { for (const entry of libraries) if (entry.active) entry.callback(event); },
    async createWorkspace(input) { created.push(input); return { id: "A".repeat(22), currentRevision: 1, name: input.name, ownerId: user?.uid, shared: false }; },
    async saveWorkspace(input) { saves.push(input); return await saveImpl(input); },
    async setShared(input) { sharing.push(input); return await shareImpl(input); },
    async deleteWorkspace(id) { deleted.push(id); return await deleteImpl(id); },
    setSaveImpl(fn) { saveImpl = fn; },
    setDeleteImpl(fn) { deleteImpl = fn; },
    setShareImpl(fn) { shareImpl = fn; },
    inspect() { return { libraries, saves, created, deleted, sharing, workspaces }; },
  };
  return service;
}
function workspaceReady(workspace = { id: "A".repeat(22), ownerId: "owner-1", currentRevision: 7, shared: true }) {
  return { status: "ready", workspace, graph: graph() };
}

async function signedInOwner({ delay = 0, callbacks = {} } = {}) {
  const service = fakeCloud();
  const storage = memoryStorage({ "atlas.online.enabled.v1": "true" });
  const controller = createCloudUiController({ loadService: async () => service, storage, saveDelay: delay, callbacks });
  await controller.enableOnline();
  await controller.signIn();
  await settle();
  await controller.openOwnedWorkspace("A".repeat(22));
  service.emitWorkspace(workspaceReady());
  assert.equal(controller.enterOwnerEditMode(), true);
  return { controller, service, storage };
}

test("owner library cache is synchronously cleared when identity changes", () => {
  const cache = { snapshot: [{ id: "private-from-account-a", name: "A's map" }], status: "" };
  assert.equal(resetOnlineLibraryForIdentityChange(cache, "account-a", "account-b"), true);
  assert.deepEqual(cache, { snapshot: null, status: "Loading your online maps." });
  assert.equal(resetOnlineLibraryForIdentityChange(cache, "account-b", "account-b"), false);
  assert.equal(resetOnlineLibraryForIdentityChange(cache, "account-b", ""), true);
  assert.deepEqual(cache, { snapshot: null, status: "Sign in to see your online maps." });
});

test("online stays lazy until explicit enable or a share route, with strict 22-character viewer IDs", async () => {
  let loads = 0;
  const controller = createCloudUiController({ loadService: async () => { loads += 1; return fakeCloud(); }, storage: memoryStorage() });
  assert.equal(controller.state().enabled, false);
  assert.equal(controller.state().mode, "local");
  assert.equal(readOnlineEnabled(memoryStorage()), false);
  assert.equal(loads, 0);
  assert.equal(onlineViewIdFromSearch("?view=" + "A".repeat(22)), "A".repeat(22));
  assert.equal(onlineViewIdFromSearch("?view=short"), "");
  assert.equal(mayMutateWorkspace("local"), true);
  assert.equal(mayMutateWorkspace("viewer", "owner-1", "owner-1"), false);
  assert.equal(mayMutateWorkspace("owner", "other", "owner-1"), false);
  assert.equal(mayMutateWorkspace("owner", "owner-1", "owner-1"), true);
  await controller.enableOnline();
  assert.equal(loads, 1);
});

test("browsing the cloud library does not persist the online preference", async () => {
  const service = fakeCloud();
  const storage = memoryStorage();
  const controller = createCloudUiController({ loadService: async () => service, storage });
  await controller.browseLibrary();
  assert.equal(controller.state().enabled, true);
  assert.equal(storage.getItem("atlas.online.enabled.v1"), null);
  await controller.disableOnline();
});

test("owner library listener can be retried after a permission error", async () => {
  const service = fakeCloud();
  const events = [];
  const controller = createCloudUiController({
    loadService: async () => service,
    storage: memoryStorage(),
    callbacks: { onLibrary: (event) => events.push(event) },
  });
  await controller.enableOnline();
  await controller.signIn();
  await settle();
  const first = service.inspect().libraries[0];
  assert.ok(first?.active);
  service.emitLibrary({ status: "error", error: Object.assign(new Error("permission denied"), { code: "permission-denied" }) });
  assert.equal(events.at(-1).status, "error");
  assert.equal(controller.retryLibrary(), true);
  const libraries = service.inspect().libraries;
  assert.equal(libraries.length, 2);
  assert.equal(first.active, false);
  assert.equal(libraries[1].active, true);
  service.emitLibrary({ status: "ready", workspaces: [] });
  assert.equal(events.at(-1).status, "ready");
  await controller.disableOnline();
});

test("viewers remain read-only while a matching owner edits immediately on the shared route", async () => {
  const service = fakeCloud();
  const opened = [];
  const controller = createCloudUiController({
    loadService: async () => service,
    callbacks: { onWorkspace: (result) => opened.push(result) },
  });
  await controller.openSharedView("A".repeat(22));
  service.emitWorkspace(workspaceReady());
  assert.equal(controller.state().mode, "viewer");
  assert.equal(controller.canEdit(), false);
  assert.equal(controller.queueSave(graph("No write")), false);
  assert.equal(opened.at(-1).apply, true);
  service.setUser({ uid: "owner-1", displayName: "Owner" });
  await settle();
  service.emitWorkspace(workspaceReady());
  assert.equal(controller.state().mode, "owner");
  assert.equal(controller.state().canEdit, true);
  assert.equal(controller.queueSave(graph("Owner edit")), true);
  controller.closeWorkspace();
});

test("first-time Google sign-in completes before create and uses the selected graph", async () => {
  const service = fakeCloud();
  const createdEvents = [];
  const controller = createCloudUiController({
    loadService: async () => service,
    storage: memoryStorage(),
    callbacks: { onWorkspaceCreated: (event) => createdEvents.push(event) },
  });
  await controller.enableOnline();
  const selected = graph("New map");
  const candidateWorkspaceId = "B".repeat(22);
  const created = await controller.saveOnline({
    graph: selected,
    localProjectId: "local-1",
    workspaceId: candidateWorkspaceId,
    expectedOwnerUid: "owner-1",
  });
  assert.equal(created.id, "A".repeat(22));
  assert.deepEqual(service.inspect().created[0], {
    name: "New map",
    graph: selected,
    workspaceId: candidateWorkspaceId,
    expectedOwnerUid: "owner-1",
  });
  assert.equal(createdEvents[0].localProjectId, "local-1");
  assert.equal(controller.state().mode, "owner");
});

test("a stale create remains in the creator library and is never silently deleted", async () => {
  const service = fakeCloud();
  let finishCreate;
  service.createWorkspace = (input) => new Promise((resolve) => {
    finishCreate = () => resolve({ id: "C".repeat(22), currentRevision: 1, name: input.name, ownerId: "owner-1", shared: false });
  });
  const controller = createCloudUiController({ loadService: async () => service, storage: memoryStorage() });
  await controller.enableOnline();
  await controller.signIn();
  await settle();
  const saving = controller.saveOnline({ graph: graph("Preserved owner data"), localProjectId: "first" });
  await settle();
  controller.closeWorkspace();
  finishCreate();
  await assert.rejects(saving, /remains in the creator account's online library/);
  assert.equal(service.inspect().deleted.length, 0);
  assert.equal(controller.state().workspaceId, "");
});

test("changing the selected map while sign-in is pending prevents a stale online create", async () => {
  const service = fakeCloud();
  let finishSignIn;
  service.signInWithGoogle = () => new Promise((resolve) => { finishSignIn = () => { service.setUser({ uid: "owner-1" }); resolve({ uid: "owner-1" }); }; });
  const controller = createCloudUiController({ loadService: async () => service, storage: memoryStorage() });
  await controller.enableOnline();
  const saving = controller.saveOnline({ graph: graph(), localProjectId: "first" });
  await settle();
  controller.closeWorkspace();
  finishSignIn();
  await assert.rejects(saving, /selected map changed/);
  assert.equal(service.inspect().created.length, 0);
});

test("owner saves are debounced against the watched revision and conflicts require deliberate retry", async () => {
  const { controller, service } = await signedInOwner({ delay: 0 });
  const first = graph("Changed once", 2);
  assert.equal(controller.queueSave(first), true);
  await settle();
  assert.equal(service.inspect().saves.length, 1);
  assert.equal(service.inspect().saves[0].expectedRevision, 7);
  assert.equal(controller.state().dirty, false);
  service.setSaveImpl(async () => { const error = new Error("revision changed"); error.code = "conflict"; error.actual = 9; throw error; });
  controller.queueSave(graph("Changed twice", 3));
  await settle();
  assert.equal(controller.state().status, "conflict");
  assert.equal(service.inspect().saves.length, 2);
  assert.equal(await controller.retrySave(), false);
  assert.equal(service.inspect().saves.length, 2);
  service.setSaveImpl(async ({ expectedRevision }) => ({ currentRevision: expectedRevision + 1 }));
  await controller.retrySave({ acceptConflict: true });
  assert.equal(service.inspect().saves.length, 3);
  assert.equal(service.inspect().saves[2].expectedRevision, 9);
  assert.equal(controller.state().dirty, false);
});

test("a newer owner edit survives an offline failure of the in-flight graph", async () => {
  const { controller, service } = await signedInOwner({ delay: 0 });
  let failFirst;
  let markStarted;
  const firstStarted = new Promise((resolve) => { markStarted = resolve; });
  service.setSaveImpl(async ({ expectedRevision }) => {
    if (service.inspect().saves.length === 1) {
      markStarted();
      return await new Promise((resolve, reject) => { failFirst = () => { const error = new Error("connection lost"); error.code = "offline"; reject(error); }; });
    }
    return { currentRevision: expectedRevision + 1 };
  });
  controller.queueSave(graph("Request X", 2));
  await firstStarted;
  const latest = graph("Request Y", 3);
  controller.queueSave(latest);
  await settle();
  failFirst();
  await settle();
  assert.equal(controller.state().status, "offline");
  await controller.retrySave();
  assert.deepEqual(service.inspect().saves[1].graph, latest);
  assert.equal(controller.state().dirty, false);
});

test("a newer owner edit survives a revision conflict and retries at the observed revision", async () => {
  const { controller, service } = await signedInOwner({ delay: 0 });
  let failFirst;
  let markStarted;
  const firstStarted = new Promise((resolve) => { markStarted = resolve; });
  service.setSaveImpl(async () => {
    if (service.inspect().saves.length === 1) {
      markStarted();
      return await new Promise((resolve, reject) => { failFirst = () => { const error = new Error("revision changed"); error.code = "conflict"; error.actual = 11; reject(error); }; });
    }
    return { currentRevision: 12 };
  });
  controller.queueSave(graph("Request X", 2));
  await firstStarted;
  const latest = graph("Request Y", 3);
  controller.queueSave(latest);
  await settle();
  failFirst();
  await settle();
  assert.equal(controller.state().status, "conflict");
  await controller.retrySave({ acceptConflict: true });
  assert.deepEqual(service.inspect().saves[1].graph, latest);
  assert.equal(service.inspect().saves[1].expectedRevision, 11);
});

test("a revert to the saved graph survives an ambiguous in-flight failure", async () => {
  const { controller, service } = await signedInOwner({ delay: 0 });
  let failFirst;
  let markStarted;
  const firstStarted = new Promise((resolve) => { markStarted = resolve; });
  service.setSaveImpl(async () => {
    if (service.inspect().saves.length === 1) {
      markStarted();
      return await new Promise((resolve, reject) => { failFirst = () => { const error = new Error("write acknowledgement lost"); error.code = "offline"; reject(error); }; });
    }
    return { currentRevision: 8 };
  });
  controller.queueSave(graph("Request X", 2));
  await firstStarted;
  const savedGraph = graph();
  controller.queueSave(savedGraph);
  failFirst();
  await settle();
  await controller.retrySave();
  assert.deepEqual(service.inspect().saves[1].graph, savedGraph);
  assert.equal(controller.state().dirty, false);
});

test("a graph reverted to the saved version during an in-flight write is saved after that write", async () => {
  const { controller, service } = await signedInOwner({ delay: 0 });
  let releaseFirst;
  let markFirstStarted;
  const firstStarted = new Promise((resolve) => { markFirstStarted = resolve; });
  service.setSaveImpl(async ({ expectedRevision }) => {
    if (service.inspect().saves.length === 1) {
      markFirstStarted();
      return await new Promise((resolve) => { releaseFirst = () => resolve({ currentRevision: expectedRevision + 1 }); });
    }
    return { currentRevision: expectedRevision + 1 };
  });
  controller.queueSave(graph("First edit in flight", 2));
  await firstStarted;
  const original = graph();
  assert.equal(controller.queueSave(original), true);
  releaseFirst();
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(service.inspect().saves.length, 2);
  assert.deepEqual(service.inspect().saves[1].graph, original);
  assert.equal(service.inspect().saves[1].expectedRevision, 8);
  assert.equal(controller.state().dirty, false);
});

test("leaving owner edit mode restores the latest remote snapshot", async () => {
  const applied = [];
  const { controller, service } = await signedInOwner({ delay: 1000, callbacks: { onWorkspace: (event) => applied.push(event) } });
  controller.queueSave(graph("Unsent owner edit", 2));
  assert.equal(controller.leaveOwnerEditMode(), true);
  assert.equal(controller.state().mode, "viewer");
  assert.equal(applied.at(-1).apply, true);
  assert.deepEqual(applied.at(-1).graph, graph());
  await settle();
  assert.equal(service.inspect().saves.length, 0);
});

test("disable during Google sign-in cannot restore a late signed-in session", async () => {
  const service = fakeCloud();
  let finishSignIn;
  service.signInWithGoogle = () => new Promise((resolve) => {
    finishSignIn = () => {
      const identity = { uid: "owner-1", displayName: "Owner" };
      service.setUser(identity);
      resolve(identity);
    };
  });
  const controller = createCloudUiController({ loadService: async () => service, storage: memoryStorage() });
  await controller.enableOnline();
  const signingIn = controller.signIn();
  await settle();
  await controller.disableOnline();
  finishSignIn();
  await assert.rejects(signingIn, /disabled while sign-in was in progress/);
  assert.equal(controller.state().enabled, false);
  assert.equal(controller.state().user, null);
  assert.equal(controller.state().mode, "local");
});

test("disable during service loading cannot re-enable online mode", async () => {
  let finishLoad;
  const service = fakeCloud();
  const controller = createCloudUiController({ loadService: () => new Promise((resolve) => { finishLoad = () => resolve(service); }), storage: memoryStorage() });
  const enabling = controller.enableOnline();
  await settle();
  await controller.disableOnline();
  finishLoad();
  await enabling;
  assert.equal(controller.state().enabled, false);
  assert.equal(controller.state().user, null);
  assert.equal(service.inspect().libraries.some((item) => item.active), false);
});

test("account change cancels queued saves and clears prior owner authority", async () => {
  const { controller, service } = await signedInOwner({ delay: 25 });
  controller.queueSave(graph("Queued before account switch", 2));
  service.setUser({ uid: "other-account" });
  await settle();
  await new Promise((resolve) => setTimeout(resolve, 35));
  assert.equal(service.inspect().saves.length, 0);
  assert.equal(controller.state().mode, "viewer");
  assert.equal(controller.canEdit(), false);
});

test("incomplete delete keeps a retryable owner record and disables editing", async () => {
  const { controller, service } = await signedInOwner();
  let attempts = 0;
  service.setDeleteImpl(async () => { attempts += 1; if (attempts === 1) { const error = new Error("cleanup is incomplete"); error.code = "delete-incomplete"; throw error; } });
  await assert.rejects(controller.deleteCurrent(), /cleanup is incomplete/);
  assert.equal(controller.state().workspace.deleting, true);
  assert.equal(controller.state().canEdit, false);
  assert.equal(controller.state().canDelete, true);
  assert.equal(await controller.deleteCurrent(), "A".repeat(22));
  assert.equal(attempts, 2);
});

test("a late share or delete result cannot overwrite or close a newly opened workspace", async () => {
  const { controller, service } = await signedInOwner();
  let finishShare;
  service.setShareImpl(() => new Promise((resolve) => { finishShare = () => resolve({ sharedId: "B".repeat(22) }); }));
  const sharing = controller.setShared(true);
  await settle();
  await controller.openOwnedWorkspace("C".repeat(22));
  finishShare();
  assert.deepEqual(await sharing, { cancelled: true });
  service.emitWorkspace(workspaceReady({ id: "C".repeat(22), ownerId: "owner-1", currentRevision: 1, shared: false }));
  let finishDelete;
  service.setDeleteImpl(() => new Promise((resolve) => { finishDelete = resolve; }));
  const deleting = controller.deleteCurrent();
  await settle();
  await controller.openOwnedWorkspace("D".repeat(22));
  finishDelete();
  await deleting;
  assert.equal(controller.state().workspaceId, "D".repeat(22));
  assert.equal(service.inspect().deleted.at(-1), "C".repeat(22));
});

test("a cached private graph is never delivered to a different account", async () => {
  const service = fakeCloud();
  const opened = [];
  const unavailable = [];
  const controller = createCloudUiController({
    loadService: async () => service,
    storage: memoryStorage({ "atlas.online.enabled.v1": "true" }),
    callbacks: { onWorkspace: (event) => opened.push(event), onUnavailable: (event) => unavailable.push(event) },
  });
  await controller.enableOnline();
  await controller.signIn();
  await settle();
  await controller.openOwnedWorkspace("A".repeat(22));
  service.emitWorkspace(workspaceReady({ id: "A".repeat(22), ownerId: "owner-1", currentRevision: 1, shared: false }));
  assert.equal(controller.enterOwnerEditMode(), true);
  service.setUser({ uid: "other-account" });
  await settle();
  assert.equal(controller.state().workspace, null);
  assert.equal(controller.state().routeUnavailable, true);
  assert.equal(unavailable.at(-1).status, "permission-denied");
  const openedBeforeCache = opened.length;
  service.emitWorkspace(workspaceReady({ id: "A".repeat(22), ownerId: "owner-1", currentRevision: 1, shared: false }));
  assert.equal(opened.length, openedBeforeCache);
  assert.equal(controller.state().workspace, null);
});

test("viewer graph is marked stale during cache loading and offline until server confirmation", async () => {
  const service = fakeCloud();
  const statuses = [];
  const opened = [];
  const controller = createCloudUiController({
    loadService: async () => service,
    callbacks: {
      onWorkspace: (event) => opened.push(event),
      onWorkspaceStatus: (event) => statuses.push(event),
    },
  });
  await controller.openSharedView("A".repeat(22));
  service.emitWorkspace(workspaceReady());
  assert.equal(opened.at(-1).apply, true);
  service.emitWorkspace({ status: "loading" });
  assert.equal(controller.state().status, "loading");
  assert.equal(opened.length, 1);
  assert.match(statuses.at(-1).message, /last confirmed version as stale/i);
  service.emitWorkspace({ status: "offline" });
  assert.equal(controller.state().status, "offline");
  assert.match(statuses.at(-1).message, /last received version/i);
  service.emitWorkspace(workspaceReady({ id: "A".repeat(22), ownerId: "owner-1", currentRevision: 8, shared: true }));
  assert.equal(controller.state().status, "ready");
  assert.equal(opened.length, 2);
});

test("revoked and deleted viewer links clear previously displayed workspace data", async () => {
  const service = fakeCloud();
  const opened = [];
  const unavailable = [];
  const controller = createCloudUiController({
    loadService: async () => service,
    callbacks: { onWorkspace: (event) => opened.push(event), onUnavailable: (event) => unavailable.push(event) },
  });
  await controller.openSharedView("A".repeat(22));
  service.emitWorkspace(workspaceReady());
  assert.equal(opened.length, 1);
  service.emitWorkspace({ status: "revoked" });
  assert.equal(controller.state().workspace, null);
  assert.equal(controller.state().workspaceId, "");
  assert.equal(controller.state().routeUnavailable, true);
  assert.equal(unavailable.at(-1).status, "revoked");

  await controller.openSharedView("B".repeat(22));
  service.emitWorkspace(workspaceReady({ id: "B".repeat(22), ownerId: "owner-1", currentRevision: 8, shared: true }));
  service.emitWorkspace({ status: "deleted" });
  assert.equal(controller.state().workspace, null);
  assert.equal(controller.state().workspaceId, "");
  assert.equal(unavailable.at(-1).status, "deleted");
  assert.equal(opened.length, 2);
});

test("disable and sign-out stop owner listeners and suppress the explicit viewer route", async () => {
  const { controller, service } = await signedInOwner();
  await controller.openSharedView("B".repeat(22));
  service.emitWorkspace(workspaceReady({ id: "B".repeat(22), ownerId: "someone-else", currentRevision: 1, shared: true }));
  const before = service.inspect().workspaces.filter((item) => item.active).length;
  assert.ok(before > 0);
  await controller.signOut();
  assert.equal(controller.state().inOnlineRoute, true);
  assert.equal(controller.state().routeUnavailable, true);
  assert.equal(service.inspect().workspaces.some((item) => item.active), false);
  assert.equal(service.inspect().libraries.some((item) => item.active), false);
  await controller.disableOnline();
  assert.equal(controller.state().mode, "viewer");
  assert.equal(controller.state().enabled, false);
});

test("visited owner map previews before server response but cannot save, share, or delete", async () => {
  const previews = [];
  const { controller, service } = await signedInOwner({ callbacks: { onWorkspacePreview: (event) => previews.push(event) } });
  assert.equal(controller.queueSave(graph("Unsaved draft")), true);
  await controller.openOwnedWorkspace("B".repeat(22));
  const beforeWatches = service.inspect().workspaces.length;
  const opening = controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(previews.length, 1, "preview is synchronous before the new server listener resolves");
  assert.equal(previews[0].graph.project.name, "Atlas sample", "unsaved drafts are never cached");
  assert.equal(previews[0].stale, true);
  assert.equal(previews[0].ownerMatch, false);
  assert.equal(controller.state().stalePreview, true);
  assert.equal(controller.state().canEdit, false);
  assert.equal(controller.state().canDelete, false);
  assert.equal(controller.queueSave(graph("Cannot edit preview")), false);
  await assert.rejects(controller.setShared(true), /Only the signed-in/);
  await assert.rejects(controller.deleteCurrent(), /Only the signed-in/);
  await opening;
  assert.equal(service.inspect().workspaces.length, beforeWatches + 1, "every preview still starts an authorization listener");
  service.emitWorkspace({ ...workspaceReady({ id: "A".repeat(22), ownerId: "owner-1", currentRevision: 8, shared: true }), graph: graph("Latest server graph") });
  assert.equal(controller.state().stalePreview, false);
  assert.equal(controller.state().workspace.currentRevision, 8);
  assert.equal(controller.state().canEdit, true);
  controller.closeWorkspace();
});

test("shared viewer routes never render an owner memory preview", async () => {
  const previews = [];
  const { controller, service } = await signedInOwner({ callbacks: { onWorkspacePreview: (event) => previews.push(event) } });
  await controller.openSharedView("A".repeat(22));
  assert.equal(previews.length, 0);
  assert.equal(controller.state().stalePreview, false);
  service.emitWorkspace({ status: "permission-denied" });
  await controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(previews.length, 0, "permission failure invalidates any retained owner snapshot");
  controller.closeWorkspace();
});

test("sign-out and account switches discard private owner previews", async () => {
  const previews = [];
  const { controller, service } = await signedInOwner({ callbacks: { onWorkspacePreview: (event) => previews.push(event) } });
  await controller.signOut();
  await controller.signIn();
  await settle();
  await controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(previews.length, 0);
  service.emitWorkspace(workspaceReady());
  service.setUser({ uid: "owner-2" });
  await settle();
  service.setUser({ uid: "owner-1" });
  await settle();
  await controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(previews.length, 0);
  controller.closeWorkspace();
});

test("confirmed deletion and owner library removal invalidate memory previews", async () => {
  const previews = [];
  const { controller, service } = await signedInOwner({ callbacks: { onWorkspacePreview: (event) => previews.push(event) } });
  await controller.openOwnedWorkspace("B".repeat(22));
  service.emitLibrary({ status: "ready", workspaces: [] });
  await controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(previews.length, 0);
  service.emitWorkspace(workspaceReady());
  await controller.openOwnedWorkspace("B".repeat(22));
  await controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(previews.length, 1);
  assert.equal(controller.state().stalePreview, true);
  controller.forgetOwnerPreview("A".repeat(22));
  assert.equal(controller.state().stalePreview, false);
  assert.equal(controller.state().routeUnavailable, true);
  await controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(previews.length, 1);
  controller.closeWorkspace();
});
test("matching owner data obtained on a shared route never populates the owner preview cache", async () => {
  const service = fakeCloud();
  const previews = [];
  const controller = createCloudUiController({ loadService: async () => service, callbacks: { onWorkspacePreview: (event) => previews.push(event) } });
  await controller.enableOnline();
  await controller.signIn();
  await settle();
  await controller.openSharedView("A".repeat(22));
  service.emitWorkspace(workspaceReady());
  assert.equal(controller.state().canEdit, true);
  await controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(previews.length, 0);
  assert.equal(controller.state().stalePreview, false);
  controller.closeWorkspace();
});
test("revisiting the cloud library reuses its listener while explicit Retry reattaches", async () => {
  const service = fakeCloud();
  const controller = createCloudUiController({ loadService: async () => service });
  await controller.browseLibrary();
  await controller.signIn();
  await settle();
  const listeners = service.inspect().libraries;
  assert.equal(listeners.length, 1);
  await controller.browseLibrary();
  await controller.enableOnline();
  assert.equal(listeners.length, 1, "ordinary browsing must not start redundant query reads");
  assert.equal(listeners[0].active, true);
  assert.equal(controller.retryLibrary(), true);
  assert.equal(listeners.length, 2);
  assert.equal(listeners[0].active, false);
  controller.closeWorkspace();
  await controller.disableOnline();
});

test("returning to the cloud library immediately replays the same-account list without another subscription", async () => {
  const events = [];
  const { controller, service } = await signedInOwner({ callbacks: { onLibrary: event => events.push(event) } });
  const ready = { status: "ready", workspaces: [{ id: "A".repeat(22), ownerId: "owner-1", name: "Saved map" }] };
  service.emitLibrary(ready);
  const before = service.inspect().libraries.length;
  events.length = 0;
  await controller.browseLibrary();
  assert.equal(service.inspect().libraries.length, before);
  assert.deepEqual(events, [ready]);
  assert.equal(controller.state().canEdit, true);
  controller.closeWorkspace();
});

test("browsing the library cannot mark a pending map ready or overwrite its error/conflict state", async () => {
  const { controller, service } = await signedInOwner();
  await controller.openOwnedWorkspace("B".repeat(22));
  assert.equal(controller.state().status, "loading");
  await controller.browseLibrary();
  assert.equal(controller.state().status, "loading");
  assert.equal(controller.state().canEdit, false);
  service.emitWorkspace({ status: "offline" });
  await controller.browseLibrary();
  assert.equal(controller.state().status, "offline");
  controller.closeWorkspace();
});

test("opening the selected owner map again preserves its listener and unsent edits", async () => {
  const { controller, service } = await signedInOwner({ delay: 60000 });
  controller.queueSave(graph("Unsent edits"));
  const listeners = service.inspect().workspaces.length;
  await controller.openOwnedWorkspace("A".repeat(22));
  assert.equal(service.inspect().workspaces.length, listeners);
  assert.equal(controller.state().dirty, true);
  assert.equal(controller.state().canEdit, true);
  controller.closeWorkspace();
});

test("library replay never exposes the preceding account and retains errors until retry succeeds", async () => {
  const events = [];
  const { controller, service } = await signedInOwner({ callbacks: { onLibrary: event => events.push(event) } });
  service.emitLibrary({ status: "ready", workspaces: [{ id: "A".repeat(22), ownerId: "owner-1" }] });
  service.emitLibrary({ status: "permission-denied", error: { code: "permission-denied" } });
  events.length = 0;
  await controller.browseLibrary();
  assert.equal(events.at(-1).status, "permission-denied");
  service.setUser({ uid: "owner-2" });
  events.length = 0;
  await controller.browseLibrary();
  assert.equal(events.some(event => event.workspaces?.some(item => item.ownerId === "owner-1")), false);
  controller.closeWorkspace();
});


test("confirmed cloud import immediately adopts its graph without a local association or another create", async () => {
  const events = [];
  const { controller, service } = await signedInOwner({ callbacks: { onWorkspaceCreated: event => events.push(event) } });
  const imported = graph("Direct cloud import");
  const created = { id: "D".repeat(22), ownerId: "owner-1", currentRevision: 2, shared: false };
  assert.equal(controller.adoptCreatedWorkspace({ workspace: created, graph: imported, expectedOwnerUid: "owner-1" }), true);
  assert.equal(controller.state().workspaceId, created.id);
  assert.equal(controller.state().canEdit, true);
  assert.equal(events[0].localProjectId, "");
  assert.deepEqual(events[0].graph, imported);
  imported.project.name = "Later mutation";
  assert.equal(events[0].graph.project.name, "Direct cloud import");
  service.emitWorkspace(workspaceReady(), 0);
  assert.equal(controller.state().workspaceId, created.id);
  assert.equal(service.inspect().created.length, 0);
  controller.closeWorkspace();
});

test("a confirmed import from a different account cannot replace the active map", async () => {
  const { controller } = await signedInOwner();
  assert.throws(() => controller.adoptCreatedWorkspace({ workspace: { id: "D".repeat(22), ownerId: "other" }, graph: graph(), expectedOwnerUid: "owner-1" }), /different account/);
  assert.equal(controller.state().workspaceId, "A".repeat(22));
  controller.closeWorkspace();
});
