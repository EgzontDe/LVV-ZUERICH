// create-account: an admin creates a login for a person, links it to a member row and sets the role.
// Body: { email, name, role, mode: "password" | "invite", redirectTo? }
//  - "password": account is ready at once; the generated password is returned so the admin can hand it over.
//  - "invite":   Supabase sends an invite email; the person sets their own password via the link.
// Admin/kryetar may give any role; sekretar may only create plain members.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const ROLES = ["member", "admin", "kryetar", "sekretar", "financa", "komunikimi", "eventet", "studentet", "rinia"];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

// "Vv-k3m9p-x7r2t": easy to read out loud (no 0/o/1/l/i).
function makePassword() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  const s = Array.from(bytes, (b) => chars[b % chars.length]).join("");
  return `Vv-${s.slice(0, 5)}-${s.slice(5)}`;
}

function todayCH() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: caller, error: callerErr } = await admin.auth.getUser(jwt);
  if (callerErr || !caller?.user) return json({ error: "not_authenticated" }, 401);
  const { data: me } = await admin.from("profiles").select("role").eq("id", caller.user.id).maybeSingle();
  const myRole = me?.role ?? "";
  if (!["admin", "kryetar", "sekretar"].includes(myRole)) return json({ error: "not_admin" }, 403);

  let body: { email?: string; name?: string; role?: string; mode?: string; redirectTo?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid_body" }, 400); }
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim().slice(0, 120);
  const role = String(body.role ?? "member");
  const mode = body.mode === "invite" ? "invite" : body.mode === "new_password" ? "new_password" : "password";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "invalid_email" }, 400);

  // Existing account: give it a fresh password (e.g. the invite email never arrived). Admin/kryetar only.
  if (mode === "new_password") {
    if (!["admin", "kryetar"].includes(myRole)) return json({ error: "not_admin" }, 403);
    const { data: prof } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
    if (!prof) return json({ error: "no_account" }, 404);
    if (prof.id === caller.user.id) return json({ error: "own_account" }, 400);
    const password = makePassword();
    const { error } = await admin.auth.admin.updateUserById(prof.id, { password, email_confirm: true });
    if (error) return json({ error: "update_failed", detail: error.message }, 500);
    return json({ ok: true, mode, email, password });
  }
  if (!name) return json({ error: "missing_name" }, 400);
  if (!ROLES.includes(role)) return json({ error: "invalid_role" }, 400);
  if (myRole === "sekretar" && role !== "member") return json({ error: "role_not_allowed" }, 403);

  // 1. Which member this login belongs to (reuse one that already has this email, e.g. approved in Onboarding).
  const { data: existing } = await admin.from("members").select("id,pay").ilike("email", email).maybeSingle();
  let memberId = existing?.id as number | undefined;
  const isNewMember = !memberId;
  if (!memberId) {
    // Real members are numbered below 9000 (9001+ are test accounts).
    const { data: last } = await admin.from("members").select("id").lt("id", 9000).order("id", { ascending: false }).limit(1).maybeSingle();
    memberId = Number(last?.id ?? 0) + 1;
  }

  // Payment details for the invite email (template: {{ .Data.pay_ref }} etc.), unless already paid/exempt.
  const meta: Record<string, unknown> = { full_name: name };
  if (!existing || existing.pay === "papaguar") {
    const { data: settings } = await admin.from("settings").select("key,value").in("key", ["fee_override", "twint_number"]);
    const get = (k: string) => settings?.find((s) => s.key === k)?.value;
    const fee = get("fee_override") != null ? Number(get("fee_override")) : 150;
    const year = new Date().getFullYear();
    meta.pay_year = String(year);
    meta.pay_amount = fee.toFixed(2);
    meta.pay_ref = `VV-${memberId < 1000 ? String(memberId).padStart(3, "0") : memberId}-${year}`;
    if (get("twint_number")) meta.twint = String(get("twint_number"));
  }

  // 2. The login
  let userId: string;
  let password: string | null = null;
  if (mode === "password") {
    password = makePassword();
    const { data, error } = await admin.auth.admin.createUser({
      email, password, email_confirm: true, user_metadata: meta,
    });
    if (error || !data.user) {
      const already = /already|registered|exists/i.test(error?.message ?? "");
      return json({ error: already ? "already_registered" : "create_failed", detail: error?.message }, already ? 409 : 500);
    }
    userId = data.user.id;
  } else {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: meta, redirectTo: body.redirectTo || undefined,
    });
    if (error || !data.user) {
      const already = /already|registered|exists/i.test(error?.message ?? "");
      const limit = /rate limit/i.test(error?.message ?? "");
      return json({ error: already ? "already_registered" : limit ? "email_rate_limit" : "invite_failed", detail: error?.message },
        already ? 409 : limit ? 429 : 500);
    }
    userId = data.user.id;
  }

  // 3. The member row, if this person had none yet
  if (isNewMember) {
    const { error } = await admin.from("members").insert({
      id: memberId, name, email, status: "aktiv", pay: "papaguar",
      extra: { role: "Anëtar", joined: todayCH(), kanton: "Zürich", phone: "", prof: "", dob: "" },
    });
    if (error) return json({ error: "member_failed", detail: error.message, userId }, 500);
  }

  // 4. The role (the auth trigger already created the profile row)
  const { error: roleErr } = await admin.from("profiles").update({ role, full_name: name }).eq("id", userId);
  if (roleErr) return json({ error: "role_failed", detail: roleErr.message }, 500);

  return json({ ok: true, mode, email, password, memberId, role });
});
