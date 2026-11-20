// ROLET — testet me Supabase të vërtetë (jo demo).
// Kërkon llogaritë e provës qa-*@vv-test.ch dhe fjalëkalimin në variablën QA_PASSWORD:
//   PowerShell:  $env:QA_PASSWORD="..."; npx playwright test tests/10-rolet.spec.js
// Pa QA_PASSWORD këto teste anashkalohen.
import { test, expect } from "@playwright/test";
import fs from "fs";

const PASSWORD = process.env.QA_PASSWORD;
test.skip(!PASSWORD, "QA_PASSWORD nuk është vendosur");

// URL dhe çelësi publik nga .env.local (i njëjti që përdor aplikacioni)
const env = Object.fromEntries(
  (fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "")
    .split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const SB_URL = env.VITE_SUPABASE_URL;
const SB_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

const ROLES = {
  financa:    { email: "qa-financa@vv-test.ch",    label: "Financat",   sees: ["Pagesat", "Financat", "Donacionet", "Kujtesat"], hidden: ["Anëtarët", "Check-in", "Komunikimi", "Cilësimet"] },
  eventet:    { email: "qa-eventet@vv-test.ch",    label: "Eventet",    sees: ["Eventet", "Kalendari", "Check-in"],               hidden: ["Pagesat", "Anëtarët", "Komunikimi", "Cilësimet"] },
  komunikimi: { email: "qa-komunikimi@vv-test.ch", label: "Komunikimi", sees: ["Komunikimi", "Sondazhet", "Kërkesat"],            hidden: ["Pagesat", "Anëtarët", "Check-in", "Cilësimet"] },
  sekretar:   { email: "qa-sekretar@vv-test.ch",   label: "Sekretar",   sees: ["Anëtarët", "Onboarding", "Kërkesat", "Procesverbalet"], hidden: ["Pagesat", "Financat", "Check-in", "Cilësimet"] },
};

async function hyrReale(page, email) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: /^Hyr/ }).first().click();
  await page.locator("#vv-login-email").fill(email);
  await page.locator("#vv-login-pw").fill(PASSWORD);
  await page.getByRole("button", { name: "Hyr", exact: true }).click();
}

// Merr një token hyrjeje direkt nga Supabase (pa shfletues)
async function token(request, email) {
  const r = await request.post(`${SB_URL}/auth/v1/token?grant_type=password`, {
    headers: { apikey: SB_KEY }, data: { email, password: PASSWORD },
  });
  expect(r.ok()).toBeTruthy();
  return (await r.json()).access_token;
}
const rpc = (request, jwt, fn, data = {}) =>
  request.post(`${SB_URL}/rest/v1/rpc/${fn}`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${jwt}` }, data });

// ── 1. Menuja: secili rol sheh vetëm faqet e veta ─────────────────────────────
for (const [key, r] of Object.entries(ROLES)) {
  test(`${key}: menuja tregon vetëm përgjegjësitë e rolit`, async ({ page }) => {
    await hyrReale(page, r.email);
    const nav = page.locator("aside");
    await expect(nav.getByRole("button", { name: "Paneli" })).toBeVisible({ timeout: 10000 });
    for (const t of r.sees) await expect(nav.getByRole("button", { name: t, exact: true })).toBeVisible();
    for (const t of r.hidden) await expect(nav.getByRole("button", { name: t, exact: true })).toHaveCount(0);
    // Emri dhe roli i vërtetë në krye (jo më "Blerim G.")
    await expect(page.locator("header").getByText(r.label, { exact: true })).toBeVisible();
    await expect(page.locator("header").getByText("Blerim G.")).toHaveCount(0);
  });
}

// ── 2. Kalimi te pamja si anëtar ──────────────────────────────────────────────
test("stafi kalon te pamja e vet si anëtar dhe kthehet", async ({ page }) => {
  await hyrReale(page, ROLES.financa.email);
  const nav = page.locator("aside");
  await nav.getByRole("button", { name: "Pamja ime si anëtar" }).click();
  await expect(nav.getByRole("button", { name: "Faturat" })).toBeVisible();
  await expect(nav.getByRole("button", { name: "Pagesat" })).toHaveCount(0);
  await nav.getByRole("button", { name: "Pamja e menaxhimit" }).click();
  await expect(nav.getByRole("button", { name: "Pagesat" })).toBeVisible();
});

// ── 3. Anëtari i thjeshtë s'ka menu menaxhimi ─────────────────────────────────
test("anëtari i thjeshtë sheh vetëm panelin e anëtarit", async ({ page }) => {
  await hyrReale(page, "qa-anetar@vv-test.ch");
  await expect(page.getByText("Hapi 1 nga 4")).toBeVisible({ timeout: 10000 });
  for (const n of ["Fillo", "Konfirmo", "E kuptova", "Hyr në platformë"]) await page.getByRole("button", { name: n }).click();
  const nav = page.locator("aside");
  await expect(nav.getByRole("button", { name: "Faturat" })).toBeVisible();
  await expect(nav.getByRole("button", { name: "Pagesat" })).toHaveCount(0);
  await expect(nav.getByRole("button", { name: /Pamja e menaxhimit/ })).toHaveCount(0);
  await expect(page.locator("header").getByText("Test A.")).toBeVisible();
});

// ── 4. Serveri i zbaton lejet edhe pa aplikacionin ───────────────────────────
test("serveri: financat lexojnë raportin financiar, të tjerët jo", async ({ request }) => {
  const fin = await token(request, ROLES.financa.email);
  expect((await rpc(request, fin, "finance_monthly", { p_year: 2026 })).ok()).toBeTruthy();

  const kom = await token(request, ROLES.komunikimi.email);
  expect((await rpc(request, kom, "finance_monthly", { p_year: 2026 })).ok()).toBeFalsy();

  const mem = await token(request, "qa-anetar@vv-test.ch");
  expect((await rpc(request, mem, "admin_dashboard_stats")).ok()).toBeFalsy();
});

test("serveri: vetëm admin/kryetar shohin dhe ndryshojnë rolet", async ({ request }) => {
  for (const key of ["financa", "sekretar"]) {
    const jwt = await token(request, ROLES[key].email);
    expect((await rpc(request, jwt, "list_user_roles")).ok()).toBeFalsy();
    expect((await rpc(request, jwt, "set_user_role", { p_email: ROLES[key].email, p_role: "admin" })).ok()).toBeFalsy();
  }
  const mem = await token(request, "qa-anetar@vv-test.ch");
  expect((await rpc(request, mem, "set_user_role", { p_email: "qa-anetar@vv-test.ch", p_role: "admin" })).ok()).toBeFalsy();
});

test("serveri: eventet s'mund të publikojnë njoftime", async ({ request }) => {
  const jwt = await token(request, ROLES.eventet.email);
  const r = await request.post(`${SB_URL}/rest/v1/announcements`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${jwt}`, Prefer: "return=minimal" },
    data: { extra: { title: "QA — nuk duhet të krijohet" } },
  });
  expect(r.ok()).toBeFalsy();
});
