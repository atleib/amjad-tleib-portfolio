import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against the static build in ./out (run `npm run build` first).
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npx serve out -l 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
