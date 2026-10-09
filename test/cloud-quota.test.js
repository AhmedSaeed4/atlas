import test from "node:test";
import assert from "node:assert/strict";
import { MAX_CLOUD_WORKSPACES, addRegistryWorkspace, removeRegistryWorkspace, registryWorkspaceIds } from "../public/src/cloud-quota.js";
const ids = Array.from({ length: 21 }, (_, index) => String(index).padStart(22, "A"));
const data = workspaceIds => ({ schemaVersion: 1, workspaceIds });
test("the20th workspace is admitted and the21st is rejected without changing the registry", () => {
  assert.equal(MAX_CLOUD_WORKSPACES, 20);
  const full = addRegistryWorkspace(data(ids.slice(0,19)), ids[19]);
  assert.equal(full.length,20);
  assert.throws(() => addRegistryWorkspace(data(full), ids[20]), { code: "workspace-limit" });
  assert.deepEqual(full, ids.slice(0,20));
});
test("registered candidate retries are distinguished from the cap and never consume another slot", () => {
  assert.throws(() => addRegistryWorkspace(data(ids.slice(0,20)), ids[0]), { code: "workspace-id-collision" });
});
test("deletion releases exactly its own slot and preserves other or legacy over-limit maps", () => {
  const remaining=removeRegistryWorkspace(data(ids),ids[0]);
  assert.deepEqual(remaining, ids.slice(1));
  assert.throws(() => addRegistryWorkspace(data(remaining),ids[0]), { code:"workspace-limit" });
  assert.equal(addRegistryWorkspace(data(removeRegistryWorkspace(data(remaining),ids[1])),ids[0]).length,20);
  assert.throws(() => removeRegistryWorkspace(null,ids[0]), { code:"quota-uninitialized" });
});
test("corrupt or duplicate accounting fails closed rather than resetting usage", () => {
  for (const workspaceIds of [ids.slice(0,2).concat(ids[0]), ["bad"], [false], {}]) assert.throws(() => registryWorkspaceIds(data(workspaceIds)),{code:"quota-invalid"});
});
