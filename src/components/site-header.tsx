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
  "relative whitespace-nowrap py-1 text-white/80 transition-colors hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-brand text-white">
      <div className="bg-brand-dark">
        <div className="container-page flex items-center justify-between gap-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
          <span className="hidden sm:block">{site.address}</span>
          <span className="hidden lg:block">{site.hours}</span>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="hover:text-white"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="hidden hover:text-white sm:block"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page grid grid-cols-1 items-center gap-4 py-4 sm:py-6 lg:grid-cols-3">
        <div className="hidden flex-col gap-1 lg:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
            Konsultë falas
          </span>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="font-serif text-xl hover:text-white/70"
          >
            {site.phone}
          </a>
        </div>

        <Link href="/" className="mx-auto">
          <Wordmark block={false} />
        </Link>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <Link
            href="/prona"
            className="btn border border-white/60 text-white hover:bg-white hover:text-brand"
          >
            Shiko pronat
          </Link>
          <Link
            href="/kontakt"
            className="btn bg-white text-brand hover:bg-white/85"
          >
            Kontakt
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15 bg-brand-dark/40">
        <div className="container-page flex items-center gap-6 lg:justify-between">
          <nav className="-mx-1 flex-1 overflow-x-auto">
            <div className="flex w-max min-w-full items-center gap-7 px-1 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] lg:gap-9">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <form
            action="/prona"
            className="hidden shrink-0 items-center border border-white/25 bg-white/10 lg:flex"
          >
            <input
              type="search"
              name="q"
              placeholder="Kërko: qytet, zonë, kod…"
              aria-label="Kërko prona"
              className="w-56 bg-transparent px-3 py-2 text-xs text-white outline-none placeholder:text-white/50"
            />
            <button
              type="submit"
              className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:text-white/70"
            >
              Kërko
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
