import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { canonicalWorkspaceUrl, workspaceBaseUrl } from "../public/src/routing.js";

test("legacy workspace links keep exact view queries and compressed/raw fragments", () => {
  for (const tail of ["?view=T_oOkPc9Y6EMOXXq0HJErQ", "?next=a%2Fb#map=g.ABC_123", "#map=r.raw-payload"]) {
    assert.equal(canonicalWorkspaceUrl("https://atlas.test/workspace.html" + tail), "https://atlas.test/workspace" + tail);
  }
  assert.equal(canonicalWorkspaceUrl("https://atlas.test/workspace/?view=old"), "https://atlas.test/workspace?view=old");
  assert.equal(canonicalWorkspaceUrl("https://atlas.test/index.html#map=g.old"), "https://atlas.test/index.html#map=g.old");
});
test("new links target clean workspace paths and retain the hosting subdirectory", () => {
  for (const entry of ["index.html?campaign=a#map=g.old", "workspace.html?view=old", "workspace?view=old", "workspace/?view=old", ""]) {
    assert.equal(workspaceBaseUrl("https://atlas.test/subfolder/" + entry), "https://atlas.test/subfolder/workspace");
  }
});
test("HTTP clean and legacy routes serve the same app, queries survive redirects, assets resolve normally", async t => {
  const child = spawn(process.execPath, ["server.js"], { cwd: new URL("../", import.meta.url), env: { ...process.env, PORT: "0" }, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  t.after(async () => { if (child.exitCode === null) { const closed = once(child, "exit"); child.kill(); await closed; } });
  const base = await new Promise((resolve,reject) => {
    const timeout = setTimeout(() => reject(Error("Route test server did not start")), 8000);
    let output = "";
    child.on("error", error => { clearTimeout(timeout); reject(error); });
    child.stdout.on("data", data => { output += data; const match = output.match(/http:\/\/127\.0\.0\.1:\d+/); if (match) { clearTimeout(timeout); resolve(match[0]); } });
  });
  const clean = await fetch(base + "/workspace?view=abc");
  const legacy = await fetch(base + "/workspace.html?view=abc");
  assert.equal(clean.status, 200); assert.equal(legacy.status, 200);
  assert.match(clean.headers.get("content-type"), /text\/html/);
  assert.equal(await clean.text(), await legacy.text());
  const redirected = await fetch(base + "/workspace/?view=a%2Fb", { redirect: "manual" });
  assert.equal(redirected.status, 308); assert.equal(redirected.headers.get("location"), "/workspace?view=a%2Fb");
  assert.equal((await fetch(base + "/src/routing.js")).status, 200);
  const head = await fetch(base + "/workspace", { method: "HEAD" });
  assert.equal(head.status, 200); assert.equal(await head.text(), "");
  assert.equal((await fetch(base + "/workspace", { method: "POST" })).status, 405);
  assert.equal((await fetch(base + "/nonexistent-route")).status, 404);
});
