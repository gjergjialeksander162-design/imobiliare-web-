import Link from "next/link";

import { site } from "@/lib/site";

const links = [
  { href: "/prona?deal=shitje", label: "Në shitje" },
  { href: "/prona?deal=qira", label: "Me qira" },
  { href: "/prona", label: "Të gjitha pronat" },
  { href: "/rreth-nesh", label: "Rreth nesh" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex items-center justify-between gap-6 py-5">
        <a
          href={`tel:${site.phone.replace(/\s/g, "")}`}
          className="hidden w-40 text-[11px] font-semibold uppercase tracking-widest text-slate-500 hover:text-brand lg:block"
        >
          {site.phone}
        </a>

        <Link href="/" className="mx-auto text-center">
          <span className="block font-serif text-2xl uppercase tracking-[0.28em] text-brand sm:text-3xl">
            {site.name}
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-widest text-slate-500">
            Real Estate
          </span>
        </Link>

        <div className="hidden w-40 justify-end lg:flex">
          <Link href="/kontakt" className="btn-outline">
            Kontakt
          </Link>
        </div>
      </div>

      <nav className="container-page flex justify-center gap-8 overflow-x-auto border-t border-line py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap hover:text-brand"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
