// USHTRIMI 2 — Admini hap Eventet dhe sheh eventet demo
import { test, expect } from "@playwright/test";
import { hapHyrjen } from "./helpers.js";

test("admini sheh eventet", async ({ page }) => {
  await hapHyrjen(page);
  await page.getByText("Qasje e plotë — Egzont Demiri").click();

  await page.getByRole("button", { name: "Eventet" }).first().click();

  // Katër eventet nga seedEvents
  for (const titulli of [
    "Mbledhja e Rregullt e Pikës",
    "Festa e Flamurit — 28 Nëntori",
    "Aksion Humanitar për Familjet",
    "Manifestim për Pavarësinë",
  ]) {
    await expect(page.getByText(titulli).first()).toBeVisible();
  }
  await page.screenshot({ path: "test-results/admin-eventet.png", fullPage: true });
});
