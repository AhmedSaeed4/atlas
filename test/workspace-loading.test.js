import test from "node:test";
import assert from "node:assert/strict";
import { workspaceLoadingPresentation } from "../public/src/workspace-loading.js";
const pending = { online: true, status: "loading", workspaceId: "a", graphWorkspaceId: "", hasGraph: false };
test("a first remote load shows skeletons and identifies only its selected row", () => {
  assert.deepEqual(workspaceLoadingPresentation(pending), { busy: true, surface: "skeleton", rowId: "a" });
});
test("only a matching cached map stays visible during confirmation", () => {
  assert.equal(workspaceLoadingPresentation({ ...pending, hasGraph: true, graphWorkspaceId: "a" }).surface, "preview");
  assert.equal(workspaceLoadingPresentation({ ...pending, hasGraph: true, graphWorkspaceId: "previous" }).surface, "skeleton");
});
test("ready, empty, failure and authority loss stop skeletons and row breathing", () => {
  for (const status of ["ready", "offline", "error", "revoked", "deleted", "not-found", "permission-denied", "disabled", "conflict", "signed-out"]) {
    assert.deepEqual(workspaceLoadingPresentation({ ...pending, status }), { busy: false, surface: "idle", rowId: "" }, status);
  }
  assert.equal(workspaceLoadingPresentation({ ...pending, unavailable: true }).busy, false);
  assert.equal(workspaceLoadingPresentation({ ...pending, online: false }).busy, false);
});
test("rapid switching animates the new row and never presents an earlier graph as its preview", () => {
  const first = workspaceLoadingPresentation({ ...pending, graphWorkspaceId: "a", hasGraph: true });
  const next = workspaceLoadingPresentation({ ...pending, workspaceId: "b", graphWorkspaceId: "a", hasGraph: true });
  assert.equal(first.rowId, "a");
  assert.deepEqual(next, { busy: true, surface: "skeleton", rowId: "b" });
});
test("saving and live ready revisions do not trigger loading presentation", () => {
  for (const status of ["saving", "ready"]) assert.equal(workspaceLoadingPresentation({ ...pending, status, hasGraph: true, graphWorkspaceId: "a" }).surface, "idle");
});

test("background metadata rechecks never restart an already displayed workspace entrance", () => {
  assert.deepEqual(workspaceLoadingPresentation({ ...pending, navigationPending: false, hasGraph: true, graphWorkspaceId: "a" }), { busy: false, surface: "idle", rowId: "" });
});
