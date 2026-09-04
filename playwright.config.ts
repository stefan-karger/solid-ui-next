import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: "pnpm --filter docs preview --host 127.0.0.1",
    env: {
      ASTRO_PREVIEW_BACKGROUND: "0",
    },
    url: "http://127.0.0.1:4321",
    reuseExistingServer: true,
  },
});
