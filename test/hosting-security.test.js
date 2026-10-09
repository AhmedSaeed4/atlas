import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const read = (name) => readFile(new URL("../" + name, import.meta.url), "utf8");

test("hosting headers agree and limit online connections to selected services", async () => {
  const [server, headers, vercelText] = await Promise.all([read("server.js"), read("public/_headers"), read("vercel.json")]);
  const vercel = JSON.parse(vercelText);
  const policy = vercel.headers[0].headers.find((item) => item.key === "Content-Security-Policy").value;
  assert.ok(server.includes(policy));
  assert.ok(headers.includes(policy));
  const connect = policy.split(";").find((part) => part.trim().startsWith("connect-src")).trim().split(/\s+/).slice(1);
  assert.deepEqual(connect, ["'self'", "https://firestore.googleapis.com", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com", "https://atlas-ahmedsaeed4-2026.firebaseapp.com"]);
  assert.match(policy, /object-src 'none'/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.doesNotMatch(policy, /unsafe-eval|https:\/\/\*/);
});