import type { Metadata } from "next";
import Link from "next/link";

import { FiltersPanel } from "@/components/filters-panel";
import { PropertyCard } from "@/components/property-card";
import { getRepository } from "@/lib/repo";
import { parseFilters, type RawSearchParams } from "@/lib/search-params";
import { DEAL_LABELS, KIND_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prona në shitje dhe me qira",
  description:
    "Apartamente, shtëpi, vila, troje, lokale dhe zyra në shitje ose me qira — filtro sipas qytetit, çmimit dhe sipërfaqes.",
  alternates: { canonical: "/prona" },
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseFilters(await searchParams);
  const repo = getRepository();
  const [properties, cities] = await Promise.all([
    repo.list(filters),
    repo.cities(),
  ]);

  const activeLabels = [
    filters.deal ? DEAL_LABELS[filters.deal] : null,
    filters.kind ? KIND_LABELS[filters.kind] : null,
    filters.city,
    filters.q ? `“${filters.q}”` : null,
  ].filter(Boolean);

  return (
    <>
      <div className="border-b border-line bg-ivory">
        <div className="container-page py-12 sm:py-16">
          <p className="eyebrow-rule">Portofoli</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl lg:text-6xl">
            {filters.deal ? `Prona ${DEAL_LABELS[filters.deal].toLowerCase()}` : "Të gjitha pronat"}
          </h1>
          <p className="mt-4 text-sm text-slate-600">
            {properties.length} {properties.length === 1 ? "rezultat" : "rezultate"}
            {activeLabels.length > 0 ? ` · ${activeLabels.join(" · ")}` : ""}
          </p>
        </div>
      </div>

    <div className="container-page py-12">
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-52 lg:h-fit">
          <FiltersPanel
            cities={cities}
            filters={filters}
            defaultOpen={activeLabels.length > 0}
          />
          {activeLabels.length > 0 && (
            <Link
              href="/prona"
              className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-widest text-brand hover:opacity-60"
            >
              Fshi filtrat
            </Link>
          )}
        </aside>

        <section>
          {properties.length === 0 ? (
            <div className="card p-8 text-center sm:p-12">
              <p className="display text-2xl">Nuk u gjet asnjë pronë</p>
              <p className="mt-2 text-sm text-slate-600">
                Provoni të zgjeroni kriteret e kërkimit ose kontaktoni agjencinë për
                oferta që nuk publikohen online.
              </p>
              <Link href="/kontakt" className="btn-primary mt-5">
                Kontakto agjencinë
              </Link>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property, index) => (
                <PropertyCard key={property.id} property={property} priority={index < 3} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
}
