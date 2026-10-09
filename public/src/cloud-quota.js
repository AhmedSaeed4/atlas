export const MAX_CLOUD_WORKSPACES = 20;
export class CloudQuotaError extends Error {
  constructor(message, code) { super(message); this.name = "CloudQuotaError"; this.code = code; this.status = "error"; }
}
export function registryWorkspaceIds(data) {
  if (!data) return [];
  const ids = data.workspaceIds;
  if (data.schemaVersion !== 1 || !Array.isArray(ids) || ids.some(id => typeof id !== "string" || !/^[A-Za-z0-9_-]{22}$/.test(id)) || new Set(ids).size !== ids.length) {
    throw new CloudQuotaError("Cloud Workspace usage could not be verified. Your maps are unchanged.", "quota-invalid");
  }
  return [...ids];
}
export function addRegistryWorkspace(data, id, maximum = MAX_CLOUD_WORKSPACES) {
  const ids = registryWorkspaceIds(data);
  if (ids.includes(id)) throw new CloudQuotaError("This workspace ID is already registered. Retry the original map rather than creating a duplicate.", "workspace-id-collision");
  if (maximum !== null && ![20, 30, 40].includes(maximum)) throw new CloudQuotaError("The workspace allowance could not be verified. Your maps are unchanged.", "quota-invalid");
  if (maximum !== null && ids.length >= maximum) throw new CloudQuotaError(`You have reached the limit of ${maximum} Cloud Workspaces. Delete a Cloud Workspace to make room, or keep this map locally.`, "workspace-limit");
  return [...ids, id];
}
export function removeRegistryWorkspace(data, id) {
  const ids = registryWorkspaceIds(data);
  if (!data || !ids.includes(id)) throw new CloudQuotaError("Cloud Workspace usage needs setup before this deletion can finish. Your stored map has not been removed.", "quota-uninitialized");
  return ids.filter(value => value !== id);
}
