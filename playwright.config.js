// Konfigurimi i Playwright — https://playwright.dev/docs/test-configuration
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    channel: "chrome",          // përdor Chrome-in e instaluar (pa shkarkuar shfletues)
    viewport: { width: 1280, height: 900 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure", // hape me: npx playwright show-trace <file>
  },
  // Nis vetë `npm run dev` nëse serveri nuk po punon tashmë
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});
