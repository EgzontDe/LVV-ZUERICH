// MËSIMI 2 — Hyrja demo si anëtar dhe si administrator
import { test, expect } from "@playwright/test";
import { hapHyrjen, kaloMagjistarin } from "./helpers.js";

// beforeEach ekzekutohet para çdo testi në këtë skedar
test.beforeEach(async ({ page }) => {
  await hapHyrjen(page);
});

test("anëtari demo (Blerim Gashi) hyn", async ({ page }) => {
  await page.getByText("Hyni si Blerim Gashi (demo)").click();
  await kaloMagjistarin(page);
  // Menuja e anëtarit shfaqet vetëm pas magjistarit, te paneli i vërtetë
  await expect(page.getByRole("button", { name: "Faturat" }).first()).toBeVisible();
  await expect(page.getByText("Hapi 1 nga 4")).toHaveCount(0);
  await page.screenshot({ path: "test-results/anetari.png", fullPage: true });
});

test("administratori demo hap listën e anëtarëve", async ({ page }) => {
  await page.getByText("Qasje e plotë — Egzont Demiri").click();
  await page.getByRole("button", { name: "Anëtarët" }).first().click();
  await expect(page.getByText("Blerim Gashi").first()).toBeVisible();
});
