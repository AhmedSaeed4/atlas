export function privateRequestOptions() {
  return { skipLog: { body: true, resBody: true, queryParams: true, reqHeaders: true, resHeaders: true } };
}

export function bootstrapWrites({ project, users, administratorUid, existingAdmin, profiles = new Map(), ownLimit = null }) {
  if (!/^[a-z][a-z0-9-]{4,62}$/.test(project)) throw Object.assign(new Error("Invalid project ID."), { code: "invalid-project" });
  const administrator = users.find(user => user.localId === administratorUid);
  if (!administrator || administrator.emailVerified !== true || administrator.disabled === true) {
    throw Object.assign(new Error("The selected administrator must be an existing, verified, enabled account."), { code: "invalid-administrator" });
  }
  if (existingAdmin && existingAdmin.fields?.adminUid?.stringValue !== administratorUid) {
    throw Object.assign(new Error("Another administrator is already configured. Nothing was changed."), { code: "administrator-mismatch" });
  }
  if (users.length > 200) throw Object.assign(new Error("Directory bootstrap exceeds the bounded initial account count."), { code: "too-many-accounts" });
  const base = `projects/${project}/databases/(default)/documents`;
  const text = value => ({ stringValue: value });
  const writes = [];
  if (!existingAdmin) writes.push({ update: { name: base + "/system/adminAccess", fields: { schemaVersion: { integerValue: "1" }, adminUid: text(administratorUid) } }, currentDocument: { exists: false } });
  else writes.push({ verify: base + "/system/adminAccess", currentDocument: { updateTime: existingAdmin.updateTime } });
  if (ownLimit?.fields?.schemaVersion?.integerValue !== "1" || ownLimit?.fields?.maxWorkspaces?.nullValue !== null) {
    writes.push({ update: { name: base + "/accountLimits/" + administratorUid, fields: { schemaVersion: { integerValue: "1" }, maxWorkspaces: { nullValue: null }, updatedBy: text(administratorUid) } },
      currentDocument: ownLimit ? { updateTime: ownLimit.updateTime } : { exists: false },
      updateTransforms: [{ fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" }] });
  }
  for (const user of users) {
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(user.localId) || typeof user.email !== "string" || !user.email || user.email.length > 320
        || (user.displayName || "").length > 200) throw Object.assign(new Error("Account metadata needs review."), { code: "invalid-profile" });
    const old = profiles.get(user.localId);
    const name = user.displayName || "";
    if (old?.fields?.schemaVersion?.integerValue === "1" && old?.fields?.uid?.stringValue === user.localId
        && old?.fields?.name?.stringValue === name && old?.fields?.email?.stringValue === user.email) continue;
    const fields = { schemaVersion: { integerValue: "1" }, uid: text(user.localId), name: text(name), email: text(user.email) };
    const transforms = [{ fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" }];
    if (old?.fields?.createdAt) fields.createdAt = old.fields.createdAt;
    else transforms.push({ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" });
    writes.push({ update: { name: base + "/accountProfiles/" + user.localId, fields }, currentDocument: old ? { updateTime: old.updateTime } : { exists: false }, updateTransforms: transforms });
  }
  return writes;
}
