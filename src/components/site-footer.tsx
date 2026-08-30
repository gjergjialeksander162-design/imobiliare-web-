import Link from "next/link";

import { site } from "@/lib/site";
import { KINDS, KIND_LABELS } from "@/lib/types";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-base font-bold">{site.name}</p>
          <p className="mt-2 text-sm text-slate-600">{site.description}</p>
        </div>

        <div>
          <p className="text-sm font-semibold">Kategori</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {KINDS.map((kind) => (
              <li key={kind}>
                <Link href={`/prona?kind=${kind}`} className="hover:text-brand">
                  {KIND_LABELS[kind]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Faqe</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/prona" className="hover:text-brand">
                Të gjitha pronat
              </Link>
            </li>
            <li>
              <Link href="/rreth-nesh" className="hover:text-brand">
                Rreth nesh
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="hover:text-brand">
                Kontakt
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-brand">
                Panel administrimi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Kontakt</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>{site.address}</li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {site.name}. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
}
