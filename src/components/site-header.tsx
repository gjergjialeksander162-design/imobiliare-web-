import Link from "next/link";

import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/site";

const links = [
  { href: "/prona?deal=shitje", label: "Në shitje" },
  { href: "/prona?deal=qira", label: "Me qira" },
  { href: "/prona", label: "Të gjitha pronat" },
  { href: "/rreth-nesh", label: "Rreth nesh" },
  { href: "/kontakt", label: "Kontakt" },
];

const navLinkClass =
  "relative whitespace-nowrap py-1 transition-colors hover:text-brand after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur">
      <div className="bg-brand text-white">
        <div className="container-page flex items-center justify-between gap-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em]">
          <span className="hidden text-white/70 sm:block">{site.address}</span>
          <span className="hidden text-white/70 lg:block">{site.hours}</span>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="hover:text-white/70"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="hidden hover:text-white/70 sm:block"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page grid grid-cols-1 items-center gap-4 py-4 sm:py-6 lg:grid-cols-3">
        <div className="hidden flex-col gap-1 lg:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Konsultë falas
          </span>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="font-serif text-xl text-brand hover:opacity-70"
          >
            {site.phone}
          </a>
        </div>

        <Link href="/" className="mx-auto">
          <Wordmark />
        </Link>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <Link href="/prona" className="btn-outline">
            Shiko pronat
          </Link>
          <Link href="/kontakt" className="btn bg-brand text-white hover:bg-brand-dark">
            Kontakt
          </Link>
        </div>
      </div>

      <div className="border-y border-line bg-sand">
        <div className="container-page flex items-center gap-6 lg:justify-between">
          <nav className="-mx-1 flex-1 overflow-x-auto">
            <div className="flex w-max min-w-full items-center gap-7 px-1 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 lg:gap-9">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <form
            action="/prona"
            className="hidden shrink-0 items-center border border-line bg-white lg:flex"
          >
            <input
              type="search"
              name="q"
              placeholder="Kërko: qytet, zonë, kod…"
              aria-label="Kërko prona"
              className="w-56 bg-transparent px-3 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand hover:text-brand-dark"
            >
              Kërko
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
