import Image from "next/image";
import Link from "next/link";

import { IconArrow, IconCheck, IconChevronDown } from "@/components/icons";
import { PropertyCard } from "@/components/property-card";
import { Reveal } from "@/components/reveal";
import { SearchFilters } from "@/components/search-filters";
import { formatPrice } from "@/lib/format";
import { getRepository } from "@/lib/repo";
import { site } from "@/lib/site";
import { DEAL_LABELS, KINDS, KIND_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

const services = [
  {
    title: "Vlerësim i pronës",
    text: "Vlerësim diskret sipas çmimeve reale të tregut në zonë, pa kosto paraprake.",
  },
  {
    title: "Prezantim profesional",
    text: "Fotografi, planimetri dhe përshkrim editorial i pronës për blerësin e duhur.",
  },
  {
    title: "Negocim & dokumentacion",
    text: "Ndjekim vizitat, negocimin e çmimit dhe procesin notarial deri në nënshkrim.",
  },
];

const promises = [
  "Çdo listim verifikohet në dokumentacion para publikimit",
  "Një agjent i dedikuar nga vizita e parë deri te noteri",
  "Diskrecion i plotë për shitësit që nuk duan ekspozim publik",
  "Përgjigje brenda 24 orëve për çdo kërkesë",
];

export default async function HomePage() {
  const repo = getRepository();
  const [featured, cities, all] = await Promise.all([
    repo.featured(7),
    repo.cities(),
    repo.list(),
  ]);
  const spotlight = featured.reduce<(typeof featured)[number] | undefined>(
    (best, property) => (!best || property.price > best.price ? property : best),
    undefined,
  );
  const grid = featured.filter((property) => property.id !== spotlight?.id).slice(0, 6);
  const forSale = all.filter((property) => property.deal === "shitje").length;
  const forRent = all.length - forSale;

  return (
    <>
      <section className="relative isolate flex min-h-[82svh] items-end overflow-hidden bg-brand-dark sm:min-h-[88svh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/hero-villa.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/video/hero-villa-1080.mp4" media="(min-width: 768px)" type="video/mp4" />
          <source src="/video/hero-villa-720.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/20 to-brand-dark/30" />
        <div className="container-page relative pb-28 pt-24 text-white sm:pb-36 sm:pt-32">
          <p className="animate-fadein inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-light">
            <span className="h-px w-10 bg-gold-light" aria-hidden />
            Shqipëri · Kosovë
          </p>
          <h1 className="display mt-6 max-w-4xl text-5xl text-white sm:text-6xl lg:text-7xl">
            Prona të përzgjedhura, <em className="font-light italic text-gold-light">shërbim</em> i
            personalizuar
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80">
            Apartamente, vila, troje dhe ambiente biznesi, të përfaqësuara me kujdesin
            që meritojnë — nga vlerësimi i parë deri te nënshkrimi.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/prona?deal=shitje" className="btn-gold">
              Prona në shitje
            </Link>
            <Link href="/prona?deal=qira" className="btn-ghost-light">
              Prona me qira
            </Link>
          </div>
        </div>
        <a
          href="#kerko"
          aria-label="Shko te kërkimi"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-white/70 lg:block"
        >
          <IconChevronDown width={22} height={22} />
        </a>
      </section>

      <section id="kerko" className="relative z-10 -mt-16 scroll-mt-40 sm:-mt-20">
        <div className="container-page">
          <div className="card-lux p-2 sm:p-3">
            <SearchFilters cities={cities} filters={{}} variant="hero" />
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-16">
        <dl className="grid grid-cols-2 gap-8 border-y border-line py-8 sm:grid-cols-4">
          {[
            { value: String(all.length), label: "prona të verifikuara" },
            { value: String(cities.length), label: "qytete me mbulim" },
            { value: String(forSale), label: "në shitje" },
            { value: String(forRent), label: "me qira" },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 80} className="text-center sm:text-left">
              <dd className="font-serif text-4xl text-brand sm:text-5xl">{item.value}</dd>
              <dt className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                {item.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </section>

      {spotlight && (
        <section className="container-page pb-20">
          <Reveal>
            <p className="eyebrow-rule">Prona e zgjedhur</p>
          </Reveal>
          <Reveal className="mt-6">
            <Link
              href={`/prona/${spotlight.slug}`}
              className="group grid overflow-hidden bg-brand text-white lg:grid-cols-[1.35fr_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src={spotlight.images[0] ?? "/images/prona-1.svg"}
                  alt={spotlight.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition duration-[1400ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-light">
                    {DEAL_LABELS[spotlight.deal]} · {KIND_LABELS[spotlight.kind]}
                  </p>
                  <h2 className="display mt-5 text-3xl sm:text-4xl">{spotlight.title}</h2>
                  <p className="mt-3 text-sm text-white/70">
                    {spotlight.address ? `${spotlight.address}, ` : ""}
                    {spotlight.city}
                  </p>
                  {spotlight.description && (
                    <p className="mt-6 line-clamp-4 text-sm leading-relaxed text-white/80">
                      {spotlight.description}
                    </p>
                  )}
                </div>
                <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
                  <p className="font-serif text-4xl text-gold-light">
                    {formatPrice(spotlight.price, spotlight.deal)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white transition group-hover:gap-3">
                    Shiko pronën <IconArrow />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="container-page pb-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="eyebrow-rule">Portofoli</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Prona të zgjedhura</h2>
          </div>
          <Link href="/prona" className="link-arrow shrink-0">
            Shiko të gjitha <IconArrow />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((property, index) => (
            <Reveal key={property.id} delay={(index % 3) * 90}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-brand-dark py-24 text-white">
        <Image
          src="/images/hero-villa.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand-dark/60" />
        <div className="container-page relative grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow-rule text-gold-light before:bg-gold-light">Pse Domus</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-5xl">
              Pak prona. Shumë kujdes.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/75">
              Nuk mbledhim çdo njoftim të tregut. Përfaqësojmë një numër të kufizuar pronash
              dhe i njohim mirë, që çdo vizitë dhe çdo negocim të ketë kuptim për ju.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="space-y-5">
              {promises.map((promise) => (
                <li key={promise} className="flex gap-4 border-b border-white/10 pb-5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-light text-gold-light">
                    <IconCheck width={13} height={13} />
                  </span>
                  <span className="text-sm leading-relaxed text-white/90">{promise}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-ivory py-16">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow text-center">Kategori</p>
          </Reveal>
          <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-2 text-[11px] font-semibold uppercase tracking-widest text-brand">
            {KINDS.map((kind) => (
              <Link
                key={kind}
                href={`/prona?kind=${kind}`}
                className="inline-flex min-h-11 items-center border-b border-transparent px-1 transition hover:border-gold hover:text-gold-dark"
              >
                {KIND_LABELS[kind]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <Reveal>
          <p className="eyebrow-rule">Shërbimet</p>
          <h2 className="display mt-3 max-w-2xl text-3xl sm:text-4xl">
            Përfaqësim i plotë, nga vlerësimi deri te nënshkrimi
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 100} className="border-t border-line pt-6">
              <span className="font-serif text-3xl text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-3 text-xl">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand py-24 text-white">
        <div className="container-page text-center">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-light">
              Pronarë
            </p>
            <h2 className="display mx-auto mt-5 max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
              Dëshironi të shitni ose jepni me qira pronën tuaj?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/75">
              Dërgoni të dhënat dhe një agjent kthen përgjigje brenda 24 orëve, me vlerësim
              dhe plan prezantimi për pronën.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/kontakt" className="btn-gold">
                Kërko vlerësim falas
              </Link>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="btn-ghost-light">
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
