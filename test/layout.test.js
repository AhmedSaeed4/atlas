import test from "node:test";
import assert from "node:assert/strict";
import { layoutGraph, NODE_WIDTH } from "../public/src/layout.js";
import { edgeGeometry, edgeRoutingLanes, graphBounds } from "../public/src/geometry.js";

const nodes = (count) => Array.from({ length: count }, (_, index) => ({ id: "n" + index, label: "Node " + index, type: "Module" }));
const finiteBounds = (bounds) => Object.values(bounds).every(Number.isFinite);

test("returns finite empty bounds for an editable empty graph", () => {
  const layout = layoutGraph({ nodes: [], edges: [] });
  assert.equal(layout.positions.size, 0);
  assert.deepEqual(layout.bounds, { x: 0, y: 0, width: 1, height: 1 });
  assert.ok(finiteBounds(graphBounds({ nodes: [], edges: [] }, layout.positions)));
});

test("keeps disconnected nodes in a finite layer", () => {
  const graph = { nodes: nodes(5), edges: [] };
  const layout = layoutGraph(graph);
  assert.ok(finiteBounds(layout.bounds));
  assert.equal(new Set([...layout.positions.values()].map((point) => point.x)).size, 1);
  assert.equal(layout.positions.size, 5);
});

test("layers an acyclic flow left to right", () => {
  const graph = { nodes: nodes(4), edges: [{ source: "n0", target: "n1" }, { source: "n1", target: "n2" }] };
  const layout = layoutGraph(graph);
  assert.ok(layout.positions.get("n0").x < layout.positions.get("n1").x);
  assert.ok(layout.positions.get("n1").x < layout.positions.get("n2").x);
  assert.equal(layout.positions.get("n3").x, layout.positions.get("n0").x);
});

test("condenses a large cycle into one bounded layer", () => {
  const count = 800;
  const graph = {
    nodes: nodes(count),
    edges: Array.from({ length: count }, (_, index) => ({ source: "n" + index, target: "n" + ((index + 1) % count) })),
  };
  const layout = layoutGraph(graph);
  assert.equal(layout.positions.size, count);
  assert.ok(finiteBounds(layout.bounds));
  assert.equal(new Set([...layout.positions.values()].map((point) => point.x)).size, 1);
});

test("routes self-loops and backward edges outside cards and includes them in fit bounds", () => {
  const graph = {
    nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    edges: [{ source: "a", target: "a", label: "loops" }, { source: "b", target: "a", label: "returns" }],
  };
  // Use an explicit dragged layout: the automatic layout deliberately places
  // acyclic edges forward, so it cannot produce a visual back edge by itself.
  const positions = new Map([
    ["a", { x: 322, y: -54 }],
    ["b", { x: 0, y: 100 }],
  ]);
  const loop = edgeGeometry(graph.edges[0], 0, positions);
  const back = edgeGeometry({ source: "a", target: "b", label: "returns" }, 1, positions);
  assert.ok(loop.arrowPoints[1].x > positions.get("a").x + NODE_WIDTH);
  assert.ok(loop.points[1].y < positions.get("a").y);
  assert.ok(back.points[1].y < Math.min(positions.get("a").y, positions.get("b").y));
  const nodeHeight = Math.max(...[...positions.values()].map((point) => point.y + 108)) - Math.min(...[...positions.values()].map((point) => point.y));
  assert.ok(graphBounds(graph, positions).height > nodeHeight);
});
test("chart nodes reserve their full height for layout, routes, and fit bounds", () => {
  const graph = {
    nodes: [
      { id: "source", label: "Measured source", type: "Service", chart: { label: "Series" } },
      { id: "target", label: "Target", type: "Database" },
    ],
    edges: [{ source: "source", target: "target", label: "writes" }],
  };
  const layout = layoutGraph(graph);
  assert.equal(layout.dimensions.get("source").height, 176);
  assert.equal(layout.dimensions.get("target").height, 108);
  const route = edgeGeometry(graph.edges[0], 0, layout.positions, layout.dimensions);
  assert.equal(route.points[0].y, layout.positions.get("source").y + 88);
  assert.equal(route.points[3].y, layout.positions.get("target").y + 54);
  const bounds = graphBounds(graph, layout.positions, layout.dimensions);
  assert.ok(bounds.height >= 176);
  assert.ok(bounds.width > 204);
});

test("small categorized chart cards reserve visible label space without breaking plain nodes", () => {
  const graph = { nodes: [
    { id: "plain", label: "Plain", type: "Module" },
    { id: "labeled", label: "Labeled", type: "Service", chart: { label: "Counts", values: [16, 8, 25], categories: ["Channel", "Agent", "End-to-end"] } },
    { id: "legacy", label: "Legacy", type: "Data", chart: { label: "Old", values: [1, 2, 3] } },
  ], edges: [] };
  const layout = layoutGraph(graph);
  assert.equal(layout.dimensions.get("plain").height, 108);
  assert.equal(layout.dimensions.get("labeled").height, 200);
  assert.equal(layout.dimensions.get("legacy").height, 176);
});

test("long edge labels keep the full value but fit a dependency gap", () => {
  const fullLabel = "publishes durable request events to downstream subscribers";
  const graph = {
    nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    edges: [{ source: "a", target: "b", label: fullLabel }],
  };
  const layout = layoutGraph(graph);
  const geometry = edgeGeometry(graph.edges[0], 0, layout.positions);
  assert.equal(geometry.fullLabel, fullLabel);
  assert.equal(geometry.label.length, 18);
  assert.match(geometry.label, /\.\.\.$/);
  assert.ok(geometry.labelWidth <= 118);
});
test("parallel forward routes get distinct lanes while a single edge stays centered", () => {
  const edge = { source: "a", target: "b", label: "calls" };
  const singleLanes = edgeRoutingLanes([edge]);
  assert.equal(singleLanes.get(0), 0);
  const singleGraph = {
    nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    edges: [edge],
  };
  const singleLayout = layoutGraph(singleGraph);
  assert.equal(
    edgeGeometry(edge, 0, singleLayout.positions).path,
    edgeGeometry(edge, 0, singleLayout.positions, null, singleLanes.get(0)).path,
  );

  const edges = [
    { ...edge, label: "calls A" },
    { ...edge, label: "calls B" },
    { ...edge, label: "calls C" },
    { ...edge, label: "calls D" },
  ];
  const graph = {
    nodes: [{ id: "a", label: "A", type: "API" }, { id: "b", label: "B", type: "Service" }],
    edges,
  };
  const layout = layoutGraph(graph);
  const lanes = edgeRoutingLanes(edges);
  assert.deepEqual([...lanes.values()], [-36, -12, 12, 36]);
  const routes = edges.map((item, index) => edgeGeometry(item, index, layout.positions, layout.dimensions, lanes.get(index)));
  assert.equal(new Set(routes.map((route) => route.path)).size, 4);
  assert.ok(new Set(routes.map((route) => route.labelY)).size > 1);
  const bounds = graphBounds(graph, layout.positions, layout.dimensions);
  for (const route of routes) {
    for (const point of route.points) {
      assert.ok(point.x >= bounds.x && point.x <= bounds.x + bounds.width);
      assert.ok(point.y >= bounds.y && point.y <= bounds.y + bounds.height);
    }
  }
});

test("parallel self-loops and backward edges remain distinct beyond four routes", () => {
  const loopEdges = Array.from({ length: 5 }, (_, index) => ({ source: "a", target: "a", label: "loop " + index }));
  const reverseEdges = Array.from({ length: 5 }, (_, index) => ({ source: "a", target: "b", label: "return " + index }));
  const positions = new Map([
    ["a", { x: 322, y: -54 }],
    ["b", { x: 0, y: 100 }],
  ]);
  const loopLanes = edgeRoutingLanes(loopEdges);
  const loops = loopEdges.map((edge, index) => edgeGeometry(edge, index, positions, null, loopLanes.get(index)));
  assert.equal(new Set(loops.map((route) => route.path)).size, 5);

  const reverseLanes = edgeRoutingLanes(reverseEdges);
  const reverse = reverseEdges.map((edge, index) => edgeGeometry(edge, index, positions, null, reverseLanes.get(index)));
  assert.equal(new Set(reverse.map((route) => route.path)).size, 5);
  const graph = {
    nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    edges: [...loopEdges, ...reverseEdges],
  };
  const bounds = graphBounds(graph, positions);
  assert.ok(Object.values(bounds).every(Number.isFinite));
  assert.ok(bounds.height < 500);
});