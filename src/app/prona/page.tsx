import type { Metadata } from "next";
import Link from "next/link";

import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { getRepository } from "@/lib/repo";
import { parseFilters, type RawSearchParams } from "@/lib/search-params";
import { DEAL_LABELS, KIND_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prona në shitje dhe me qira",
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
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Prona</h1>
      <p className="mt-2 text-sm text-slate-600">
        {properties.length} rezultate
        {activeLabels.length > 0 ? ` · ${activeLabels.join(" · ")}` : ""}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <SearchFilters cities={cities} filters={filters} />
          {activeLabels.length > 0 && (
            <Link
              href="/prona"
              className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
            >
              Fshi filtrat
            </Link>
          )}
        </aside>

        <section>
          {properties.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-base font-semibold">Nuk u gjet asnjë pronë</p>
              <p className="mt-2 text-sm text-slate-600">
                Provoni të zgjeroni kriteret e kërkimit ose kontaktoni agjencinë për
                oferta që nuk publikohen online.
              </p>
              <Link href="/kontakt" className="btn-primary mt-5">
                Kontakto agjencinë
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
