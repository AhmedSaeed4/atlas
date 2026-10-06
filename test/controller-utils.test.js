import test from "node:test";
import assert from "node:assert/strict";
import { addOrReuseExampleProject, clearLocalDataRoute, clearRejectedShareRoute, consumeFlowExampleQuery, createRevisionGate, createShareLoadTracker, fitScaleForBounds, isFlowExampleRoute, readImportSource, removeProjectSnapshot, shareFailureContext, shouldSaveOnEnter } from "../public/src/controller-utils.js";

test("paste tab uses its text even when a previously selected file remains", async () => {
  const staleFile = { name: "old-map.json" };
  const result = await readImportSource({
    tab: "paste",
    pastedText: "{\"project\":\"pasted map\"}",
    file: staleFile,
    readFile: async () => "{\"project\":\"stale file\"}",
  });
  assert.equal(result, "{\"project\":\"pasted map\"}");
});

test("file tab requires and reads its selected file", async () => {
  await assert.rejects(readImportSource({
    tab: "file", pastedText: "{\"project\":\"ignored\"}", file: null, readFile: async () => "",
  }), /Choose a JSON file/);
  const file = { name: "current-map.json" };
  const result = await readImportSource({
    tab: "file", pastedText: "", file, readFile: async (received) => received === file ? "{\"project\":\"current\"}" : "",
  });
  assert.equal(result, "{\"project\":\"current\"}");
});

test("closing or changing import context discards a late file read", async () => {
  const gate = createRevisionGate();
  let finishRead;
  const token = gate.begin();
  const pendingRead = readImportSource({
    tab: "file",
    pastedText: "",
    file: { name: "slow.json" },
    readFile: () => new Promise((resolve) => { finishRead = resolve; }),
    token,
    isCurrent: gate.isCurrent,
  });
  gate.invalidate();
  finishRead("{\"project\":\"late result\"}");
  assert.equal(await pendingRead, null);
  assert.equal(gate.isCurrent(token), false);
});

test("wide accepted maps fit below the former 18 percent floor", () => {
  const scale = fitScaleForBounds({ width: 15300, height: 420 }, { width: 716, height: 500 });
  assert.ok(scale < 0.18);
  assert.ok(scale > 0);
  assert.equal(fitScaleForBounds({ width: 300, height: 220 }, { width: 716, height: 500 }), 1.25);
});

test("Enter saves only ordinary single-line editor input", () => {
  const input = { tagName: "INPUT" };
  const enter = { key: "Enter", target: input };
  assert.equal(shouldSaveOnEnter(enter), true);
  assert.equal(shouldSaveOnEnter({ ...enter, target: { tagName: "TEXTAREA" } }), false);
  assert.equal(shouldSaveOnEnter({ ...enter, isComposing: true }), false);
  assert.equal(shouldSaveOnEnter({ ...enter, keyCode: 229 }), false);
  assert.equal(shouldSaveOnEnter({ ...enter, shiftKey: true }), false);
  assert.equal(shouldSaveOnEnter({ ...enter, repeat: true }), false);
});
test("flow example route yields to any fragment and consumes only its own query parameter", () => {
  assert.equal(isFlowExampleRoute("?example=flow&campaign=local", ""), true);
  assert.equal(isFlowExampleRoute("?example=flow", "#map=g.snapshot"), false);
  assert.equal(isFlowExampleRoute("?example=other", ""), false);
  assert.equal(consumeFlowExampleQuery("?example=flow&campaign=local"), "?campaign=local");
  assert.equal(consumeFlowExampleQuery("?campaign=local"), "?campaign=local");
});

test("optional example action adds one request-flow project and reuses an edited copy", () => {
  const otherExample = { id: "old-sample", exampleId: "other-demo", graph: { name: "Older demo" } };
  const savedFlow = { id: "flow", exampleId: "request-flow", graph: { name: "Owner edits" } };
  const original = [otherExample, savedFlow];
  let created = 0;
  const reused = addOrReuseExampleProject(original, "request-flow", () => { created += 1; return {}; });
  assert.equal(reused.project, savedFlow);
  assert.equal(reused.projects, original);
  assert.equal(reused.added, false);
  assert.equal(created, 0);

  const addedFlow = { id: "new-flow", exampleId: "request-flow" };
  const added = addOrReuseExampleProject([otherExample], "request-flow", () => { created += 1; return addedFlow; });
  assert.deepEqual(added.projects, [addedFlow, otherExample]);
  assert.equal(added.project, addedFlow);
  assert.equal(added.added, true);
  assert.equal(created, 1);
});

test("clearing local data consumes example intent and the share fragment", () => {
  assert.deepEqual(clearLocalDataRoute("?example=flow&campaign=local"), { search: "?campaign=local", hash: "" });
  assert.deepEqual(clearLocalDataRoute("?campaign=local"), { search: "?campaign=local", hash: "" });
});

test("JSON recovery clears only the exact rejected share fragment and consumes example intent", () => {
  assert.deepEqual(clearRejectedShareRoute("?example=flow&campaign=local", "#map=g.bad", "#map=g.bad"), { search: "?campaign=local", hash: "" });
  assert.equal(clearRejectedShareRoute("?campaign=local", "#map=g.new", "#map=g.bad"), null);
  assert.equal(clearRejectedShareRoute("?campaign=local", "#other", "#other"), null);
});

test("confirmed project deletion resolves only the captured project graph snapshot", () => {
  const firstGraph = {};
  const otherGraph = {};
  const first = { id: "shared", graph: firstGraph };
  const other = { id: "other", graph: otherGraph };
  const projects = [first, other];
  const context = { projectId: first.id, projectRef: first, graphRef: firstGraph };

  const result = removeProjectSnapshot(projects, context, other.id);
  assert.equal(result.project, first);
  assert.deepEqual(result.projects, [other]);
  assert.equal(result.activeId, other.id);
  assert.equal(result.wasActive, false);
  assert.deepEqual(projects, [first, other]);

  assert.equal(removeProjectSnapshot([{ id: first.id, graph: {} }], context, first.id), null);
  assert.equal(removeProjectSnapshot([{ id: first.id, graph: firstGraph }], context, first.id), null);
  const activeResult = removeProjectSnapshot(projects, context, first.id);
  assert.equal(activeResult.activeId, other.id);
  assert.equal(activeResult.wasActive, true);
});
test("confirmation interruption resumes only the unchanged pending share route", () => {
  const tracker = createShareLoadTracker();
  const original = tracker.begin("#map=g.incoming");
  const interruption = tracker.interruptPending();

  assert.equal(tracker.isCurrent(original, "#map=g.incoming"), false);
  assert.equal(tracker.shouldResume(interruption, "#map=g.incoming"), true); // Cancel or unrelated confirmed action leaves the route intact.
  assert.equal(tracker.shouldResume(interruption, "#map=g.incoming"), false); // The close event consumes its intent once.
  const retry = tracker.begin("#map=g.incoming");
  assert.equal(tracker.isCurrent(retry, "#map=g.incoming"), true);
  tracker.finish(retry);
  assert.equal(tracker.interruptPending(), null); // An already-loaded snapshot does not schedule another import.
});

test("share retry skips matching deletion and changed routes while preserving newer decode ownership", () => {
  const deletedTracker = createShareLoadTracker();
  const deletedRoute = deletedTracker.begin("#map=g.owner");
  const deletedIntent = deletedTracker.interruptPending();
  assert.equal(deletedTracker.shouldResume(deletedIntent, ""), false);
  assert.equal(deletedTracker.isCurrent(deletedRoute, "#map=g.owner"), false);

  const changedTracker = createShareLoadTracker();
  changedTracker.begin("#map=g.old");
  const changedIntent = changedTracker.interruptPending();
  assert.equal(changedTracker.shouldResume(changedIntent, "#map=g.new"), false);

  const tracker = createShareLoadTracker();
  const original = tracker.begin("#map=g.original");
  const interruption = tracker.interruptPending();
  const newer = tracker.begin("#map=g.original");
  tracker.finish(original); // A late finally from the canceled decode must not clear this newer request.
  assert.equal(tracker.isCurrent(newer, "#map=g.original"), true);
  assert.equal(tracker.shouldResume(interruption, "#map=g.original"), false);
  assert.equal(tracker.interruptPending()?.fragment, "#map=g.original");
});

test("confirmed clear invalidates a pending shared-map decode while cancel can still resume it", () => {
  const tracker = createShareLoadTracker();
  const request = tracker.begin("#map=g.pending");
  const interruption = tracker.interruptPending();
  assert.equal(tracker.isCurrent(request, "#map=g.pending"), false);
  assert.equal(tracker.shouldResume(interruption, "#map=g.pending"), true);

  const confirmedClear = createShareLoadTracker();
  const staleRequest = confirmedClear.begin("#map=g.pending");
  const staleInterruption = confirmedClear.interruptPending();
  confirmedClear.cancel();
  assert.equal(confirmedClear.isCurrent(staleRequest, "#map=g.pending"), false);
  assert.equal(confirmedClear.shouldResume(staleInterruption, ""), false);
  assert.equal(confirmedClear.interruptPending(), null);
});

test("Project details can transfer one interrupted share route to its Delete confirmation", () => {
  const tracker = createShareLoadTracker();
  tracker.begin("#map=g.project");
  const projectDialogIntent = tracker.interruptPending();

  const confirmIntent = tracker.transfer(projectDialogIntent);
  assert.equal(confirmIntent, projectDialogIntent);
  assert.equal(tracker.transfer(projectDialogIntent), null);
  assert.equal(tracker.shouldResume(confirmIntent, "#map=g.project"), true);
  assert.equal(tracker.shouldResume(projectDialogIntent, "#map=g.project"), false);
});

test("invalid-share status distinguishes a retained current map from an empty workspace", () => {
  assert.equal(shareFailureContext(true), "The map currently shown was not replaced by the incoming link.");
  assert.equal(shareFailureContext(false), "No current map was replaced by this link.");
});
