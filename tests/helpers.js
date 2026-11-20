// Funksione ndihmëse që i përdorin shumë teste
import { expect } from "@playwright/test";

// Hap aplikacionin me localStorage të pastër dhe shko te faqja e hyrjes
export async function hapHyrjen(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: /^Hyr/ }).first().click();
}

// Kalon 4 hapat e magjistarit të mirëseardhjes së anëtarit
export async function kaloMagjistarin(page) {
  await expect(page.getByText("Hapi 1 nga 4")).toBeVisible();
  await page.getByRole("button", { name: "Fillo" }).click();
  await page.getByRole("button", { name: "Konfirmo" }).click();
  await page.getByRole("button", { name: "E kuptova" }).click();
  await page.getByRole("button", { name: "Hyr në platformë" }).click();
}
