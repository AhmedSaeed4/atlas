import test from "node:test";
import assert from "node:assert/strict";
import { LIMITS, normalizeGraph } from "../public/src/schema.js";
import { traceRoutes } from "../public/src/traces.js";
import { branchEdgeCandidate, canStartPointerGesture, connectionPreviewPath, nodeContextIsCurrent, screenToWorld } from "../public/src/refinement-graph.js";

const fixture = () => normalizeGraph({
  schemaVersion: 1,
  project: { name: "Branch fixture", type: "Software project" },
  nodes: [
    { id: "source", label: "Source", type: "Service", position: { x: 10, y: 20 } },
    { id: "target", label: "Target", type: "Database", position: { x: 310, y: 20 } },
    { id: "branch", label: "Branch target", type: "Agent", position: { x: 310, y: 170 } },
  ],
  edges: [{ id: "original", source: "source", target: "target", label: "writes", type: "data flow" }],
});
const branch = (graph, overrides = {}) => branchEdgeCandidate(graph, {
  edgeId: "original", expectedEdge: graph.edges.find((edge) => edge.id === "original"), branchTargetId: "branch", junctionLabel: "Junction",
  relationship: "routes", relationshipType: "control", position: { x: 200, y: 80 }, ...overrides,
});

test("one active pointer gesture keeps ownership until it is released", () => {
  assert.equal(canStartPointerGesture(null), true);
  assert.equal(canStartPointerGesture(undefined), true);
  assert.equal(canStartPointerGesture({ kind: "connection", pointerId: 4 }), false);
  assert.equal(canStartPointerGesture({ kind: "node", pointerId: 2 }), false);
});

test("inverse pan/zoom conversion maps a client point to the same graph world point", () => {
  assert.deepEqual(screenToWorld(510, 360, { left: 100, top: 80 }, { x: 10, y: 20, scale: 2 }), { x: 200, y: 130 });
  assert.throws(() => screenToWorld(1, 2, { left: 0, top: 0 }, { x: 0, y: 0, scale: 0 }));
});

test("port preview path is bounded data and rejects non-finite coordinates", () => {
  assert.match(connectionPreviewPath({ x: 10, y: 20 }, { x: 110, y: 60 }), /^M 10 20 C /);
  assert.equal(connectionPreviewPath({ x: NaN, y: 0 }, { x: 1, y: 1 }), "");
  assert.equal(connectionPreviewPath({ x: 1e100, y: 0 }, { x: -1e100, y: 1 }), "");
});

test("branch planning retains source relationship and adds a neutral continuation atomically", () => {
  const graph = fixture();
  const before = structuredClone(graph);
  const candidate = branch(graph);
  assert.deepEqual(graph, before, "planning cannot mutate saved data");
  assert.equal(candidate.nodes.length, graph.nodes.length + 1);
  assert.equal(candidate.edges.length, graph.edges.length + 2);
  const junction = candidate.nodes.find((node) => node.junction);
  assert.equal(junction.type, "Junction");
  assert.deepEqual(junction.position, { x: 200, y: 80 });
  assert.deepEqual(candidate.edges[0], { id: "original", source: "source", target: junction.id, label: "writes", type: "data flow" });
  const continuation = candidate.edges.find((edge) => edge.source === junction.id && edge.target === "target");
  const newBranch = candidate.edges.find((edge) => edge.source === junction.id && edge.target === "branch");
  assert.ok(continuation);
  assert.equal(continuation.label, "");
  assert.equal(continuation.type, "");
  assert.equal(newBranch.label, "routes");
  assert.equal(newBranch.type, "control");
  const trace = traceRoutes(candidate, "source");
  assert.ok(trace.nodes.has("target") && trace.nodes.has("branch"));
});

test("branch planning rejects stale targets, missing edges, bad positions, and ID collisions without changing the graph", () => {
  const graph = fixture();
  const before = structuredClone(graph);
  assert.throws(() => branch(graph, { edgeId: "deleted" }), /no longer exists/);
  assert.throws(() => branch(graph, { expectedEdge: { ...graph.edges[0], target: "other" } }), /changed while the branch form/);
  assert.throws(() => branch(graph, { branchTargetId: "deleted" }), /still exists/);
  assert.throws(() => branch(graph, { position: { x: Infinity, y: 0 } }), /position/);
  assert.throws(() => branch(graph, { ids: { junctionId: "source", continuationId: "new-edge-a", branchId: "new-edge-b" } }), /unique junction/);
  assert.throws(() => branch(graph, { ids: { junctionId: "junction-a", continuationId: "original", branchId: "new-edge-b" } }), /unique continuation/);
  assert.throws(() => branch(graph, { ids: { junctionId: "junction-a", continuationId: "new-edge-a", branchId: "original" } }), /unique branch/);
  assert.deepEqual(graph, before);
});

test("branch planning accepts exact node and net edge limits and rejects overflow", () => {
  const graph = fixture();
  const atNodeBoundary = { ...graph, nodes: [...graph.nodes, ...Array.from({ length: LIMITS.nodes - 1 - graph.nodes.length }, (_, index) => ({ id: "n" + index, label: "N" + index, type: "Node" }))] };
  const atEdgeBoundary = { ...graph, edges: [...graph.edges, ...Array.from({ length: LIMITS.edges - 2 - graph.edges.length }, (_, index) => ({ id: "e" + index, source: "source", target: "target", label: "", type: "" }))] };
  const nodeBoundary = branch(atNodeBoundary);
  const edgeBoundary = branch(atEdgeBoundary);
  assert.equal(nodeBoundary.nodes.length, LIMITS.nodes);
  assert.equal(edgeBoundary.edges.length, LIMITS.edges);
  const tooManyNodes = { ...atNodeBoundary, nodes: [...atNodeBoundary.nodes, { id: "overflow-node", label: "Overflow", type: "Node" }] };
  const tooManyEdges = { ...atEdgeBoundary, edges: [...atEdgeBoundary.edges, { id: "overflow-edge", source: "source", target: "target", label: "", type: "" }] };
  assert.throws(() => branch(tooManyNodes), /component limit/);
  assert.throws(() => branch(tooManyEdges), /two additional connections/);
  assert.deepEqual(graph.edges, fixture().edges, "planning and failed preflight leave the source graph unchanged");
});

test("branching preserves cycles and parallel edges while allowing the editor’s existing self-link policy", () => {
  const graph = fixture();
  const selfLinkCandidate = branch(graph, { branchTargetId: "source" });
  const parallelCandidate = branch(graph, { branchTargetId: "target" });
  assert.ok(selfLinkCandidate.edges.some((edge) => edge.target === "source" && edge.source.startsWith("component-")));
  assert.equal(parallelCandidate.edges.filter((edge) => edge.source.startsWith("component-") && edge.target === "target").length, 2);
  const selfLoop = { id: "loop", source: "source", target: "source", label: "loops", type: "cycle" };
  const selfLoopGraph = { ...graph, edges: [...graph.edges, selfLoop] };
  const loopResult = branchEdgeCandidate(selfLoopGraph, { edgeId: "loop", expectedEdge: selfLoop, branchTargetId: "branch", junctionLabel: "Loop junction", position: { x: 20, y: 20 } });
  assert.ok(loopResult.edges.some((edge) => edge.id === "loop" && edge.source === "source" && edge.target.startsWith("component-")));
  assert.ok(loopResult.edges.some((edge) => edge.source.startsWith("component-") && edge.target === "source"));
});


test("node context snapshot binds an action to the active project, graph, and unchanged node", () => {
  const graph = fixture();
  const project = { id: "project-a", graph };
  const node = graph.nodes[0];
  const context = { projectId: project.id, graphRef: graph, nodeId: node.id, nodeSnapshot: JSON.stringify(node) };
  assert.equal(nodeContextIsCurrent(project, node, context), true);
  assert.equal(nodeContextIsCurrent({ ...project, id: "project-b" }, node, context), false);
  assert.equal(nodeContextIsCurrent({ id: project.id, graph: structuredClone(graph) }, node, context), false);
  assert.equal(nodeContextIsCurrent(project, { ...node, label: "Changed" }, context), false);
  assert.equal(nodeContextIsCurrent(project, undefined, context), false);
});
