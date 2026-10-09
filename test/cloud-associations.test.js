import test from "node:test";
import assert from "node:assert/strict";
import {
  admissionRequiresConfirmation,
  findPendingAdmissionAssociation,
  localProjectForWorkspaceAssociation,
  workspaceForLocalAssociation,
  writeOwnerAssociation,
} from "../public/src/cloud-associations.js";

test("local map associations remain scoped to the account that created them", () => {
  const associations = {
    localA: { workspaceId: "candidate-owner-a-1234567890", ownerUid: "owner-a", pending: false },
    localPendingA: { workspaceId: "candidate-pending-a-123456789", ownerUid: "owner-a", pending: true, committed: false },
  };
  assert.equal(workspaceForLocalAssociation(associations.localA, "owner-a"), "candidate-owner-a-1234567890");
  assert.equal(workspaceForLocalAssociation(associations.localA, "owner-b"), "");
  assert.equal(workspaceForLocalAssociation(associations.localPendingA, "owner-b"), "");
  assert.equal(localProjectForWorkspaceAssociation(associations, "candidate-owner-a-1234567890", "owner-a"), "localA");
  assert.equal(localProjectForWorkspaceAssociation(associations, "candidate-owner-a-1234567890", "owner-b"), "");
});

test("a late create completion stays associated with its creator after an account switch", () => {
  const associations = {};
  writeOwnerAssociation(associations, "localA", "created-by-a-123456789012", "owner-a", { pending: true, committed: true });
  assert.equal(workspaceForLocalAssociation(associations.localA, "owner-b"), "");
  assert.equal(localProjectForWorkspaceAssociation(associations, "created-by-a-123456789012", "owner-b"), "");
  assert.equal(associations.localA.ownerUid, "owner-a");
});

test("pending fragment admission lookup surfaces another owner's candidate for confirmation", () => {
  const associations = {
    localA: { workspaceId: "pending-owner-a-12345678", ownerUid: "owner-a", pending: true, source: "fragment", key: "stable-hash" },
  };
  const pending = findPendingAdmissionAssociation(associations, "fragment", "stable-hash", "owner-b");
  assert.equal(pending.ownerUid, "owner-a");
  assert.equal(workspaceForLocalAssociation(pending, "owner-b"), "");
});

test("legacy IDs are verified against the active owner's library before routing", () => {
  const record = "legacy-workspace-12345678901";
  assert.equal(workspaceForLocalAssociation(record, ""), "verify:" + record);
  assert.equal(workspaceForLocalAssociation(record, "owner-a", null), "verify:" + record);
  assert.equal(workspaceForLocalAssociation(record, "owner-a", []), "");
  assert.equal(workspaceForLocalAssociation(record, "owner-a", [{ id: record }]), record);
});

test("signed-out local receipts and changed-owner candidates require explicit confirmation", () => {
  assert.equal(admissionRequiresConfirmation({ pending: true, confirmationRequired: true, ownerUid: "" }, "owner-a"), true);
  assert.equal(admissionRequiresConfirmation({ pending: true, ownerUid: "owner-a" }, "owner-b"), true);
  assert.equal(admissionRequiresConfirmation({ pending: true, ownerUid: "owner-a" }, "owner-a"), false);
});
