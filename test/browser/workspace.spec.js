import { test, expect } from "@playwright/test";

const graph = (name) => ({
  schemaVersion: 1,
  project: { name, description: "Fictional browser regression fixture." },
  nodes: [
    { id: "client", label: "Web client", type: "Frontend", group: "Interface" },
    {
      id: "api",
      label: "API service",
      type: "Service",
      group: "Services",
      source: "src/api.ts",
    },
    { id: "store", label: "Data store", type: "Database", group: "Services" },
  ],
  edges: [
    { id: "calls", source: "client", target: "api", label: "calls" },
    { id: "reads", source: "api", target: "store", label: "reads" },
  ],
});
const backup = () => ({
  version: 1,
  activeId: "alpha",
  projects: ["Alpha", "Beta"].map((name) => ({
    id: name.toLowerCase(),
    graph: graph(name),
    updatedAt: 1,
  })),
});
async function seed(page) {
  await page.goto("/workspace");
  await page.getByRole("button", { name: "Backups", exact: true }).click();
  await page
    .getByRole("button", { name: "Restore backup", exact: true })
    .click();
  await page
    .getByLabel("Or paste backup JSON", { exact: true })
    .fill(JSON.stringify(backup()));
  await page
    .getByRole("button", { name: "Preview backup", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Restore 2 maps as copies", exact: true })
    .click();
  await expect(page.locator("#project-title")).toHaveText("Alpha");
  await expect(page.locator("#save-status")).toHaveText("Saved locally");
}
async function editDescription(page, text) {
  await page
    .getByRole("button", { name: "API service, Service", exact: true })
    .press("F2");
  await page
    .getByRole("dialog", { name: "Edit component", exact: true })
    .getByLabel("Description", { exact: true })
    .fill(text);
  await page
    .getByRole("button", { name: "Save component", exact: true })
    .click();
}
async function tools(page, name) {
  await page.getByRole("button", { name: "Map tools", exact: true }).click();
  await page.getByRole("button", { name, exact: true }).click();
}

async function camera(page) {
  return page.evaluate(() => {
    const { width, height } = document.querySelector("#graph-stage").getBoundingClientRect();
    const matrix = document.querySelector("#viewport").transform.baseVal.consolidate().matrix;
    return { x: matrix.e, y: matrix.f, scale: matrix.a, width, height,
      centreX: (width / 2 - matrix.e) / matrix.a, centreY: (height / 2 - matrix.f) / matrix.a };
  });
}
function sameFocus(actual, expected) {
  expect(actual.scale).toBeCloseTo(expected.scale, 5);
  expect(actual.centreX).toBeCloseTo(expected.centreX, 3);
  expect(actual.centreY).toBeCloseTo(expected.centreY, 3);
}
async function fullscreen(page) {
  await page.locator("#graph-fullscreen").click();
  await expect(page.locator("html")).not.toHaveClass(/graph-fullscreen-transition/);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function panCamera(page) {
  const rect = await page.locator("#graph-stage").boundingBox();
  const x = rect.x + 60, y = rect.y + rect.height - 100;
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x + 60, y - 35, { steps: 5 }); await page.mouse.up();
}

test("full screen shares the latest pan and zoom in both directions across resize and map switches", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await seed(page);
  const search = page.getByRole("combobox", { name: "Find a component", exact: true });
  await search.fill("API service"); await search.press("Enter"); await search.fill("");
  const normal = await camera(page);
  await fullscreen(page);
  sameFocus(await camera(page), normal);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await panCamera(page);
  const expanded = await camera(page);
  expect(expanded.scale).toBeGreaterThan(normal.scale);
  expect(expanded.centreX).not.toBeCloseTo(normal.centreX, 1);
  await fullscreen(page);
  sameFocus(await camera(page), expanded);
  await panCamera(page);
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  const linked = await camera(page);
  await fullscreen(page);
  sameFocus(await camera(page), linked);
  await page.setViewportSize({ width: 1100, height: 760 });
  await expect.poll(async () => (await camera(page)).width).not.toBe(expanded.width);
  // Wait for the resize handler, which runs on the next animation frame.
  await expect.poll(async () => (await camera(page)).centreX).toBeCloseTo(linked.centreX, 3);
  sameFocus(await camera(page), linked);
  await page.keyboard.press("Escape");
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  sameFocus(await camera(page), linked);
  await page.getByRole("button", { name: /^B Beta Software project/ }).click();
  const beta = await camera(page);
  await fullscreen(page);
  sameFocus(await camera(page), beta);
  await fullscreen(page);
  sameFocus(await camera(page), beta);
});

test("native full-screen transitions keep focus and latest Escape wins", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await seed(page);
  await page.getByRole("button", { name: "Switch to light theme", exact: true }).click();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  const normal = await camera(page);
  await fullscreen(page);
  sameFocus(await camera(page), normal);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await panCamera(page);
  const expanded = await camera(page);
  await fullscreen(page);
  sameFocus(await camera(page), expanded);
  await fullscreen(page);
  sameFocus(await camera(page), expanded);
  await page.keyboard.press("Escape");
  await expect(page.locator("#graph-fullscreen")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).not.toHaveClass(/graph-fullscreen-transition/);
  sameFocus(await camera(page), expanded);
  await page.locator("#graph-fullscreen").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveClass(/graph-fullscreen-transition/);
  await expect(page.locator("#graph-fullscreen")).toHaveAttribute("aria-pressed", "false");
  sameFocus(await camera(page), expanded);
});

test("unsupported transitions ease the camera instead of jumping or refitting", async ({ page }) => {
  await page.addInitScript(() => { document.startViewTransition = undefined; });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install({ time: new Date("2026-01-01T09:00:00Z") });
  await seed(page);
  await page.clock.pauseAt(new Date("2026-01-01T10:00:00Z"));
  const normal = await camera(page);
  await page.locator("#graph-fullscreen").click();
  const start = await camera(page);
  expect(start.x).toBe(normal.x);
  await page.clock.runFor(80);
  const intermediate = await camera(page);
  expect(intermediate.x).not.toBe(start.x);
  await page.clock.runFor(450);
  const finished = await camera(page);
  sameFocus(finished, normal);
  expect(intermediate.x).not.toBe(finished.x);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  const changed = await camera(page);
  await page.keyboard.press("Escape");
  await page.clock.runFor(450);
  sameFocus(await camera(page), changed);
});

test("backup preview is non-destructive and malformed data preserves existing maps", async ({
  page,
}) => {
  await seed(page);
  await page.getByRole("button", { name: "Backups", exact: true }).click();
  await page
    .getByRole("button", { name: "Restore backup", exact: true })
    .click();
  await page
    .getByLabel("Or paste backup JSON", { exact: true })
    .fill('{"version":1,"projects":[{"id":"bad","graph":{}}]}');
  await page
    .getByRole("button", { name: "Preview backup", exact: true })
    .click();
  await expect(page.locator("#backup-error")).toBeVisible();
  await expect(page.locator("#backup-apply")).toBeHidden();
  await page
    .getByRole("dialog", { name: "Restore a backup" })
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(page.locator("#project-list .project-row")).toHaveCount(2);
  await expect(page.locator("#project-title")).toHaveText("Alpha");
});

test("each local tab restores its own map and description edits preserve camera", async ({
  page,
  context,
}) => {
  await seed(page);
  const second = await context.newPage();
  await second.goto("/workspace");
  await second
    .getByRole("button", { name: /^B Beta Software project/ })
    .click();
  await page.reload();
  await expect(page.locator("#project-title")).toHaveText("Alpha");
  await expect(second.locator("#project-title")).toHaveText("Beta");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  const before = await page.locator("#viewport").getAttribute("transform");
  await editDescription(page, "Edited without moving the camera.");
  await expect(page.locator("#viewport")).toHaveAttribute("transform", before);
  await expect(page.locator("#save-status")).toHaveText("Saved locally");
});

test("conflicting local edits survive refresh and restore as a separate copy", async ({
  page,
  context,
}) => {
  await seed(page);
  const second = await context.newPage();
  await second.goto("/workspace");
  await second
    .getByRole("button", { name: "API service, Service", exact: true })
    .press("F2");
  await second
    .getByRole("dialog", { name: "Edit component" })
    .getByLabel("Description", { exact: true })
    .fill("Unsaved second-tab version");
  await editDescription(page, "Authoritative first-tab version");
  await second
    .getByRole("button", { name: "Save component", exact: true })
    .click();
  await expect(second.locator("#save-status")).toHaveText("Changes not saved");
  await expect(
    second.getByRole("button", { name: "Recover unsaved maps", exact: true }),
  ).toBeVisible();
  await second.reload();
  await second
    .getByRole("button", { name: "Recover unsaved maps", exact: true })
    .click();
  await expect(
    second.getByLabel("Or paste backup JSON", { exact: true }),
  ).toHaveValue(/Unsaved second-tab version/);
  await second
    .getByRole("button", { name: "Restore 1 map as a copy", exact: true })
    .click();
  await expect(second.locator("#project-title")).toHaveText("Alpha (restored)");
  await expect(page.locator("#project-title")).toHaveText("Alpha");
  await expect(second.locator("#project-list .project-row")).toHaveCount(3);
});

test("search reuses mounted cards, keyboard focus reveals groups, and Timeline filters in place", async ({
  page,
}) => {
  await seed(page);
  await page.evaluate(() => {
    window.atlasTestCard = document.querySelector(
      '[data-node-id="api"].node-card',
    );
  });
  const search = page.getByRole("combobox", {
    name: "Find a component",
    exact: true,
  });
  await search.fill("src/api");
  await expect(page.getByRole("option")).toHaveCount(1);
  expect(
    await page.evaluate(
      () =>
        window.atlasTestCard ===
        document.querySelector('[data-node-id="api"].node-card'),
    ),
  ).toBe(true);
  await search.press("Enter");
  await expect(page.locator("#inspector-content .detail-title")).toHaveText(
    "API service",
  );
  await search.fill("");
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Show connections", exact: true })
    .selectOption("upstream");
  await expect(
    page.locator('[data-node-id="client"].node-card'),
  ).not.toHaveClass(/dimmed/);
  await expect(page.locator('[data-node-id="store"].node-card')).toHaveClass(
    /dimmed/,
  );
  await page
    .getByRole("button", { name: "Collapse Services · 2", exact: true })
    .click();
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(2);
  await page.keyboard.press("Escape");
  await search.fill("API");
  await search.press("Enter");
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(3);
  await search.fill("");
  await page.getByRole("button", { name: "Timeline", exact: true }).click();
  await page.evaluate(() => {
    window.atlasTestTimeline = document.querySelector(".timeline-node-card");
  });
  await search.fill("API");
  await expect(page.locator(".timeline-node-card:not([hidden])")).toHaveCount(
    1,
  );
  expect(
    await page.evaluate(
      () =>
        window.atlasTestTimeline ===
        document.querySelector(".timeline-node-card"),
    ),
  ).toBe(true);
});

test("dragging retains the mounted card and updates its geometry", async ({
  page,
}) => {
  await seed(page);
  const card = page.locator('[data-node-id="api"].node-card');
  const before = await card.getAttribute("transform");
  await page.evaluate(() => {
    window.atlasTestDragged = document.querySelector(
      '[data-node-id="api"].node-card',
    );
  });
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 35,
    box.y + box.height / 2 + 30,
    { steps: 6 },
  );
  await page.mouse.up();
  await expect(card).not.toHaveAttribute("transform", before);
  expect(
    await page.evaluate(
      () =>
        window.atlasTestDragged ===
        document.querySelector('[data-node-id="api"].node-card'),
    ),
  ).toBe(true);
  await expect(page.locator("#save-status")).toHaveText("Saved locally");
});

test("updates are reviewed, checkpoints survive refresh, and restoration can be undone", async ({
  page,
}) => {
  await seed(page);
  await tools(page, "Checkpoints…");
  await page
    .getByLabel("Checkpoint name", { exact: true })
    .fill("Before update");
  await page
    .getByRole("button", { name: "Save checkpoint", exact: true })
    .click();
  await expect(page.locator("#checkpoint-list")).toContainText("Before update");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await tools(page, "Update current map…");
  const next = graph("Alpha");
  next.nodes.push({ id: "worker", label: "Worker", type: "Job" });
  next.edges.push({
    id: "dispatch",
    source: "api",
    target: "worker",
    label: "dispatches",
  });
  await page
    .getByLabel("Or paste updated map JSON", { exact: true })
    .fill(JSON.stringify(next));
  await expect(page.locator("#map-update-preview")).toContainText(
    "Added components · 1",
  );
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Apply update", exact: true }).click();
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(4);
  await page.reload();
  await tools(page, "Checkpoints…");
  await page.locator(".checkpoint-item").click({ position: { x: 20, y: 20 } });
  await expect(page.getByRole("button", { name: "Review", exact: true })).toBeVisible();
  await expect(page.locator("#checkpoint-preview details").first()).toHaveAttribute("open", "");
  await page
    .getByRole("button", { name: "Restore checkpoint", exact: true })
    .click();
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(4);
});

test("updates auto-preview files and checkpoint row review leaves secondary actions independent", async ({ page }) => {
  await seed(page);
  await tools(page, "Update current map\u2026");
  const input = page.getByLabel("Or paste updated map JSON", { exact: true });
  const apply = page.getByRole("button", { name: "Apply update", exact: true });
  await input.fill(JSON.stringify(graph("Changed name")));
  await expect(apply).toBeEnabled();
  await input.fill("{unfinished");
  await expect(apply).toBeDisabled();
  await expect(page.locator("#map-update-error")).toBeVisible();
  await input.fill("");
  await expect(page.locator("#map-update-error")).toBeHidden();
  await page.getByLabel("Choose updated map JSON", { exact: true }).setInputFiles({
    name: "updated.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(graph("File version"))),
  });
  await expect(apply).toBeEnabled();
  await expect(page.locator("#map-update-preview")).toContainText("File version");
  await expect(page.locator("#project-title")).toHaveText("Alpha");
  await page.locator("#map-update-cancel").click();
  await tools(page, "Checkpoints\u2026");
  for (const name of ["Snapshot A", "Snapshot B"]) {
    await page.getByLabel("Checkpoint name", { exact: true }).fill(name);
    await page.getByRole("button", { name: "Save checkpoint", exact: true }).click();
    await expect(page.getByRole("button", { name: "Review checkpoint " + name, exact: true })).toBeVisible();
  }
  const checkpoint = name => page.locator(".checkpoint-item").filter({
    has: page.getByRole("button", { name: "Review checkpoint " + name, exact: true }),
  });
  const selection = name => checkpoint(name).locator(".checkpoint-select");
  await selection("Snapshot A").focus(); await page.keyboard.press("Enter");
  await expect(selection("Snapshot A")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Restore checkpoint", exact: true })).toBeVisible();
  await Promise.all([
    page.waitForEvent("download"), checkpoint("Snapshot B").getByRole("button", { name: "Download", exact: true }).click(),
  ]);
  await expect(selection("Snapshot A")).toHaveAttribute("aria-pressed", "true");
  await expect(selection("Snapshot B")).toHaveAttribute("aria-pressed", "false");
  await checkpoint("Snapshot B").getByRole("button", { name: "Rename", exact: true }).click();
  await page.getByRole("textbox", { name: "New name for Snapshot B", exact: true }).fill("Renamed snapshot");
  await checkpoint("Snapshot B").getByRole("button", { name: "Save name", exact: true }).click();
  await expect(selection("Renamed snapshot")).toBeVisible();
  await expect(selection("Snapshot A")).toHaveAttribute("aria-pressed", "true");
  await checkpoint("Renamed snapshot").getByRole("button", { name: "Remove", exact: true }).click();
  await expect(checkpoint("Renamed snapshot").getByRole("button", { name: "Confirm removal", exact: true })).toBeVisible();
  await expect(selection("Snapshot A")).toHaveAttribute("aria-pressed", "true");
  await checkpoint("Renamed snapshot").click({ position: { x: 20, y: 20 } });
  await expect(selection("Renamed snapshot")).toHaveAttribute("aria-pressed", "true");
  await checkpoint("Snapshot A").getByRole("button", { name: "Review", exact: true }).click();
  await expect(selection("Snapshot A")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(3);
  await expect(page.locator(".checkpoint-item")).toHaveCount(2);
});

test("compact details overlay preserves map size and full screen exits with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 600 });
  await seed(page);
  await expect(page.locator("#inspector")).toBeHidden();
  const before = await page.locator("#graph-stage").boundingBox();
  expect(before.width).toBeGreaterThan(700);
  await page
    .getByRole("button", { name: "API service, Service", exact: true })
    .press("Enter");
  await expect(page.locator("#inspector")).toBeVisible();
  const after = await page.locator("#graph-stage").boundingBox();
  expect(after.width).toBe(before.width);
  await page.screenshot({
    path: test.info().outputPath("compact-inspector.png"),
  });
  await page
    .getByRole("button", { name: "Enter full screen graph", exact: true })
    .click();
  await expect(page.locator("#graph-fullscreen")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#graph-fullscreen")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("phone controls and named dialogs remain usable in both themes", async ({
  page,
}) => {
  await seed(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const theme of ["light", "dark"]) {
    const themeButton = page.getByRole("button", {
      name: "Switch to " + theme + " theme",
      exact: true,
    });
    if (await themeButton.count()) await themeButton.click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const search = page.getByRole("combobox", {
      name: "Find a component",
      exact: true,
    });
    await search.fill("src/api");
    await expect(page.getByRole("option")).toHaveCount(1);
    await search.press("Enter");
    await expect(page.locator("#inspector")).toBeVisible();
    await page
      .getByRole("button", { name: "API service, Service", exact: true })
      .press("F2");
    const dialog = page.getByRole("dialog", {
      name: "Edit component",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await search.fill("");
    await search.press("Escape");
    await page
      .getByRole("button", { name: "Close component details", exact: true })
      .click();
  }
  await page.screenshot({ path: test.info().outputPath("phone-dark.png") });
  expect(errors).toEqual([]);
});

test("finder camera moves through intermediate frames and a user zoom interrupts it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install({ time: new Date("2026-01-01T09:00:00Z") });
  await seed(page);
  await page.clock.pauseAt(new Date("2026-01-01T10:00:00Z"));
  const viewport = page.locator("#viewport");
  const search = page.getByRole("combobox", {
    name: "Find a component",
    exact: true,
  });
  const before = await viewport.getAttribute("transform");
  await search.fill("Data store");
  await search.press("Enter");
  expect(await viewport.getAttribute("transform")).toBe(before);
  await page.clock.runFor(80);
  const intermediate = await viewport.getAttribute("transform");
  expect(intermediate).not.toBe(before);
  await page.clock.runFor(500);
  const finished = await viewport.getAttribute("transform");
  expect(finished).not.toBe(intermediate);
  await page.clock.runFor(500);
  expect(await viewport.getAttribute("transform")).toBe(finished);

  await search.fill("Web client");
  await search.press("Enter");
  await page.clock.runFor(60);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  const interrupted = await viewport.getAttribute("transform");
  await page.clock.runFor(700);
  expect(await viewport.getAttribute("transform")).toBe(interrupted);

  await search.fill("API service");
  await search.press("Enter");
  await page.clock.runFor(60);
  await search.fill("Data store");
  await search.press("Enter");
  await page.clock.runFor(500);
  const latest = await viewport.getAttribute("transform");
  await expect(page.locator("#inspector-content .detail-title")).toHaveText(
    "Data store",
  );
  await page.clock.runFor(500);
  expect(await viewport.getAttribute("transform")).toBe(latest);
  await page.screenshot({ path: test.info().outputPath("finder-focus.png") });
});

test("finder camera respects reduced motion and cancels hidden-map movement", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-01-01T09:00:00Z") });
  await seed(page);
  await page.clock.pauseAt(new Date("2026-01-01T10:00:00Z"));
  const viewport = page.locator("#viewport");
  const search = page.getByRole("combobox", {
    name: "Find a component",
    exact: true,
  });
  const before = await viewport.getAttribute("transform");
  await search.fill("API service");
  await search.press("Enter");
  const instant = await viewport.getAttribute("transform");
  expect(instant).not.toBe(before);
  await page.clock.runFor(500);
  expect(await viewport.getAttribute("transform")).toBe(instant);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await search.fill("Data store");
  await search.press("Enter");
  await page.clock.runFor(60);
  await page.getByRole("button", { name: "Timeline", exact: true }).click();
  const hidden = await viewport.getAttribute("transform");
  await page.clock.runFor(700);
  expect(await viewport.getAttribute("transform")).toBe(hidden);
});

test("workspace dialogs dismiss on outside click without saving or treating a drag as dismissal", async ({
  page,
}) => {
  await seed(page);
  const outside = () => page.mouse.click(8, 8);
  await page.getByRole("button", { name: "Quick guide", exact: true }).click();
  await expect(page.locator("#quick-guide")).toBeVisible();
  await page.locator("#quick-guide").click({ position: { x: 12, y: 12 } });
  await expect(page.locator("#quick-guide")).toBeVisible();
  await outside();
  await expect(page.locator("#quick-guide")).toBeHidden();

  await page
    .getByRole("button", { name: "API service, Service", exact: true })
    .press("F2");
  const editor = page.getByRole("dialog", {
    name: "Edit component",
    exact: true,
  });
  const input = editor.getByLabel("Description", { exact: true });
  await input.fill("This canceled text must not be saved");
  const box = await input.boundingBox();
  await page.mouse.move(box.x + 20, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(8, 8);
  await page.mouse.up();
  await expect(editor).toBeVisible();
  await outside();
  await expect(editor).toBeHidden();
  await page
    .getByRole("button", { name: "API service, Service", exact: true })
    .press("F2");
  await expect(input).toHaveValue("");
  await outside();

  for (const [button, selector] of [
    ["Edit project", "#project-modal"],
    ["Add node", "#editor-modal"],
    ["Add connection", "#edge-modal"],
    ["Import architecture Ctrl+I", "#import-modal"],
    ["Share", "#share-modal"],
    ["Settings", "#settings-modal"],
    ["Clear local data", "#confirm-modal"],
  ]) {
    await page.getByRole("button", { name: button, exact: true }).click();
    await expect(page.locator(selector)).toBeVisible();
    await outside();
    await expect(page.locator(selector)).toBeHidden();
  }
  for (const [name, selector] of [
    ["Update current map…", "#map-update-dialog"],
    ["Checkpoints…", "#checkpoint-dialog"],
  ]) {
    await tools(page, name);
    await expect(page.locator(selector)).toBeVisible();
    await outside();
    await expect(page.locator(selector)).toBeHidden();
  }
  await page.getByRole("button", { name: "Backups", exact: true }).click();
  await page
    .getByRole("button", { name: "Restore backup", exact: true })
    .click();
  await expect(page.locator("#backup-dialog")).toBeVisible();
  await outside();
  await expect(page.locator("#backup-dialog")).toBeHidden();
  await expect(page.locator("#project-list .project-row")).toHaveCount(2);
  await expect(page.locator("#save-status")).toHaveText("Saved locally");
});

test("Backups is one sidebar entry with a keyboard-accessible local menu on desktop and phone", async ({
  page,
}) => {
  await seed(page);
  const toggle = page.getByRole("button", { name: "Backups", exact: true });
  const menu = page.locator("#local-backups-panel");
  await expect(
    page.getByRole("button", { name: "Back up maps", exact: true }),
  ).toBeHidden();
  await toggle.press("Enter");
  await expect(menu).toBeVisible();
  await expect(menu).toContainText("Cloud workspaces are separate");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Back up maps", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.screenshot({
    path: test.info().outputPath("backups-menu-dark.png"),
  });
  await page.mouse.click(8, 8);
  await expect(menu).toBeHidden();

  await page
    .getByRole("button", { name: "Switch to light theme", exact: true })
    .click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Open projects", exact: true })
    .click();
  await toggle.click();
  await expect(menu).toBeVisible();
  const bounds = await menu.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Back up maps", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Restore backup", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Close projects", exact: true }),
  ).toBeVisible();
  await toggle.click();
  await page.screenshot({
    path: test.info().outputPath("backups-menu-phone-light.png"),
  });
  await page
    .getByRole("button", { name: "Restore backup", exact: true })
    .click();
  await expect(menu).toBeHidden();
  await expect(
    page.getByRole("dialog", { name: "Restore a backup", exact: true }),
  ).toBeVisible();
  await page.mouse.click(8, 8);
  await expect(page.locator("#backup-dialog")).toBeHidden();
});
