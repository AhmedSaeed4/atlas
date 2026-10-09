export function associationWorkspaceId(record) {
  return typeof record === "string" ? record : String(record?.workspaceId || "");
}

export function findPendingAdmissionAssociation(associations, source, key, uid = "") {
  const matches = Object.entries(associations || {}).filter(([, record]) =>
    record && typeof record === "object" && record.pending === true
      && record.source === source && String(record.key || "") === String(key || ""));
  return matches.find(([, record]) => !record.ownerUid || !uid || record.ownerUid === uid)?.[1]
    || matches[0]?.[1] || null;
}

export function admissionRequiresConfirmation(record, uid = "") {
  const ownerUid = String(uid || "");
  return record?.confirmationRequired === true
    || Boolean(record?.ownerUid && ownerUid && record.ownerUid !== ownerUid);
}

export function localProjectForWorkspaceAssociation(associations, workspaceId, uid) {
  const ownerUid = String(uid || "");
  if (!ownerUid) return "";
  return Object.entries(associations || {}).find(([, record]) =>
    associationWorkspaceId(record) === workspaceId
      && typeof record !== "string" && record.ownerUid === ownerUid
      && !(record.pending === true && record.committed !== true))?.[0] || "";
}

export function workspaceForLocalAssociation(record, uid, librarySnapshot) {
  const workspaceId = associationWorkspaceId(record);
  if (!workspaceId) return "";
  const ownerUid = String(uid || "");
  if (typeof record === "string") {
    if (!ownerUid) return "verify:" + workspaceId;
    const inOwnerLibrary = librarySnapshot?.some((item) => item.id === workspaceId);
    if (inOwnerLibrary) return workspaceId;
    return Array.isArray(librarySnapshot) ? "" : "verify:" + workspaceId;
  }
  if (record.pending === true) {
    if (record.ownerUid && ownerUid && record.ownerUid !== ownerUid) return "";
    if (record.committed === true && record.ownerUid && record.ownerUid === ownerUid) return workspaceId;
    return "pending:" + workspaceId;
  }
  if (!ownerUid) return "verify:" + workspaceId;
  return record.ownerUid === ownerUid ? workspaceId : "";
}

export function writeOwnerAssociation(associations, projectId, workspaceId, ownerUid, details = {}) {
  if (!projectId || !workspaceId || !ownerUid) return null;
  const record = { workspaceId, ownerUid: String(ownerUid), pending: false, ...details };
  associations[projectId] = record;
  return record;
}
