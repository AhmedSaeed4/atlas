import { CloudQuotaError } from "./cloud-quota.js";

export const DEFAULT_WORKSPACE_LIMIT = 20;
export const WORKSPACE_LIMIT_CHOICES = Object.freeze([20, 30, 40, null]);
export function accountUid(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) {
    throw new CloudQuotaError("The account identifier is invalid.", "invalid-account");
  }
  return value;
}
export function workspaceLimit(data) {
  if (data == null) return DEFAULT_WORKSPACE_LIMIT;
  if (data.schemaVersion !== 1 || !WORKSPACE_LIMIT_CHOICES.includes(data.maxWorkspaces)) {
    throw new CloudQuotaError("The workspace allowance could not be verified. Your maps are unchanged.", "quota-invalid");
  }
  return data.maxWorkspaces;
}
export function validateWorkspaceLimit(value) {
  if (!WORKSPACE_LIMIT_CHOICES.includes(value)) {
    throw new CloudQuotaError("Choose 20, 30, 40, or unlimited workspaces.", "invalid-limit");
  }
  return value;
}
export function limitLabel(value) { return value === null ? "Unlimited" : String(value); }
export function timestampText(value) {
  if (typeof value?.toDate === "function") return value.toDate().toISOString();
  return typeof value === "string" ? value : null;
}
export function accountProfileFromClaims(uid, claims) {
  accountUid(uid);
  if (claims?.email_verified !== true || typeof claims.email !== "string" || !claims.email
      || claims.email.length > 320 || typeof claims.name !== "string" || claims.name.length > 200) return null;
  return Object.freeze({ schemaVersion: 1, uid, name: claims.name, email: claims.email });
}
