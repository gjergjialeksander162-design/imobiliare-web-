import Image from "next/image";
import Link from "next/link";

import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { getRepository } from "@/lib/repo";
import { site } from "@/lib/site";
import { KINDS, KIND_LABELS } from "@/lib/types";

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

export default async function HomePage() {
  const repo = getRepository();
  const [featured, cities, all] = await Promise.all([
    repo.featured(6),
    repo.cities(),
    repo.list(),
  ]);

  const hero = featured[0]?.images[0] ?? "/images/prona-1.svg";

  return (
    <>
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden">
        <Image
          src={hero}
          alt={site.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/50 to-brand/25" />
        <div className="container-page relative pb-16 pt-24 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
            {site.address}
          </p>
          <h1 className="display mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            Prona të përzgjedhura, shërbim i personalizuar
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85">
            {all.length} prona të verifikuara në {cities.length} qytete — apartamente,
            vila, troje dhe ambiente biznesi, të përfaqësuara me kujdesin që meritojnë.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-sand py-10">
        <div className="container-page">
          <SearchFilters cities={cities} filters={{}} variant="hero" />
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="eyebrow">Portofoli</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Prona të zgjedhura</h2>
          </div>
          <Link href="/prona" className="btn-outline shrink-0">
            Shiko të gjitha
          </Link>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-sand py-16">
        <div className="container-page">
          <p className="eyebrow text-center">Kategori</p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[11px] font-semibold uppercase tracking-widest text-brand">
            {KINDS.map((kind) => (
              <Link key={kind} href={`/prona?kind=${kind}`} className="hover:opacity-60">
                {KIND_LABELS[kind]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">Shërbimet</p>
        <h2 className="display mt-2 max-w-2xl text-3xl sm:text-4xl">
          Përfaqësim i plotë, nga vlerësimi deri te nënshkrimi
        </h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {services.map((service, index) => (
            <div key={service.title} className="border-t border-line pt-6">
              <span className="font-serif text-2xl text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-3 text-xl">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {service.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand py-20 text-white">
        <div className="container-page text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
            Pronarë
          </p>
          <h2 className="display mx-auto mt-4 max-w-2xl text-3xl sm:text-4xl">
            Dëshironi të shitni ose jepni me qira pronën tuaj?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/80">
            Dërgoni të dhënat dhe një agjent kthen përgjigje brenda 24 orëve, me
            vlerësim dhe plan prezantimi për pronën.
          </p>
          <Link
            href="/kontakt"
            className="btn mt-8 border border-white bg-transparent text-white hover:bg-white hover:text-brand"
          >
            Lësho kërkesë
          </Link>
        </div>
      </section>
    </>
  );
}
