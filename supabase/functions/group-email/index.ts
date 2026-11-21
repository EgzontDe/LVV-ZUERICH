// group-email: the Studentët / Rinia secretary (or admin/kryetar) emails every member of the group.
// Body: { grupi: "studentet" | "rinia", subject: string, message: string }
// Recipients come from RPC list_group_members called AS THE CALLER, so the database decides who may send.
// Sent from the Gmail account in secrets SMTP_USER / SMTP_PASS, recipients in BCC (they don't see each other).
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
const TITLES: Record<string, string> = { studentet: "Studentët", rinia: "Rinia" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const asUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data: who } = await asUser.auth.getUser(jwt);
  if (!who?.user) return json({ error: "not_authenticated" }, 401);

  let body: { grupi?: string; subject?: string; message?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid_body" }, 400); }
  const grupi = String(body.grupi ?? "");
  const subject = String(body.subject ?? "").trim().slice(0, 150);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  if (!TITLES[grupi] || !subject || !message) return json({ error: "invalid_body" }, 400);

  const { data: members, error } = await asUser.rpc("list_group_members", { p_group: grupi });
  if (error) return json({ error: "not_allowed" }, 403);
  const to = [...new Set((members ?? []).map((m: { email: string }) => m.email).filter(Boolean))];
  if (!to.length) return json({ error: "no_recipients" }, 400);

  const user = Deno.env.get("SMTP_USER"), pass = Deno.env.get("SMTP_PASS");
  if (!user || !pass) return json({ error: "smtp_not_configured" }, 503);
  const mail = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });

  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#171210">
  <div style="background:#E2231A;color:#fff;padding:18px 24px;border-radius:10px 10px 0 0">
    <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase">Lëvizja VETËVENDOSJE! · Pika Zürich</div>
    <div style="font-size:20px;font-weight:bold">${esc(TITLES[grupi])}</div></div>
  <div style="border:1px solid #e5e2dd;border-top:none;padding:24px;border-radius:0 0 10px 10px">
    <h2 style="margin:0 0 12px;font-size:19px">${esc(subject)}</h2>
    <div style="font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(message)}</div>
  </div></div>`;

  // Gmail allows ~100 recipients per message; send in batches.
  let sent = 0;
  for (let i = 0; i < to.length; i += 80) {
    const batch = to.slice(i, i + 80);
    try {
      await mail.sendMail({ from: `"VV Pika Zürich · ${TITLES[grupi]}" <${user}>`, to: user, bcc: batch, replyTo: who.user.email, subject, html });
      sent += batch.length;
    } catch (e) { console.error("[group-email]", e); }
  }
  if (!sent) return json({ error: "send_failed" }, 502);
  return json({ ok: true, sent });
});
