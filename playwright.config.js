import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test/browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 30_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4199",
    browserName: "chromium",
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node server.js",
    url: "http://127.0.0.1:4199/workspace",
    env: { HOST: "127.0.0.1", PORT: "4199" },
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
