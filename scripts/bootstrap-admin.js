// Operator-only utility. Never imported by the website; never exports passwords or tokens.
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bootstrapWrites, privateRequestOptions } from "./admin-bootstrap-model.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const value = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : ""; };
const project = value("--project"), email = value("--email"), confirmedUid = value("--uid");
const apply = args.includes("--apply");
if (args.includes("--help")) {
  console.log(`node scripts/bootstrap-admin.js --project PROJECT --email ADMIN_EMAIL [--apply --uid VERIFIED_FIREBASE_UID]
Without --apply, only verifies metadata and shows the proposed setup. Apply also requires the tested rules to be already published.`);
} else if (!/^[a-z][a-z0-9-]{4,62}$/.test(project || "") || !email || (apply && !confirmedUid)) {
  console.error("Provide --project and --email; --apply additionally requires --uid from the read-only preview."); process.exitCode = 1;
} else {
  let phase = "authenticate";
  try {
    const library = process.env.ATLAS_FIREBASE_CLI_LIB;
    const cli = module => require(library ? resolve(library, module + ".js") : "firebase-tools/lib/" + module + ".js");
    const { Client } = cli("apiv2"), auth = cli("auth"), { requireAuth } = cli("requireAuth");
    const options = { project, nonInteractive: true };
    auth.setActiveAccount(options, auth.getGlobalDefaultAccount());
    await requireAuth(options);
    // The CLI mutates each options object, so every request needs its own instance.
    const authClient = new Client({ urlPrefix: "https://identitytoolkit.googleapis.com", apiVersion: "v1" });
    const firestore = new Client({ urlPrefix: "https://firestore.googleapis.com", apiVersion: "v1" });
    const base = `projects/${project}/databases/(default)/documents`;
    phase = "verify-free-project";
    const billing = await new Client({ urlPrefix: "https://cloudbilling.googleapis.com", apiVersion: "v1" }).get(`/projects/${project}/billingInfo`, privateRequestOptions());
    if (billing.body.billingEnabled) throw Object.assign(new Error(), { code: "billing-enabled" });
    phase = "verify-auth-account";
    const users = [];
    for (let offset = 0; ; offset += 200) {
      const response = await authClient.post(`/projects/${project}/accounts:query`, { offset: String(offset), limit: "200" }, { ...privateRequestOptions(), queryParams: { fields: "userInfo(localId,displayName,email,emailVerified,disabled)" } });
      const page = response.body.userInfo || []; users.push(...page);
      if (page.length < 200) break;
      if (users.length > 200) throw Object.assign(new Error(), { code: "too-many-accounts" });
    }
    const matches = users.filter(user => user.email?.toLowerCase() === email.toLowerCase());
    if (matches.length !== 1 || matches[0].emailVerified !== true || matches[0].disabled === true) throw Object.assign(new Error(), { code: "administrator-not-verified" });
    const administrator = matches[0];
    if (apply && confirmedUid !== administrator.localId) throw Object.assign(new Error(), { code: "uid-mismatch" });
    phase = "read-current-setup";
    const read = async path => {
      try { return (await firestore.get("/" + base + "/" + path, privateRequestOptions())).body; }
      catch (error) { if (error.status === 404) return null; throw error; }
    };
    const [existingAdmin, ownLimit] = await Promise.all([read("system/adminAccess"), read("accountLimits/" + administrator.localId)]);
    const profiles = new Map(await Promise.all(users.map(async user => [user.localId, await read("accountProfiles/" + user.localId)])));
    const writes = bootstrapWrites({ project, users, administratorUid: administrator.localId, existingAdmin, profiles, ownLimit });
    console.log(JSON.stringify({ project, mode: apply ? "apply" : "read-only preview", accountCount: users.length,
      administrator: { uid: administrator.localId, name: administrator.displayName || "", email: administrator.email },
      administratorConfigured: Boolean(existingAdmin), proposedWrites: writes.filter(write => !write.verify).length, allowance: "unlimited" }));
    if (apply) {
      phase = "verify-published-rules";
      const rules = new Client({ urlPrefix: "https://firebaserules.googleapis.com", apiVersion: "v1" });
      const release = await rules.get(`/projects/${project}/releases/cloud.firestore`, privateRequestOptions());
      const active = await rules.get("/" + release.body.rulesetName, privateRequestOptions());
      const expected = (await readFile(resolve(root, "firestore.rules"), "utf8")).replaceAll("\r\n", "\n").trim();
      if (!(active.body.source?.files || []).some(file => file.content.replaceAll("\r\n", "\n").trim() === expected)) throw Object.assign(new Error(), { code: "published-rules-mismatch" });
      phase = "apply-atomic-setup";
      await firestore.post("/" + base + ":commit", { writes }, privateRequestOptions());
      phase = "confirm-setup";
      const [config, allowance] = await Promise.all([read("system/adminAccess"), read("accountLimits/" + administrator.localId)]);
      if (config?.fields?.adminUid?.stringValue !== administrator.localId || allowance?.fields?.maxWorkspaces?.nullValue !== null) throw Object.assign(new Error(), { code: "setup-unconfirmed" });
      console.log("Administrator and unlimited allowance confirmed. Existing workspace documents were untouched.");
    }
  } catch (error) {
    // Do not log error objects, HTTP bodies, headers, credentials or cached accounts.
    console.error(`Admin setup stopped at ${phase}: ${error.code || error.status || "request-failed"}`);
    process.exitCode = 1;
  }
}
