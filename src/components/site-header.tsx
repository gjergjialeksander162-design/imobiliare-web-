import Link from "next/link";

import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/site";

const links = [
  { href: "/prona", label: "Prona" },
  { href: "/prona?deal=shitje", label: "Në shitje" },
  { href: "/prona?deal=qira", label: "Me qira" },
  { href: "/rreth-nesh", label: "Rreth nesh" },
  { href: "/kontakt", label: "Kontakt" },
];

const tabs = [
  { href: "/prona?deal=shitje", label: "Blej" },
  { href: "/prona?deal=qira", label: "Qira" },
  { href: "/prona?kind=truall", label: "Troje" },
  { href: "/prona", label: "Të gjitha" },
];

const navLinkClass =
  "relative whitespace-nowrap py-1 text-white/85 transition-colors hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-brand text-white">
      <div className="bg-brand-dark">
        <div className="container-page flex items-center justify-end gap-5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/65">
          <span className="mr-auto hidden sm:block">{site.address}</span>
          <span className="hidden lg:block">{site.hours}</span>
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

      <div className="container-page flex items-center justify-between gap-6 py-3">
        <Link href="/" className="shrink-0">
          <Wordmark size="xs" block={false} />
        </Link>

        <nav className="-mx-1 min-w-0 flex-1 overflow-x-auto lg:flex-none">
          <div className="flex w-max min-w-full items-center justify-start gap-6 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] lg:justify-end lg:gap-8">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <Link
          href="/kontakt"
          className="hidden shrink-0 border border-white/70 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-brand lg:block"
        >
          Shitni me ne
        </Link>
      </div>

      <div className="container-page hidden gap-5 pb-7 pt-2 sm:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:pb-9">
        <p className="max-w-md font-serif text-2xl leading-tight sm:text-[2rem]">
          Gjeni pronën që i përshtatet jetës tuaj.
        </p>

        <div>
          <div className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.18em]">
            {tabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className="pb-1 text-white/75 transition-colors hover:text-white"
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <form
            action="/prona"
            className="mt-3 flex items-center gap-3 border-b border-white/40 pb-2"
          >
            <input
              type="search"
              name="q"
              placeholder="Qytet, zonë, adresë ose kod"
              aria-label="Kërko prona"
              className="min-w-0 flex-1 bg-transparent font-serif text-base text-white outline-none placeholder:text-white/55 sm:text-lg"
            />
            <button
              type="submit"
              aria-label="Kërko"
              className="text-lg text-white/80 transition-colors hover:text-white"
            >
              &#10230;
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
