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

test("backup preview is non-destructive and malformed data preserves existing maps", async ({
  page,
}) => {
  await seed(page);
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
  await page
    .getByRole("button", { name: "Preview changes", exact: true })
    .click();
  await expect(page.locator("#map-update-preview")).toContainText(
    "Added components · 1",
  );
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Apply update", exact: true }).click();
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(4);
  await page.reload();
  await tools(page, "Checkpoints…");
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page
    .getByRole("button", { name: "Restore checkpoint", exact: true })
    .click();
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator("#nodes-layer .node-card")).toHaveCount(4);
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
