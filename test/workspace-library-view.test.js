import test from "node:test";
import assert from "node:assert/strict";
import {
  createLibraryPreferences,
  filterWorkspaceLibrary,
  editedLabel,
} from "../public/src/workspace-library-view.js";
const storage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
};
test("pins and library search change presentation order without mutating canonical workspace order", () => {
  const source = [
    { id: "new", name: "New frontend", projectType: "Web app" },
    { id: "old", name: "Old service", projectType: "API" },
  ];
  const before = JSON.stringify(source);
  assert.deepEqual(
    filterWorkspaceLibrary(source, { pinned: new Set(["old"]) }).map(
      (item) => item.id,
    ),
    ["old", "new"],
  );
  assert.deepEqual(
    filterWorkspaceLibrary(source, { query: "old api" }).map((item) => item.id),
    ["old"],
  );
  assert.equal(JSON.stringify(source), before);
});
test("pin preferences survive reload and are isolated by local/cloud owner context", () => {
  const local = storage(),
    prefs = createLibraryPreferences(local);
  assert.equal(prefs.toggle({ origin: "local", id: "same" }).pinned, true);
  prefs.toggle({ origin: "cloud", ownerUid: "alice", id: "same" });
  const reloaded = createLibraryPreferences(local);
  assert.equal(reloaded.pinned({ origin: "local" }).has("same"), true);
  assert.equal(
    reloaded.pinned({ origin: "cloud", ownerUid: "alice" }).has("same"),
    true,
  );
  assert.equal(
    reloaded.pinned({ origin: "cloud", ownerUid: "bob" }).has("same"),
    false,
  );
  assert.equal(reloaded.pinned({ origin: "cloud" }).size, 0);
  reloaded.toggle({ origin: "cloud", ownerUid: "alice", id: "same" });
  assert.equal(reloaded.pinned({ origin: "local" }).has("same"), true);
});
test("blocked and corrupt preferences do not block navigation or claim durable pins", () => {
  const prefs = createLibraryPreferences({
    getItem: () => "{",
    setItem() {
      throw Error("blocked");
    },
  });
  assert.deepEqual(prefs.toggle({ origin: "local", id: "a" }), {
    pinned: true,
    saved: false,
  });
  assert.equal(prefs.pinned({ origin: "local" }).has("a"), true);
  assert.deepEqual(prefs.toggle({ origin: "cloud", id: "b" }), {
    pinned: false,
    saved: false,
  });
  assert.equal(editedLabel("not-a-date"), "");
  assert.equal(editedLabel(1000, 1001), "Edited today");
});
