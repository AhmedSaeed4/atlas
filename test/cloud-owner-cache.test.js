import test from "node:test";
import assert from "node:assert/strict";
import { createCloudOwnerCache } from "../public/src/cloud-owner-cache.js";

const snapshot = (id, name = id) => ({
  userUid: "owner-a", serverValidated: true,
  workspace: { id, ownerId: "owner-a", currentRevision: 1, deleting: false },
  graph: { project: { name }, nodes: [], edges: [] },
});

test("only server-confirmed matching owner data can enter the memory cache", () => {
  const cache = createCloudOwnerCache();
  assert.equal(cache.put(snapshot("a")), false);
  cache.setIdentity("owner-a");
  assert.equal(cache.put({ ...snapshot("a"), serverValidated: false }), false);
  assert.equal(cache.put({ ...snapshot("a"), workspace: { id: "a", ownerId: "someone-else", shared: true } }), false);
  assert.equal(cache.put(snapshot("a")), true);
  assert.equal(cache.get("someone-else", "a"), null);
  const found = cache.get("owner-a", "a");
  assert.equal(found.graph.project.name, "a");
  found.graph.project.name = "unsaved edit";
  assert.equal(cache.get("owner-a", "a").graph.project.name, "a");
  const source = snapshot("b");
  cache.put(source);
  source.graph.project.name = "later edit";
  assert.equal(cache.get("owner-a", "b").graph.project.name, "b");
});

test("account change and sign-out clear private snapshots and reject late old-owner events", () => {
  const cache = createCloudOwnerCache();
  cache.setIdentity("owner-a");
  cache.put(snapshot("a"));
  cache.setIdentity("owner-b");
  assert.equal(cache.stats().entries, 0);
  assert.equal(cache.put(snapshot("late-a")), false);
  cache.put({ ...snapshot("b"), userUid: "owner-b", workspace: { id: "b", ownerId: "owner-b" } });
  cache.setIdentity("");
  assert.equal(cache.stats().entries, 0);
  assert.equal(cache.stats().bytes, 0);
  assert.equal(cache.get("owner-b", "b"), null);
});

test("LRU entry and byte bounds prevent unbounded map retention", () => {
  const cache = createCloudOwnerCache({ maxEntries: 2, maxBytes: 2048 });
  cache.setIdentity("owner-a");
  cache.put(snapshot("a"));
  cache.put(snapshot("b"));
  cache.get("owner-a", "a");
  cache.put(snapshot("c"));
  assert.equal(cache.get("owner-a", "b"), null);
  assert.ok(cache.get("owner-a", "a"));
  assert.equal(cache.stats().entries, 2);
  assert.equal(cache.put(snapshot("oversized", "x".repeat(3000))), false);
  assert.ok(cache.stats().bytes <= cache.stats().maxBytes);
  const byteBound = createCloudOwnerCache({ maxEntries: 4, maxBytes: 600 });
  byteBound.setIdentity("owner-a");
  for (const id of ["a", "b", "c", "d"]) byteBound.put(snapshot(id, "x".repeat(100)));
  assert.ok(byteBound.stats().entries < 4);
  assert.ok(byteBound.stats().bytes <= 600);
});

test("delete/revoke invalidation removes retained data and latest revision replaces the preview", () => {
  const cache = createCloudOwnerCache();
  cache.setIdentity("owner-a");
  cache.put(snapshot("a"));
  cache.put({ ...snapshot("a", "new"), workspace: { id: "a", ownerId: "owner-a", currentRevision: 2 } });
  assert.equal(cache.get("owner-a", "a").workspace.currentRevision, 2);
  assert.equal(cache.get("owner-a", "a").graph.project.name, "new");
  assert.equal(cache.remove("wrong-owner", "a"), false);
  assert.equal(cache.remove("owner-a", "a"), true);
  assert.equal(cache.get("owner-a", "a"), null);
  cache.put(snapshot("b"));
  assert.equal(cache.put({ ...snapshot("b"), workspace: { id: "b", ownerId: "owner-a", deleting: true } }), false);
  assert.equal(cache.get("owner-a", "b"), null);
});