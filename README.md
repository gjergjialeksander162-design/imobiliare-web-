# Domus Imobiliare — web për agjenci imobiliare

Next.js 15 (App Router) + TypeScript + Tailwind. Listime pronash me filtra, faqe detaji me galeri e hartë, formular kërkesash dhe panel administrimi.

## Nisja lokale

```bash
npm install
cp .env.example .env.local
npm run seed          # gjeneron data/properties.json me 8 prona shembull
npm run dev           # http://localhost:3000
```

Paneli: `http://localhost:3000/admin` — fjalëkalimi merret nga `ADMIN_PASSWORD` (default `admin123`).

## Burimi i të dhënave

Aplikacioni ka një shtresë të vetme `PropertyRepository` me dy implementime dhe zgjedh vetë:

| Kushti | Implementimi |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` + çelës i pranishëm | `supabase` (Postgres REST) |
| ndryshe | `local` (JSON në `data/`) |

Kalimi në Supabase:

1. Krijo projekt në Supabase dhe ekzekuto `supabase/schema.sql` në SQL Editor.
2. Vendos `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` dhe `SUPABASE_SERVICE_ROLE_KEY` në `.env.local` (dhe në Vercel).
3. Ristarto serverin — paneli tregon burimin aktiv.

Shkrimi (shto/edito/fshi) kryhet vetëm server-side me service role key; RLS lejon lexim publik të listimeve dhe insert publik të kërkesave.

## Fotot

Në modalitetin lokal fotot janë placeholder SVG në `public/images` (`npm run placeholders`). Në Supabase ngarko fotot në bucket-in publik `property-images` dhe vendos URL-të e tyre në fushën "Fotot" të panelit.

## Skriptet

| Komanda | Përshkrimi |
| --- | --- |
| `npm run dev` | serveri i zhvillimit |
| `npm run build` / `npm start` | build dhe run prodhimi |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | të dhëna shembull në `data/` |
| `npm run placeholders` | rigjeneron SVG-të e fotove |

## Deploy në Vercel

Importo repon, shto variablat e mjedisit (`ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_*`, dhe Supabase kur është gati) dhe deploy. Në Vercel sistemi i skedarëve është read-only, ndaj për shkrim nga paneli duhet Supabase.
