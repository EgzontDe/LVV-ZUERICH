// USHTRIMI 3 — Ndërrimi i gjuhës Shqip → Deutsch në faqen e hyrjes
import { test, expect } from "@playwright/test";
import { hapHyrjen } from "./helpers.js";

test("faqja e hyrjes kalon në gjermanisht", async ({ page }) => {
  await hapHyrjen(page);
  await expect(page.getByText("Hyni në platformë")).toBeVisible();

  await page.getByRole("button", { name: /Shqip/ }).click();

  await expect(page.getByText("Plattform-Login")).toBeVisible();
  await expect(page.getByRole("button", { name: /Deutsch/ })).toBeVisible();
  await expect(page.getByText("Als Blerim Gashi einloggen (Demo)")).toBeVisible();
});
