---
name: testing-crm
description: How to end-to-end test the Domus Imobiliare admin CRM and public inquiry flows on the Vercel production deployment (Next.js 15 App Router + Supabase).
---

# Testing the admin CRM / public inquiry flows

## Where to test
- Production: `https://imobiliare-web-kappa.vercel.app` (deploys `main`). Prefer it over local dev — Supabase prod data makes property-matching assertions deterministic.
- Admin login: `/admin`, single password field. CRM routes: `/admin/crm` (pipeline), `/admin/crm/klientet`, `/admin/crm/klientet/[id]`, `/admin/crm/detyrat`, `/admin/crm/raporte`.
- Public inquiry entry points: `/kontakt` and the form on `/prona/[slug]`.

## Getting the admin password (Vercel)
`VERCEL_TOKEN` is usually present in the session env. The `/v9/projects/{id}/env` listing returns *encrypted* values even with `decrypt=true`; use the single-var endpoint instead:

```
P=<project_id>   # e.g. via /v9/projects
ID=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v9/projects/$P/env" \
  | python3 -c "import sys,json;print([e['id'] for e in json.load(sys.stdin)['envs'] if e['key']=='ADMIN_PASSWORD'][0])")
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v1/projects/$P/env/$ID" \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['value'])"
```

The repo `.env*` files hold *local* values (`admin123` / `test123`) and a **different, possibly stale** `SUPABASE_SERVICE_ROLE_KEY` than production — a key that returns empty result sets / zero counts against the prod Supabase URL. Always pull `SUPABASE_SERVICE_ROLE_KEY` from Vercel the same way before trusting REST-based DB baselines, otherwise you may "confirm" a fake empty baseline.

## Baseline & verification via Supabase REST
Tables: `clients`, `leads`, `activities`, `crm_tasks`, `inquiries`, `properties`.
```
curl -s -H "apikey: $K" -H "Authorization: Bearer $K" -H "Prefer: count=exact" -I \
  "$SUPA_URL/rest/v1/clients?select=id" | grep -i content-range
```
Record counts before and after; production may have real user rows (a live user can create clients/leads/inquiries **while you test**), so scope cleanup to rows you created by name/email and never bulk-delete.

## Deterministic property matching
Matching (`src/lib/crm/matching.ts`) filters by deal/kind/city/minRooms/budget and returns up to 6 rows. For a positive control pick a real `shitje` listing and mirror its fields; for a negative control lower `Buxhet maks.` below its price and assert "Asnjë pronë me këto kritere." A lead with no criteria is valid ("pa kritere") and lists properties — that is expected, not a bug.

## Gotchas
- The `datetime-local` "afati" input often rejects a typed string; clear it and type the segments (MM, DD, YYYY, time) one by one, then re-read the rendered `afati dd.mm.yyyy` to confirm.
- Client name is enforced by HTML5 `required` (native "Please fill out this field" bubble), so no server round-trip happens for the empty-name case.
- Deleting a client cascades its leads/activities/tasks; delete tasks first only if you want to demo the task delete control.
- Inquiries have **no delete control** in `/admin`; remove test inquiry rows via Supabase REST `DELETE /rest/v1/inquiries?id=eq.<uuid>`.
- Public form dedups by email or phone: a second submit with the same email must yield 1 client / 2 leads, source shown as "Faqja web".
- Reports conversion = fituar / (fituar + humbur); it is 0% until a lead is Fituar/Humbur.

## Devin Secrets Needed
- `VERCEL_TOKEN` (to read `ADMIN_PASSWORD` and prod `SUPABASE_SERVICE_ROLE_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` (prod value; the repo `.env` copy may be stale)
