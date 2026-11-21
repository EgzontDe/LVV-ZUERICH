# VV Pika Zürich — CLAUDE.md

## Project overview
Single-page React prototype for the **Lëvizja VETËVENDOSJE! Pika Zürich** membership platform. All UI, state, data, and logic live in one file: `src/App.jsx`. No backend — all data is mock/seed. Language: Albanian (Shqip).

**Stack:** React 18 · Vite 4 · lucide-react · single-file architecture  
**Dev server:** `npm run dev` → http://localhost:5173  
**Remote:** https://github.com/EgzontDe/LVV-ZUERICH.git  

## Golden rules
- **Never restructure the file.** Always append new components to the end of `src/App.jsx`.
- **Never add Co-Authored-By** to commits.
- All CSS lives in the `css` template literal near the top of `App.jsx`. Add new classes there — do not create separate CSS files.
- Keep everything in one file. Do not extract components into separate files.

## Git workflow
```bash
git add src/App.jsx
git commit -m "feat: <description in Albanian or English>"
git push origin master
```
No `Co-Authored-By`. No `--no-verify`. Commit messages may be in Albanian or English.

## Login roles (seed data)
| Role | User | ID |
|------|------|----|
| Anëtar (member) | Blerim Gashi | id=5, `pay:"papaguar"` |
| Administrator | Egzont Demiri | id=3 |
| Apliko (public apply) | — | ApplyForm component |

## Roles (real Supabase login, since 2026-11-21)
`profiles.role` is one of `member, admin, kryetar, sekretar, financa, komunikimi, eventet`.
The database enforces permissions (`private.has_perm(area)` in `supabase/migrations/20261121000000_roles.sql`);
the app only filters the menu (`ROLE_PERMS` / `TAB_PERM` / `tabsForRole` at the end of `App.jsx`). Keep the two in sync.

| Role | Areas |
|------|-------|
| admin, kryetar | everything + settings, audit log, assigning roles (Cilësimet → Rolet) |
| sekretar | members, applications, requests, documents |
| financa | payments, reminders, donations, finance reports |
| komunikimi | announcements, polls, requests |
| eventet | events, calendar, check-in |
| member | own data only |

**Accounts:** Cilësimet → Rolet → "Krijo llogari" calls Edge Function `create-account` (modes `password` = returns a generated password, `invite` = Supabase invite email, `new_password` = fresh password for an existing account). It creates the auth user, the `members` row (next id < 9000) and sets `profiles.role`. Admin/kryetar: any role; sekretar: members only. **Soft delete:** RPC `admin_delete_user` bans the login, ends sessions, sets `profiles.deleted_at` and member status `joaktiv`; `admin_restore_user` undoes it; cron `fshirja-perfundimtare-llogarive` (`private.purge_deleted_accounts`) deletes after 30 days (payments kept with `member_id` null → "Anëtar i fshirë"). `profiles` is in the realtime publication; `useMyRoleLive` switches the person's menu as soon as their role changes.

Every staff role also sees **Detyrat** (Kanban, table `tasks`). Staff can switch to their own member view ("Pamja ime si anëtar"). Demo buttons are unaffected (demo admin = full access).
Live tests: `tests/10-rolet.spec.js`, `tests/11-anetari-real.spec.js` need `QA_PASSWORD` (QA accounts `qa-*@vv-test.ch`); without it they are skipped.

## Component status

### Member nav tabs
| key | label | component | status |
|-----|-------|-----------|--------|
| home | Kreu | MemberHome | ✅ |
| profile | Profili im | MemberProfile | ✅ |
| invoices | Faturat | MemberInvoices | ✅ |
| events | Eventet | MemberEvents | ✅ |
| news | Njoftimet | MemberNews | ✅ |
| donate | Dono | MemberDonate | ✅ |
| polls | Sondazhet | MemberPolls | ✅ |
| tasks | Detyrat e mia | MemberTasks | ✅ (tasks assigned to me; move via RPC `set_my_task_col`) |

### Admin nav tabs
| key | label | component | status |
|-----|-------|-----------|--------|
| home | Paneli | AdminHome | ✅ |
| members | Anëtarët | AdminMembers | ✅ |
| payments | Pagesat | AdminPayments | ✅ |
| finance | Financat | AdminFinance | ✅ |
| events | Eventet | AdminEvents | ✅ |
| calendar | Kalendari | AdminCalendar | ✅ |
| comms | Komunikimi | AdminComms | ✅ |
| elections | Zgjedhjet | AdminElections | ✅ |
| polls | Sondazhet | AdminPolls | ✅ |
| donations | Donacionet | AdminDonations | ✅ |
| recruitment | Rekrutimi | AdminRecruitment | ✅ |
| map | Harta | AdminMap | ✅ |
| requests | Kërkesat | AdminRequests | ✅ |
| archive | Arkiva | AdminArchive | ✅ |
| settings | Cilësimet | AdminSettings | ✅ |

### Public pages
| component | status |
|-----------|--------|
| PublicHome | ✅ (added 2026-06-23) |
| Login | ✅ |
| ApplyForm | ✅ |

## Seed data available in App.jsx
- `seedMembers` — 12 members with roles, kanton, payment status
- `seedEvents` — 4 events (past/upcoming, public/private)
- `seedAnnouncements` — news items
- `seedDonations` — 5 donations, total CHF 250; `DONATION_TARGET = 500`
- `seedPolls` — 3 polls (2 active, 1 closed)
- `FINANCE_MONTHS` — Jan–Jun 2026 monthly collections; `FINANCE_TARGET_YEAR = 1800`
- `CANTON_DATA` — 6 cantons with member counts
- `seedReferrals` — 6 members with referral codes and counts
- `KUOTA = 150` (CHF annual membership fee)

## CSS design system
All classes prefixed `.vv-`. Key ones:
- `.vv-card` — white card with border + shadow
- `.vv-card-accent` — red gradient card
- `.vv-btn` — red gradient button; `.vv-btn.ghost` white; `.vv-btn.dark` dark; `.vv-btn.grn` green
- `.vv-chip` — status pill
- `.vv-th` / `.vv-td` / `.vv-row` — table cells
- `.vv-input` — form input
- `.vv-overlay` / `.vv-modal` — modal backdrop + container
- `.vv-eyebrow` — red uppercase label
- `.vv-stat` — large number (Archivo font)
- `.vv-toast` — bottom notification toast
- `.display` — Archivo font class

## Color palette (`C` object)
```js
C.red      = "#E2231A"   // primary brand red
C.redDark  = "#B5170F"
C.ink      = "#171210"   // near-black text
C.inkSoft  = "#5A524E"   // muted text
C.paper    = "#EDECE8"   // page background
C.card     = "#FFFFFF"
C.green    = "#1E8A4C"
C.amber    = "#B97A10"
C.sidebar  = "#1C1410"
```

## Reusable helper components
- `Card` — wraps `.vv-card` with padding prop
- `SectionTitle` — h2 with optional action button
- `Modal` — overlay with title and X close button
- `Field` — icon + label + value row
- `StatCard` — animated stat card with icon
- `Toast` — bottom toast notification (auto-dismiss)

## Reference
Original Next.js implementation at `C:\Users\xonie\WebstormProjects\lvv-zurich`. When a feature is unclear, check `lvv-zurich/src/app/(dashboard)/` for the original logic.