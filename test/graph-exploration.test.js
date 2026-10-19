import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEditableGraph } from "../public/src/schema.js";
import {
  nodeMatchesQuery,
  projectCollapsedGroups,
  searchComponents,
} from "../public/src/graph-exploration.js";
import { traceRoutes } from "../public/src/traces.js";
const fixture = () =>
  normalizeEditableGraph({
    project: { name: "Fictional" },
    nodes: [
      { id: "client", label: "Client", type: "Frontend", group: "Interface" },
      {
        id: "api",
        label: "API",
        type: "Service",
        source: "src/api.ts",
        group: "Services",
      },
      { id: "db", label: "Database", type: "Database", group: "Services" },
      { id: "other", label: "Other", type: "Service" },
    ],
    edges: [
      { id: "calls", source: "client", target: "api", label: "calls" },
      { id: "reads", source: "api", target: "db", label: "reads" },
      { id: "direct", source: "client", target: "db", label: "loads" },
      { id: "back", source: "db", target: "api", label: "feedback" },
    ],
  });
test("finder matches evidence/path tokens, prioritizes names, bounds results and describes hidden matches", () => {
  const graph = fixture();
  assert.equal(nodeMatchesQuery(graph.nodes[1], "service src/api"), true);
  const found = searchComponents(graph, "api", {
    collapsedGroups: new Set(["Services"]),
    limit: 1,
  });
  assert.equal(found.total, 1);
  assert.equal(found.results[0].node.id, "api");
  assert.equal(found.results[0].hidden, true);
  assert.equal(searchComponents(graph, "", { limit: 2 }).results.length, 0);
  assert.equal(
    searchComponents(graph, "service", { limit: 1 }).results.length,
    1,
  );
  assert.equal(searchComponents(graph, "not present").total, 0);
});
test("upstream, downstream and immediate neighbours retain correct directed relationships and cycles", () => {
  const graph = fixture();
  assert.deepEqual([...traceRoutes(graph, "api", "upstream").nodes].sort(), [
    "api",
    "client",
    "db",
  ]);
  assert.deepEqual([...traceRoutes(graph, "api", "downstream").nodes].sort(), [
    "api",
    "db",
  ]);
  assert.deepEqual(
    [...traceRoutes(graph, "client", "neighbours").nodes].sort(),
    ["api", "client", "db"],
  );
  assert.equal(traceRoutes(graph, "missing", "upstream").nodes.size, 0);
  assert.equal(traceRoutes(graph, "api", "all").nodes.size, 4);
});
test("folded groups summarize existing edges without mutating, exporting or manufacturing architecture", () => {
  const graph = fixture(),
    before = JSON.stringify(graph),
    view = projectCollapsedGroups(graph, new Set(["Services"]));
  assert.equal(JSON.stringify(graph), before);
  assert.equal(view.nodes.length, 3);
  const group = view.nodes.find((node) => node.viewGroup === "Services");
  assert.equal(group.memberCount, 2);
  assert.match(group.description, /2 internal connections/);
  const grouped = view.edges.find((edge) => edge.target === group.id);
  assert.equal(grouped.viewAggregate, true);
  assert.deepEqual(grouped.viewEdgeIds, ["calls", "direct"]);
  assert.equal(view.edges.length, 1);
  assert.equal(projectCollapsedGroups(graph, new Set()), graph);
  assert.equal(nodeMatchesQuery(group, "src/api"), true);
});
test("group view IDs cannot collide with user IDs, and ungrouped/self relationships remain meaningful", () => {
  const graph = fixture();
  graph.nodes.push({
    id: "@atlas-group:0",
    label: "Actual user node",
    type: "Service",
    group: "",
  });
  graph.edges.push({
    id: "self",
    source: "other",
    target: "other",
    label: "loops",
  });
  const view = projectCollapsedGroups(graph, new Set(["Services"]));
  const ids = view.nodes.map((node) => node.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(
    view.nodes.some((node) => node.id === "@atlas-group:0" && !node.viewGroup),
  );
  assert.ok(
    view.edges.some(
      (edge) =>
        edge.id === "self" &&
        edge.source === "other" &&
        edge.target === "other",
    ),
  );
});
