// USHTRIMI 1 — Anëtari hap Faturat dhe sheh kuotën CHF 150
import { test, expect } from "@playwright/test";
import { hapHyrjen, kaloMagjistarin } from "./helpers.js";


test("Blerimi sheh faturat dhe kuotën CHF 150", async ({ page }) => {
  // HAPI 1 — Hap aplikacionin dhe pastro të dhënat demo nga herët e kaluara
  await hapHyrjen(page);

  // HAPI 2 — Hyr si anëtar demo
  await page.getByText("Hyni si Blerim Gashi (demo)").click();

  // HAPI 2b — Anëtari sheh fillimisht magjistarin e mirëseardhjes (4 hapa): kaloje
  await kaloMagjistarin(page);

  // HAPI 3 — Kliko "Faturat" në menu
  await page.getByRole("button", { name: "Faturat" }).first().click();

  // HAPI 4 — Kontrollo atë që duhet të shohë anëtari
  // a) titulli i faqes
  await expect(page.getByRole("heading", { name: "Faturat" })).toBeVisible();

  // b) kuota vjetore — kartela e parë me "CHF 150"
  await expect(page.getByText("CHF 150").first()).toBeVisible();

  // c) tabela ka 3 fatura (rreshtat me klasën .vv-row brenda tabelës)
  const rreshtat = page.locator("tbody tr.vv-row");
  await expect(rreshtat).toHaveCount(3);

  // d) fatura 2026 është e papaguar, prandaj ka butonin "Paguaj"
  const fatura2026 = rreshtat.filter({ hasText: "F-2026-005" });
  await expect(fatura2026.getByRole("button", { name: "Paguaj" })).toBeVisible();

  // e) fatura 2025 është paguar, prandaj s'ka buton "Paguaj"
  const fatura2025 = rreshtat.filter({ hasText: "F-2025-005" });
  await expect(fatura2025.getByRole("button", { name: "Paguaj" })).toHaveCount(0);

  // HAPI 5 — Ruaj një foto të faqes (gjendet te test-results/)
  await page.screenshot({ path: "test-results/faturat.png", fullPage: true });
});
