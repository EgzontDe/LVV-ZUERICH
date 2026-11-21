// ANËTARI REAL — pa të dhëna demo kur hyn me llogari të vërtetë.
// Kërkon QA_PASSWORD (shih tests/10-rolet.spec.js).
import { test, expect } from "@playwright/test";

const PASSWORD = process.env.QA_PASSWORD;
test.skip(!PASSWORD, "QA_PASSWORD nuk është vendosur");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: /^Hyr/ }).first().click();
  await page.locator("#vv-login-email").fill("qa-anetar@vv-test.ch");
  await page.locator("#vv-login-pw").fill(PASSWORD);
  await page.getByRole("button", { name: "Hyr", exact: true }).click();
  await expect(page.getByText("Hapi 1 nga 4")).toBeVisible({ timeout: 10000 });
  for (const n of ["Fillo", "Konfirmo", "E kuptova", "Hyr në platformë"]) await page.getByRole("button", { name: n }).click();
});

test("chat-i demo dhe njoftimet fiktive nuk shfaqen", async ({ page }) => {
  await expect(page.locator("aside").getByRole("button", { name: "Faturat" })).toBeVisible();
  await expect(page.locator(".vv-chat-btn")).toHaveCount(0);
  // Zilja: hap panelin dhe kontrollo që s'ka njoftimin demo me IBAN
  await page.locator("header .vv-btn.ghost").filter({ has: page.locator("svg.lucide-bell") }).click();
  await expect(page.getByText(/IBAN/)).toHaveCount(0);
});

test("Njoftimet: pa 'Lajmet nga QQ'; Dokumentet vijnë nga databaza", async ({ page }) => {
  await page.locator("aside").getByRole("button", { name: "Njoftimet" }).click();
  await expect(page.getByRole("button", { name: "Lajmet nga QQ" })).toHaveCount(0);
  await page.getByRole("button", { name: "Dokumentet", exact: true }).click();
  await expect(page.getByText("Procesverbalet dhe dokumentet")).toBeVisible();
});

test("Procesverbale: vetëm dokumentet e ngarkuara, jo shembujt demo", async ({ page }) => {
  await page.locator("aside").getByRole("button", { name: "Procesverbale" }).click();
  await expect(page.getByText("Procesverbalet dhe dokumentet")).toBeVisible();
  await expect(page.getByText("Vendimet dhe raportet e mbledhjeve të pikës")).toHaveCount(0);
});

test("Detyrat e mia: hapet dhe tregon vetëm detyrat e anëtarit", async ({ page }) => {
  await page.locator("aside").getByRole("button", { name: "Detyrat e mia" }).click();
  await expect(page.getByRole("heading", { name: "Detyrat e mia" })).toBeVisible();
  // Demo tasks of other people must never show up here
  await expect(page.getByText("Përgatit axhendën e mbledhjes")).toHaveCount(0);
});
