import test from "node:test";
import assert from "node:assert/strict";
import { workspaceGraphPresentation, workspaceLoadingPresentation } from "../public/src/workspace-loading.js";
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

const graph = (label = "API") => ({ schemaVersion: 1, project: { name: "Fictional map" }, nodes: [{ id: "api", label, type: "api" }], edges: [] });
test("a first cloud response uses a fresh graph entrance after an empty loading frame", () => {
  const incoming = graph();
  const presentation = workspaceGraphPresentation({ workspaceId: "a", graph: incoming });
  assert.equal(presentation.firstLoad, true);
  assert.equal(presentation.preserveGraph, false);
  assert.equal(presentation.graph, incoming);
});
test("server confirmation preserves a matching preview and its running entrance", () => {
  const preview = { onlineWorkspaceId: "a", cachedPreview: true, graph: graph() };
  const confirmation = structuredClone(preview.graph);
  const presentation = workspaceGraphPresentation({ previousProject: preview, workspaceId: "a", graph: confirmation });
  assert.equal(presentation.firstLoad, false);
  assert.equal(presentation.preserveGraph, true);
  assert.equal(presentation.graph, preview.graph);
});
test("metadata and repeated ready responses preserve the graph without replaying its entrance", () => {
  const current = { onlineWorkspaceId: "a", graph: graph() };
  for (const incoming of [current.graph, structuredClone(current.graph)]) {
    const presentation = workspaceGraphPresentation({ previousProject: current, workspaceId: "a", graph: incoming });
    assert.equal(presentation.firstLoad, false);
    assert.equal(presentation.preserveGraph, true);
    assert.equal(presentation.graph, current.graph);
  }
});
test("a real live graph update renders new content without restarting navigation animation", () => {
  const previous = { onlineWorkspaceId: "a", graph: graph() }, incoming = graph("Updated API");
  const presentation = workspaceGraphPresentation({ previousProject: previous, workspaceId: "a", graph: incoming });
  assert.equal(presentation.firstLoad, false);
  assert.equal(presentation.preserveGraph, false);
  assert.equal(presentation.graph, incoming);
  assert.equal(previous.graph.nodes[0].label, "API");
});
test("switching cloud maps starts an entrance even when the maps have identical contents", () => {
  const previous = { onlineWorkspaceId: "a", graph: graph() }, incoming = structuredClone(previous.graph);
  const presentation = workspaceGraphPresentation({ previousProject: previous, workspaceId: "b", graph: incoming });
  assert.equal(presentation.firstLoad, true);
  assert.equal(presentation.preserveGraph, false);
  assert.equal(presentation.graph, incoming);
});
test("empty confirmed maps retain their mounted empty view on metadata updates", () => {
  const empty = { schemaVersion: 1, project: { name: "Empty" }, nodes: [], edges: [] };
  const presentation = workspaceGraphPresentation({ previousProject: { onlineWorkspaceId: "a", graph: empty }, workspaceId: "a", graph: structuredClone(empty) });
  assert.equal(presentation.firstLoad, false);
  assert.equal(presentation.preserveGraph, true);
});
