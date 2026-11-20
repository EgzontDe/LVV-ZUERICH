// invite-member: sends a Supabase invite email to a member. Only admins may call it.
// Body: { email: string, name?: string, redirectTo?: string }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Who is calling? Must be logged in as admin, kryetar or sekretar.
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: caller, error: callerErr } = await admin.auth.getUser(jwt);
  if (callerErr || !caller?.user) return json({ error: "not_authenticated" }, 401);
  const { data: profile } = await admin.from("profiles").select("role").eq("id", caller.user.id).maybeSingle();
  if (!["admin", "kryetar", "sekretar"].includes(profile?.role ?? "")) return json({ error: "not_admin" }, 403);

  let body: { email?: string; name?: string; redirectTo?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid_body" }, 400); }
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "invalid_email" }, 400);

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: name ? { full_name: name } : undefined,
    redirectTo: body.redirectTo || undefined,
  });
  if (error) {
    const already = /already|registered|exists/i.test(error.message);
    return json({ error: already ? "already_registered" : "invite_failed", detail: error.message }, already ? 409 : 500);
  }
  return json({ ok: true });
});
