// Konfigurimi për PREZANTIM — `npm run test:demo`
// Njësoj si playwright.config.js, por:
//  - Chrome-i hapet në ekran (headed) dhe çdo veprim ngadalësohet (slowMo), që publiku ta ndjekë
//  - testet nisen një nga një (workers: 1), jo paralelisht
//  - për çdo test ruhen video, pamje ekrani dhe trace → i sheh te raporti
//  - vetëm testet demo 01–05 (testet 10/11 kërkojnë llogari reale)
// Ngadalësimin e ndryshon me variablën SLOWMO (milisekonda), p.sh. në PowerShell:
//   $env:SLOWMO=1200; npm run test:demo
import { defineConfig } from "@playwright/test";
import base from "./playwright.config.js";

export default defineConfig({
  ...base,
  testMatch: /0\d-.*\.spec\.js/,
  workers: 1,
  timeout: 120_000,
  reporter: [["list"], ["html", { open: "always", outputFolder: "playwright-report-demo" }]],
  outputDir: "test-results-demo",
  use: {
    ...base.use,
    headless: false,
    video: "on",
    screenshot: "on",
    trace: "on",
    launchOptions: { slowMo: Number(process.env.SLOWMO || 700) },
  },
});
