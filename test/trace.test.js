import test from "node:test";
import assert from "node:assert/strict";
import { traceRoutes } from "../public/src/traces.js";

test("traces only downstream routes from the selected root, including cycles", () => {
  const graph = {
    nodes: ["root", "parent", "grandparent", "parent-sibling", "child-a", "child-b", "leaf", "child-sibling"].map((id) => ({ id })),
    edges: [
      { source: "parent", target: "root" },           // upstream
      { source: "grandparent", target: "parent" },     // upstream
      { source: "parent", target: "parent-sibling" }, // sibling: wrong direction upstream
      { source: "root", target: "child-a" },           // downstream
      { source: "root", target: "child-b" },           // downstream sibling branch
      { source: "child-a", target: "leaf" },            // downstream
      { source: "child-sibling", target: "child-a" },  // sibling: wrong direction downstream
      { source: "parent", target: "child-a" },          // joins traced nodes but is not a root route
      { source: "root", target: "root" },               // root self-loop
      { source: "leaf", target: "root" },               // downstream cycle back to root
    ],
  };

  const trace = traceRoutes(graph, "root");
  assert.deepEqual([...trace.nodes].sort(), ["child-a", "child-b", "leaf", "root"].sort());
  assert.deepEqual([...trace.edges].sort((a, b) => a - b), [3, 4, 5, 8, 9]);
});

test("returns an empty trace for a missing root", () => {
  const trace = traceRoutes({ nodes: [{ id: "known" }], edges: [] }, "missing");
  assert.equal(trace.nodes.size, 0);
  assert.equal(trace.edges.size, 0);
});
