# VV Pika Winterthur — CLAUDE.md

## Project overview
Single-page React prototype for the **Lëvizja VETËVENDOSJE! Pika Winterthur** membership platform. All UI, state, data, and logic live in one file: `src/App.jsx`. No backend — all data is mock/seed. Language: Albanian (Shqip).

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