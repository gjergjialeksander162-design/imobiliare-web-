import Link from "next/link";

import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/site";
import { KINDS, KIND_LABELS } from "@/lib/types";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-brand text-white">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark block={false} />
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {site.description}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Kategori
          </p>
          <ul className="mt-2 text-sm text-white/85">
            {KINDS.map((kind) => (
              <li key={kind}>
                <Link
                  href={`/prona?kind=${kind}`}
                  className="inline-flex min-h-10 items-center hover:text-white"
                >
                  {KIND_LABELS[kind]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Faqe
          </p>
          <ul className="mt-2 text-sm text-white/85">
            <li>
              <Link href="/prona" className="inline-flex min-h-10 items-center hover:text-white">
                Të gjitha pronat
              </Link>
            </li>
            <li>
              <Link
                href="/rreth-nesh"
                className="inline-flex min-h-10 items-center hover:text-white"
              >
                Rreth nesh
              </Link>
            </li>
            <li>
              <Link
                href="/kontakt"
                className="inline-flex min-h-10 items-center hover:text-white"
              >
                Kontakt
              </Link>
            </li>
            <li>
              <Link href="/admin" className="inline-flex min-h-10 items-center hover:text-white">
                Panel administrimi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Kontakt
          </p>
          <ul className="mt-4 space-y-1 break-words text-sm text-white/85">
            <li>{site.address}</li>
            <li>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-10 items-center hover:text-white"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-10 items-center break-all hover:text-white"
              >
                {site.email}
              </a>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-[11px] uppercase tracking-widest text-white/60">
        {`© ${new Date().getFullYear()} ${site.name}. Të gjitha të drejtat e rezervuara.`}
      </div>
    </footer>
  );
}
