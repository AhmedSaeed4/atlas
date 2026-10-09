import test from "node:test";
import assert from "node:assert/strict";
import { workspaceActionAvailability, workspaceReadSnapshotIsCurrent, isSharedViewer, isCurrentSaveRetry } from "../public/src/workspace-actions.js";
const id = "A".repeat(22);
const state = Object.freeze({ mode: "viewer", status: "ready", workspaceId: id, sharedId: id,
  userUid: "", ownerUid: "owner", canEdit: false, workspace: { id, shared: true, deleting: false } });
const view = { hasProject: true, online: true, state, graphWorkspaceId: id };
test("a signed-out confirmed viewer can forward and export without gaining edit permission", () => {
  assert.deepEqual(workspaceActionAvailability(view), { hideEditing: true, canExport: true, canShare: true });
  assert.equal(state.canEdit, false);
});
test("a signed-in non-owner gets the same viewer controls", () => {
  assert.deepEqual(workspaceActionAvailability({ ...view, state: { ...state, userUid: "other" } }),
    { hideEditing: true, canExport: true, canShare: true });
});
test("owner and local editing controls remain present, including private owner exports", () => {
  assert.deepEqual(workspaceActionAvailability({ hasProject: true }), { hideEditing: false, canExport: true, canShare: true });
  assert.deepEqual(workspaceActionAvailability({ ...view, state: { ...state, mode: "owner", userUid: "owner", canEdit: true, sharedId: "", workspace: { id, shared: false } } }),
    { hideEditing: false, canExport: true, canShare: true });
});
test("loading, revocation, deletion, missing graph and mismatched identity never allow exports", () => {
  for (const status of ["loading", "revoked", "deleted", "permission-denied", "error", "signed-out", "disabled"]) {
    const actions = workspaceActionAvailability({ ...view, state: { ...state, status } });
    assert.equal(actions.canExport, false, status);
    assert.equal(actions.canShare, false, status);
  }
  for (const change of [{ hasProject: false }, { unavailable: true }, { graphWorkspaceId: "B".repeat(22) },
    { state: { ...state, routeUnavailable: true } }, { state: { ...state, stalePreview: true } },
    { state: { ...state, workspace: { id, shared: true, deleting: true } } }]) {
    assert.equal(workspaceActionAvailability({ ...view, ...change }).canExport, false);
  }
});
test("a retained offline confirmed view remains exportable; a private non-owner or wrong share cannot forward it", () => {
  assert.equal(workspaceActionAvailability({ ...view, state: { ...state, status: "offline" } }).canExport, true);
  const privateViewer = workspaceActionAvailability({ ...view, state: { ...state, workspace: { id, shared: false } } });
  assert.equal(privateViewer.canExport, false);
  assert.equal(privateViewer.canShare, false);
  assert.equal(workspaceActionAvailability({ ...view, state: { ...state, sharedId: "B".repeat(22) } }).canShare, false);
});
test("an asynchronous export is cancelled by navigation, graph replacement or access loss", () => {
  const graph = {};
  const snapshot = { projectId: "online-" + id, graph, workspaceId: id };
  const current = { ...snapshot, canExport: true };
  assert.equal(workspaceReadSnapshotIsCurrent(snapshot, current), true);
  for (const change of [{ projectId: "local-map" }, { graph: {} }, { workspaceId: "B".repeat(22) }, { canExport: false }]) {
    assert.equal(workspaceReadSnapshotIsCurrent(snapshot, { ...current, ...change }), false);
  }
});

test("pending owner navigation keeps its disabled controls in place; an explicit viewer route hides them", () => {
  const pending = { online: true, state: { mode: "viewer", status: "loading", workspaceId: id } };
  assert.equal(workspaceActionAvailability(pending).hideEditing, false);
  assert.equal(workspaceActionAvailability({ ...pending, sharedView: true }).hideEditing, true);
  assert.equal(workspaceActionAvailability(pending).canExport, false);
});

test("shared sidebar stays an introduction for signed-out/non-owner viewers, pending and unavailable links", () => {
  assert.equal(isSharedViewer({ sharedView: true }), true);
  for (const status of ["loading", "ready", "offline", "revoked", "not-found", "invalid-link"]) {
    assert.equal(isSharedViewer({ sharedView: true, state: { ...state, status } }), true, status);
  }
  assert.equal(isSharedViewer({ sharedView: true, state: { ...state, userUid: "other" } }), true);
});
test("only confirmed ownership restores the shared-route library; normal app routes retain theirs", () => {
  assert.equal(isSharedViewer({ sharedView: true, state: { ...state, mode: "owner", userUid: "owner" } }), false);
  assert.equal(isSharedViewer({ sharedView: true, state: { ...state, mode: "owner", userUid: "other" } }), true);
  assert.equal(isSharedViewer({ sharedView: false, state }), false);
});


test("a save retry requires an actual pending action and a matching open owner workspace", () => {
  assert.equal(isCurrentSaveRetry(null, { openSession: true }), false, "initial undefined IDs must not match a null retry");
  assert.equal(isCurrentSaveRetry(undefined, {}), false);
  assert.equal(isCurrentSaveRetry({}, { openSession: true }), false);
  const pending = { workspaceId: "map-a", ownerUid: "owner-a", status: "Retrying" };
  const current = { workspaceId: "map-a", userUid: "owner-a", openSession: true };
  assert.equal(isCurrentSaveRetry(pending, current), true);
  for (const change of [{ workspaceId: "map-b" }, { userUid: "owner-b" }, { workspaceId: "" }, { userUid: "" }, { openSession: false }]) assert.equal(isCurrentSaveRetry(pending, { ...current, ...change }), false);
});
