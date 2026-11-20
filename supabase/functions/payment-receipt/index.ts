// payment-receipt: PDF receipt (Vërtetim pagese) for one confirmed payment.
// Body: { paymentId: number }. Members get only their own payments; admins any.
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
const safe = (s: unknown) => String(s ?? "").replace(/[^\x20-\x7E -ÿ]/g, "?");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  // Query as the caller, so row-level security decides which payments they may see.
  const asUser = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data: who, error: whoErr } = await asUser.auth.getUser(jwt);
  if (whoErr || !who?.user) return json({ error: "not_authenticated" }, 401);

  let body: { paymentId?: number };
  try { body = await req.json(); } catch { return json({ error: "invalid_body" }, 400); }
  const id = Number(body.paymentId);
  if (!Number.isFinite(id)) return json({ error: "invalid_payment" }, 400);

  const { data: p } = await asUser.from("payments").select("*").eq("id", id).maybeSingle();
  if (!p) return json({ error: "not_found" }, 404);
  if (p.status !== "konfirmuar") return json({ error: "not_confirmed" }, 409);
  const { data: m } = await asUser.from("members").select("id,name,email,extra").eq("id", p.member_id).maybeSingle();

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const red = rgb(0.886, 0.137, 0.102), ink = rgb(0.09, 0.07, 0.06), soft = rgb(0.35, 0.32, 0.3);
  const page = doc.addPage([420, 298]); // A6 landscape
  const t = (s: unknown, x: number, y: number, size = 10, f = font, color = ink) =>
    page.drawText(safe(s), { x, y, size, font: f, color });

  page.drawRectangle({ x: 0, y: 262, width: 420, height: 36, color: red });
  t("VETËVENDOSJE! · Pika Winterthur", 24, 275, 12, bold, rgb(1, 1, 1));
  t("Vërtetim pagese", 24, 230, 18, bold);
  t(`Nr. VP-${p.year}-${String(p.id).padStart(5, "0")}`, 24, 212, 10, font, soft);

  const mid = Number(p.member_id);
  const ref = `VV-${mid < 1000 ? String(mid).padStart(3, "0") : mid}-${p.year}`;
  const confirmed = new Date(p.updated_at ?? p.created_at).toLocaleDateString("de-CH");
  const rows: [string, string][] = [
    ["Anëtari", `${m?.name ?? "—"} (#${mid})`],
    ["Përshkrimi", `Kuota vjetore e anëtarësisë ${p.year}`],
    ["Mënyra", String(p.method).toUpperCase()],
    ["Referenca", ref],
    ["Konfirmuar më", confirmed],
  ];
  let y = 180;
  for (const [k, v] of rows) { t(k, 24, y, 10, font, soft); t(v, 130, y, 10, bold); y -= 18; }

  page.drawRectangle({ x: 270, y: 24, width: 126, height: 50, color: rgb(0.93, 0.93, 0.91) });
  t("SHUMA", 282, 58, 8, bold, soft);
  t(`CHF ${Number(p.amount).toFixed(2)}`, 282, 34, 16, bold, red);
  t("Faleminderit për kontributin!", 24, 34, 9, font, soft);

  const pdf = await doc.save();
  return new Response(pdf, {
    headers: { ...cors, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="vertetim-${ref}.pdf"` },
  });
});
