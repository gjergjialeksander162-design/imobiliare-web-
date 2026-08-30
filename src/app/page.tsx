import Link from "next/link";

import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { getRepository } from "@/lib/repo";
import { site } from "@/lib/site";
import { KINDS, KIND_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

const steps = [
  {
    title: "Vlerësim i pronës",
    text: "Vlerësojmë pronën tuaj sipas çmimeve reale të tregut në zonë, pa kosto paraprake.",
  },
  {
    title: "Prezantim profesional",
    text: "Fotografi, planimetri dhe përshkrim i detajuar që publikohen në portalin tonë dhe rrjetet sociale.",
  },
  {
    title: "Negocim & dokumentacion",
    text: "Ndjekim vizitat, negocimin e çmimit dhe të gjithë procesin notarial deri në nënshkrim.",
  },
];

export default async function HomePage() {
  const repo = getRepository();
  const [featured, cities, all] = await Promise.all([
    repo.featured(6),
    repo.cities(),
    repo.list(),
  ]);

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-dark via-brand to-teal-600 py-16 text-white">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light">
            {site.address}
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Gjeni shtëpinë e radhës me {site.name}
          </h1>
          <p className="mt-4 max-w-xl text-base text-teal-50">
            {all.length} prona të verifikuara në {cities.length} qytete — apartamente,
            vila, troje dhe ambiente biznesi.
          </p>

          <div className="mt-8">
            <SearchFilters cities={cities} filters={{}} variant="hero" />
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-wrap gap-3">
          {KINDS.map((kind) => (
            <Link
              key={kind}
              href={`/prona?kind=${kind}`}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
            >
              {KIND_LABELS[kind]}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Prona të zgjedhura</h2>
            <p className="mt-1 text-sm text-slate-600">
              Ofertat më të kërkuara të javës nga portofoli i agjencisë.
            </p>
          </div>
          <Link href="/prona" className="btn-outline shrink-0">
            Shiko të gjitha
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12">
        <div className="container-page">
          <h2 className="text-2xl font-bold">Si punojmë</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="card p-5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-light text-sm font-bold text-brand-dark">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Dëshironi të shitni ose jepni me qira?</h2>
            <p className="mt-1 text-sm text-slate-600">
              Dërgoni të dhënat e pronës dhe një agjent kthen përgjigje brenda 24 orëve.
            </p>
          </div>
          <Link href="/kontakt" className="btn-primary shrink-0">
            Lësho kërkesë
          </Link>
        </div>
      </section>
    </>
  );
}
