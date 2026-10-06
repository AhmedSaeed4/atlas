import test from "node:test";
import assert from "node:assert/strict";
import {
  INSPECTOR_DEFAULT_WIDTH,
  INSPECTOR_EXPANDED_KEY,
  INSPECTOR_MIN_WIDTH,
  INSPECTOR_WIDTH_KEY,
  clampInspectorWidth,
  inspectorWidthLimits,
  isNamedLinkSnapshotCurrent,
  namedLinkPayload,
  readInspectorWidth,
  readInspectorExpanded,
  readInspectorWidthPreference,
  writeInspectorExpanded,
  writeInspectorWidth,
  writeNamedLinkClipboard,
} from "../public/src/refinement-ui.js";

test("inspector width stays readable and reserves room for the graph stage", () => {
  assert.deepEqual(inspectorWidthLimits(1400), { min: 320, max: 760 });
  assert.deepEqual(inspectorWidthLimits(640), { min: 320, max: 412 });
  assert.deepEqual(inspectorWidthLimits(300), { min: 320, max: 320 });
  assert.equal(clampInspectorWidth(999, inspectorWidthLimits(640)), 412);
  assert.equal(clampInspectorWidth(200, inspectorWidthLimits(640)), INSPECTOR_MIN_WIDTH);
  assert.equal(clampInspectorWidth(NaN), INSPECTOR_DEFAULT_WIDTH);
});

test("inspector width uses a dedicated guarded browser preference", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(readInspectorWidth(storage, 1200), INSPECTOR_DEFAULT_WIDTH);
  assert.equal(writeInspectorWidth(storage, 530, 1200), true);
  assert.equal(values.get(INSPECTOR_WIDTH_KEY), "530");
  assert.equal(readInspectorWidth(storage, 1200), 530);
  assert.equal(readInspectorWidth(storage, 580), 352);
  assert.equal(readInspectorWidthPreference(storage), 530);
  assert.equal(clampInspectorWidth(readInspectorWidthPreference(storage), inspectorWidthLimits(580)), 352);
  assert.equal(clampInspectorWidth(readInspectorWidthPreference(storage), inspectorWidthLimits(1400)), 530);
  assert.equal(readInspectorWidth(() => { throw new Error("blocked"); }, 1200), INSPECTOR_DEFAULT_WIDTH);
  assert.equal(readInspectorExpanded(storage), false);
  assert.equal(writeInspectorExpanded(storage, true), true);
  assert.equal(values.get(INSPECTOR_EXPANDED_KEY), "true");
  assert.equal(readInspectorExpanded(storage), true);
  assert.equal(writeInspectorExpanded(storage, false), true);
  assert.equal(readInspectorExpanded(storage), false);
  assert.equal(readInspectorExpanded(() => { throw new Error("blocked"); }), false);
  assert.equal(writeInspectorWidth({ setItem() { throw new Error("quota"); } }, 500, 1200), false);
  assert.equal(writeInspectorExpanded({ setItem() { throw new Error("quota"); } }, true), false);
});

test("named links sanitize names and escape Markdown and rich HTML destinations", () => {
  const payload = namedLinkPayload('Tech <Flow> [edge]\n system', 'https://atlas.example/app?x="one"&y=two#map=g.safe');
  assert.equal(payload.name, "Tech <Flow> [edge] system");
  assert.equal(payload.markdown, '[Open Tech &lt;Flow&gt; \\[edge\\] system graph](<https://atlas.example/app?x=%22one%22&y=two#map=g.safe>)');
  assert.equal(payload.html, '<a href="https://atlas.example/app?x=%22one%22&amp;y=two#map=g.safe">Open Tech &lt;Flow&gt; [edge] system graph</a>');
  assert.doesNotMatch(payload.html, /<Flow>|href="[^"]*"one/);
  const hostile = namedLinkPayload('<img src="https://example.test/">', "https://atlas.example/#map=g.safe");
  assert.doesNotMatch(hostile.markdown, /<img/);
  assert.doesNotMatch(hostile.html, /<img/);
  assert.match(hostile.markdown, /&lt;img src=/);
  assert.throws(() => namedLinkPayload("Atlas", "javascript:alert(1)"), /HTTP or HTTPS/);
  assert.throws(() => namedLinkPayload("Atlas", "/relative#map=g.safe"), /HTTP or HTTPS/);
});

test("named link clipboard writes rich text when supported and Markdown otherwise", async () => {
  const payload = namedLinkPayload("Atlas", "https://atlas.example/#map=g.safe");
  let richItems = null;
  class FakeBlob { constructor(parts, options) { this.parts = parts; this.type = options.type; } }
  class FakeItem { constructor(items) { this.items = items; } }
  const richResult = await writeNamedLinkClipboard(payload, {
    clipboard: { async write(items) { richItems = items; } },
    ClipboardItemCtor: FakeItem,
    BlobCtor: FakeBlob,
    writePlain: async () => assert.fail("plain fallback should not run"),
  });
  assert.equal(richResult, "rich");
  assert.equal(richItems[0].items["text/plain"].parts[0], payload.markdown);
  assert.equal(richItems[0].items["text/html"].parts[0], payload.html);

  let plainText = "";
  const plainResult = await writeNamedLinkClipboard(payload, {
    clipboard: { async write() { throw new Error("rich blocked"); } },
    ClipboardItemCtor: FakeItem,
    BlobCtor: FakeBlob,
    writePlain: async (value) => { plainText = value; },
  });
  assert.equal(plainResult, "markdown");
  assert.equal(plainText, payload.markdown);

  let writesStarted = 0;
  assert.equal(await writeNamedLinkClipboard(payload, {
    clipboard: { async write() { writesStarted += 1; } },
    ClipboardItemCtor: FakeItem,
    BlobCtor: FakeBlob,
    isCurrent: () => false,
    writePlain: async () => { writesStarted += 1; },
  }), "stale");
  assert.equal(writesStarted, 0);

  let current = true;
  let staleFallbackCalls = 0;
  const staleResult = await writeNamedLinkClipboard(payload, {
    clipboard: { async write() { current = false; throw new Error("permission denied"); } },
    ClipboardItemCtor: FakeItem,
    BlobCtor: FakeBlob,
    isCurrent: () => current,
    writePlain: async () => { staleFallbackCalls += 1; },
  });
  assert.equal(staleResult, "stale");
  assert.equal(staleFallbackCalls, 0);

  current = true;
  let lateResolve;
  const pendingRichWrite = writeNamedLinkClipboard(payload, {
    clipboard: { write() { return new Promise((resolve) => { lateResolve = resolve; }); } },
    ClipboardItemCtor: FakeItem,
    BlobCtor: FakeBlob,
    isCurrent: () => current,
    writePlain: async () => { staleFallbackCalls += 1; },
  });
  current = false;
  lateResolve();
  assert.equal(await pendingRichWrite, "stale");
  assert.equal(staleFallbackCalls, 0);
});

test("named copy snapshots reject late results after dialog, project, URL, or name changes", () => {
  const snapshot = { dialogSequence: 4, dialogOpen: true, projectId: "project-a", projectName: "Atlas", url: "https://atlas.example/#map=g.a" };
  assert.equal(isNamedLinkSnapshotCurrent(snapshot, { ...snapshot }), true);
  for (const changes of [
    { dialogSequence: 5 },
    { dialogOpen: false },
    { projectId: "project-b" },
    { projectName: "Other" },
    { url: "https://atlas.example/#map=g.b" },
  ]) assert.equal(isNamedLinkSnapshotCurrent(snapshot, { ...snapshot, ...changes }), false);
});
