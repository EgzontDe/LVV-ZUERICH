// notify-application: when a new membership application arrives, emails a thank-you to the applicant
// ("në shqyrtim", extra.thanks_sent_at) and a notice to the board (extra.notified_at).
// Called by the public form right after it saved the application: body { id }.
// Safe to call by anyone: it only sends once per application (extra.notified_at) and only for
// applications created in the last hour. Sensitive fields (personal number, finances, signature)
// are never put in the email — the board reads them in the app (Onboarding).
// Secrets (Supabase → Edge Functions → Secrets):
//   SMTP_USER     Gmail address that sends (e.g. the one used for Auth SMTP)
//   SMTP_PASS     Gmail App Password (16 letters)
//   NOTIFY_EMAIL  optional, comma-separated recipients; default: all admin/kryetar/sekretar accounts
//   SITE_URL      optional, link in the email; default https://vv-pika-winterthur.vercel.app
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let id: number;
  try { id = Number((await req.json()).id); } catch { return json({ error: "invalid_body" }, 400); }
  if (!id) return json({ error: "invalid_body" }, 400);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: app } = await db.from("applications").select("*").eq("id", id).maybeSingle();
  if (!app) return json({ error: "not_found" }, 404);
  const x = app.extra ?? {};
  if (x.notified_at && x.thanks_sent_at) return json({ ok: true, skipped: "already_notified" });
  if (Date.now() - new Date(app.created_at).getTime() > 60 * 60 * 1000) return json({ ok: true, skipped: "too_old" });

  const user = Deno.env.get("SMTP_USER"), pass = Deno.env.get("SMTP_PASS");
  if (!user || !pass) return json({ error: "smtp_not_configured" }, 503);
  const mail = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });
  const from = `"VV Pika Zürich" <${user}>`;
  const done: Record<string, string> = {};

  // 1. Thank-you to the applicant: the application was received and is under review.
  if (!x.thanks_sent_at) {
    const first = esc(x.emri || String(app.name).split(" ")[0]);
    const thanks = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#171210">
  <div style="background:#E2231A;color:#fff;padding:18px 24px;border-radius:10px 10px 0 0">
    <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase">Lëvizja VETËVENDOSJE!</div>
    <div style="font-size:20px;font-weight:bold">Pika Zürich</div></div>
  <div style="border:1px solid #e5e2dd;border-top:none;padding:24px;border-radius:0 0 10px 10px">
    <h2 style="margin:0 0 12px;font-size:20px">Faleminderit, ${first}!</h2>
    <p style="font-size:15px;line-height:1.6">Aplikimi juaj për anëtarësim në Pikën Zürich u pranua dhe tani <b>është në shqyrtim</b> nga kryesia.</p>
    <p style="font-size:15px;line-height:1.6">Sapo të aprovohet, do t'ju vijë një email tjetër për të krijuar llogarinë tuaj në platformë, bashkë me detajet e pagesës së kuotës.</p>
    <p style="font-size:13px;color:#5A524E;line-height:1.6">Nëse keni pyetje, thjesht përgjigjuni këtij email-i.</p>
    <p style="font-size:15px;line-height:1.6;margin-top:20px">Me respekt,<br><b>Kryesia e Pikës Zürich</b></p>
  </div></div>`;
    try {
      await mail.sendMail({ from, to: app.email, subject: "Faleminderit për aplikimin — VV Pika Zürich", html: thanks });
      done.thanks_sent_at = new Date().toISOString();
    } catch (e) { console.error("[notify-application] thanks", e); }
  }
  if (x.notified_at) {
    const { data: fresh } = await db.from("applications").select("extra").eq("id", id).maybeSingle();
    await db.from("applications").update({ extra: { ...(fresh?.extra ?? x), ...done } }).eq("id", id);
    return json({ ok: true, thanks: !!done.thanks_sent_at });
  }

  let to = (Deno.env.get("NOTIFY_EMAIL") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length) {
    const { data: staff } = await db.from("profiles").select("email").in("role", ["admin", "kryetar", "sekretar"]).is("deleted_at", null);
    to = (staff ?? []).map((r) => r.email).filter(Boolean);
  }
  if (!to.length) return json({ error: "no_recipients" }, 500);

  const site = Deno.env.get("SITE_URL") ?? "https://vv-pika-winterthur.vercel.app";
  const rows: [string, unknown][] = [
    ["Emri", app.name], ["Email", app.email], ["Telefoni", x.phone], ["Qyteti", [x.kodiPostar, x.qyteti].filter(Boolean).join(" ")],
    ["Kantoni", x.kanton], ["Pika", x.pika], ["Profesioni", x.prof], ["Datëlindja", x.dob], ["Aplikoi më", x.applied],
  ];
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;color:#171210">
  <div style="background:#E2231A;color:#fff;padding:16px 22px;border-radius:10px 10px 0 0"><b style="font-size:18px">Aplikim i ri për anëtarësim</b></div>
  <div style="border:1px solid #e5e2dd;border-top:none;padding:20px 22px;border-radius:0 0 10px 10px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows.filter(([, v]) => v).map(([k, v]) =>
      `<tr><td style="padding:6px 0;color:#5A524E;width:130px">${esc(k)}</td><td style="padding:6px 0;font-weight:bold">${esc(v)}</td></tr>`).join("")}</table>
    <p style="margin:22px 0;text-align:center"><a href="${esc(site)}" style="background:#E2231A;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold">Hape te Onboarding</a></p>
    <p style="font-size:12px;color:#5A524E">Të dhënat e plota (përfshirë numrin personal dhe nënshkrimin) i gjen në platformë te Onboarding.</p>
  </div></div>`;

  // 2. The board.
  try {
    await mail.sendMail({ from, to, subject: `Aplikim i ri: ${app.name}`, html });
    done.notified_at = new Date().toISOString();
  } catch (e) {
    console.error("[notify-application] smtp", e);
  }
  // Re-read so a change made meanwhile in Onboarding is not overwritten.
  const { data: fresh } = await db.from("applications").select("extra").eq("id", id).maybeSingle();
  await db.from("applications").update({ extra: { ...(fresh?.extra ?? x), ...done } }).eq("id", id);
  if (!done.notified_at) return json({ error: "send_failed", thanks: !!done.thanks_sent_at }, 502);
  return json({ ok: true, sent: to.length, thanks: !!done.thanks_sent_at });
});
