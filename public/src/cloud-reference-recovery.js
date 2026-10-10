import { associationWorkspaceId } from "./cloud-associations.js";

// Only confirmed old associations can be retired. A pending upload may already
// exist despite a lost response and must keep its candidate for explicit retry.
export async function verifyCloudAssociation({
  associations, projectId, workspaceId, ownerUid, getCurrentOwnerUid,
  listWorkspaces, saveAssociations, isCurrent = () => true,
} = {}) {
  const record = associations?.[projectId];
  const uid = String(ownerUid || "");
  if (!uid || !workspaceId || !record || typeof record !== "object" || record.ownerUid !== uid
      || associationWorkspaceId(record) !== workspaceId) return { status: "unverified" };
  if ((record.pending === true || record.committed === false) && record.committed !== true) return { status: "pending" };
  const current = () => associations[projectId] === record
    && getCurrentOwnerUid() === uid && isCurrent() !== false;
  if (!current()) return { status: "stale" };
  const result = await listWorkspaces();
  if (!current()) return { status: "stale" };
  if (result?.status !== "ready" || !Array.isArray(result.workspaces)
      || result.workspaces.some(item => !item?.id || item.ownerId !== uid)) {
    throw new Error("Cloud Workspace could not confirm this map. Your local copy and saved reference are unchanged; retry when online.");
  }
  const workspace = result.workspaces.find(item => item.id === workspaceId);
  if (workspace) return { status: "present", workspace };
  delete associations[projectId];
  let saved = false;
  try { saved = saveAssociations() === true; } catch {}
  if (!saved) {
    associations[projectId] = record;
    throw new Error("Atlas could not save the repaired cloud reference. Your local map remains available; retry when browser storage is writable.");
  }
  return { status: "missing", projectId, workspaceId, ownerUid: uid };
}
