import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/workspace.html", import.meta.url), "utf8");

test("SVG card entrance preserves each card position", () => {
  const keyframes = [...css.matchAll(/@keyframes\s+atlas-card-in\s*\{([^}]*(?:\}[^}]*)?)\}/g)];
  assert.ok(keyframes.length > 0);
  for (const frame of keyframes) assert.doesNotMatch(frame[1], /transform\s*:/);
});

test("graph SVG exposes interactive descendants as an accessible group", () => {
  assert.match(html, /<svg id="graph"[^>]*role="group"[^>]*aria-label="Interactive software architecture graph"/);
});

test("workspace documents local backups, separate shared snapshots, and the landing link", () => {
  assert.match(html, /href="\.\/" aria-label="Atlas home"/);
  assert.match(html, /Export &gt; Download JSON for a backup/);
  assert.match(html, /Import architecture to restore it elsewhere/);
  assert.match(html, /Clearing this browser's site data removes saved projects/);
  assert.match(html, /snapshot anyone with the link can read/);
  assert.match(html, /separate copy, with no account, live collaboration, or upload/);
  assert.match(html, /A localhost link works only on this computer/);
});