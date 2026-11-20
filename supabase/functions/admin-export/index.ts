// admin-export: data exports for administrators.
// Body: { type: "members-csv" | "backup-json" | "payments-pdf" }
// Returns the file (CSV / JSON / PDF) as the response body.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "content-disposition",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
function file(body: BodyInit, type: string, name: string) {
  return new Response(body, { headers: { ...cors, "Content-Type": type, "Content-Disposition": `attachment; filename="${name}"` } });
}

type Row = Record<string, unknown>;
const flat = (r: Row) => ({ ...((r.extra as Row) ?? {}), ...r, extra: undefined });

function toCsv(rows: Row[], cols: [string, string][]) {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.map(([, h]) => h).join(";"), ...rows.map((r) => cols.map(([k]) => esc(r[k])).join(";"))];
  return "﻿" + lines.join("\n");
}

// pdf-lib's standard fonts are WinAnsi; Albanian ë/ç are in that set, other characters are replaced.
const safe = (s: unknown) => String(s ?? "").replace(/[^\x20-\x7E -ÿ]/g, "?");

async function paymentsPdf(members: Row[], payments: Row[], year: number) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const red = rgb(0.886, 0.137, 0.102), ink = rgb(0.09, 0.07, 0.06), soft = rgb(0.35, 0.32, 0.3);
  let page = doc.addPage([595, 842]);
  let y = 790;
  const text = (s: string, x: number, size = 10, f = font, color = ink) => page.drawText(safe(s), { x, y, size, font: f, color });

  page.drawRectangle({ x: 0, y: 812, width: 595, height: 30, color: red });
  page.drawText("VETËVENDOSJE! · Pika Winterthur", { x: 40, y: 822, size: 12, font: bold, color: rgb(1, 1, 1) });
  text(`Raporti i pagesave ${year}`, 40, 20, bold); y -= 22;
  text(`Gjeneruar më ${new Date().toLocaleDateString("de-CH")}`, 40, 10, font, soft); y -= 30;

  const paid = members.filter((m) => m.pay === "paguar").length;
  const unpaid = members.filter((m) => m.pay === "papaguar").length;
  const exempt = members.filter((m) => m.pay === "liruar").length;
  const confirmed = payments.filter((p) => p.status === "konfirmuar" && p.year === year);
  const sum = confirmed.reduce((s, p) => s + Number(p.amount), 0);
  for (const [k, v] of [["Anëtarë", members.length], ["Paguar", paid], ["Papaguar", unpaid], ["Liruar", exempt], ["Arkëtuar (CHF)", sum.toFixed(2)]] as [string, unknown][]) {
    text(k, 40, 11, font, soft); text(String(v), 200, 11, bold); y -= 18;
  }
  y -= 16;

  const header = () => {
    page.drawRectangle({ x: 36, y: y - 5, width: 523, height: 20, color: rgb(0.93, 0.93, 0.91) });
    text("Nr.", 42, 10, bold); text("Emri", 80, 10, bold); text("Kantoni", 280, 10, bold); text("Statusi", 400, 10, bold); text("Referenca", 470, 10, bold);
    y -= 22;
  };
  header();
  for (const m of members) {
    if (y < 60) { page = doc.addPage([595, 842]); y = 800; header(); }
    const id = Number(m.id);
    text(String(id), 42); text(String(m.name ?? ""), 80); text(String(m.kanton ?? ""), 280);
    text(String(m.pay ?? ""), 400, 10, bold, m.pay === "paguar" ? rgb(0.12, 0.54, 0.3) : m.pay === "papaguar" ? rgb(0.73, 0.48, 0.06) : soft);
    text(`VV-${id < 1000 ? String(id).padStart(3, "0") : id}-${year}`, 470, 9, font, soft);
    y -= 16;
  }
  return await doc.save();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: caller, error: callerErr } = await admin.auth.getUser(jwt);
  if (callerErr || !caller?.user) return json({ error: "not_authenticated" }, 401);
  const { data: profile } = await admin.from("profiles").select("role").eq("id", caller.user.id).maybeSingle();
  if (profile?.role !== "admin") return json({ error: "not_admin" }, 403);

  let body: { type?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid_body" }, 400); }
  const day = new Date().toISOString().slice(0, 10);
  const year = new Date().getFullYear();

  try {
    if (body.type === "members-csv") {
      const { data, error } = await admin.from("members").select("*").order("id");
      if (error) throw error;
      const csv = toCsv((data ?? []).map(flat), [
        ["id", "Nr."], ["name", "Emri"], ["email", "Email"], ["phone", "Telefoni"], ["kanton", "Kantoni"],
        ["role", "Roli"], ["status", "Statusi"], ["pay", "Pagesa"], ["joined", "Anëtar prej"], ["prof", "Profesioni"],
      ]);
      return file(csv, "text/csv; charset=utf-8", `anetaret-${day}.csv`);
    }

    if (body.type === "backup-json") {
      const tables = ["members", "events", "announcements", "polls", "applications", "donations", "payments",
        "requests", "event_checkins", "documents", "notifications", "settings"];
      const out: Record<string, unknown> = { generated_at: new Date().toISOString(), generated_by: caller.user.email };
      for (const t of tables) {
        const { data, error } = await admin.from(t).select("*");
        if (error) throw error;
        out[t] = data;
      }
      return file(JSON.stringify(out, null, 2), "application/json", `backup-vv-winterthur-${day}.json`);
    }

    if (body.type === "payments-pdf") {
      const [{ data: members, error: e1 }, { data: payments, error: e2 }] = await Promise.all([
        admin.from("members").select("*").order("id"),
        admin.from("payments").select("*"),
      ]);
      if (e1 || e2) throw e1 ?? e2;
      const pdf = await paymentsPdf((members ?? []).map(flat), payments ?? [], year);
      return file(pdf, "application/pdf", `raporti-pagesave-${year}.pdf`);
    }
  } catch (err) {
    console.error(err);
    return json({ error: "export_failed" }, 500);
  }
  return json({ error: "unknown_type" }, 400);
});
