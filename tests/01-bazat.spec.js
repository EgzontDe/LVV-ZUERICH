// MËSIMI 1 — Bazat: hap faqen, gjej elemente, kontrollo (expect)
import { test, expect } from "@playwright/test";

test("faqja publike hapet", async ({ page }) => {
  await page.goto("/");                                   // baseURL + "/"
  await expect(page).toHaveTitle(/.+/);                   // faqja ka titull
  await expect(page.getByText("Pika Winterthur").first()).toBeVisible();
});

test("butoni 'Hyr' çon te faqja e hyrjes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Hyr/ }).first().click();
  await expect(page.getByText("Hyni në platformë")).toBeVisible();
});
