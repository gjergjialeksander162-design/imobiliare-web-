import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact-form";
import { Gallery } from "@/components/gallery";
import { PropertyCard } from "@/components/property-card";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { getRepository } from "@/lib/repo";
import { site } from "@/lib/site";
import { DEAL_LABELS, KIND_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getRepository().bySlug(slug);
  if (!property) return { title: "Prona nuk u gjet" };
  return {
    title: property.title,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const repo = getRepository();
  const property = await repo.bySlug(slug);
  if (!property) notFound();

  const similar = (await repo.list({ city: property.city, deal: property.deal }))
    .filter((item) => item.id !== property.id)
    .slice(0, 3);

  const specs = [
    { label: "Sipërfaqe", value: `${formatNumber(property.area)} m²` },
    { label: "Dhoma", value: property.rooms > 0 ? String(property.rooms) : "—" },
    { label: "Banjo", value: property.baths > 0 ? String(property.baths) : "—" },
    { label: "Kati", value: property.floor != null ? String(property.floor) : "—" },
    { label: "Viti", value: property.year != null ? String(property.year) : "—" },
    { label: "Tipi", value: KIND_LABELS[property.kind] },
  ];

  const mapSrc =
    property.lat != null && property.lng != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${property.lng - 0.01}%2C${property.lat - 0.008}%2C${property.lng + 0.01}%2C${property.lat + 0.008}&layer=mapnik&marker=${property.lat}%2C${property.lng}`
      : null;

  return (
    <div className="container-page py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-brand">
          Kryefaqja
        </Link>{" "}
        /{" "}
        <Link href="/prona" className="hover:text-brand">
          Prona
        </Link>{" "}
        / <span className="text-slate-700">{property.title}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Gallery images={property.images} alt={property.title} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-brand-light px-2 py-1 text-xs font-semibold text-brand-dark">
                {DEAL_LABELS[property.deal]}
              </span>
              <span className="text-xs text-slate-500">
                Publikuar më {formatDate(property.createdAt)}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{property.title}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {property.address ? `${property.address}, ` : ""}
              {property.city}
            </p>
            <p className="mt-3 text-3xl font-bold text-brand">
              {formatPrice(property.price, property.deal)}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-white p-4">
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h2 className="text-lg font-bold">Përshkrimi</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {property.description}
            </p>
          </section>

          {property.features.length > 0 && (
            <section>
              <h2 className="text-lg font-bold">Karakteristika</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {property.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {mapSrc && (
            <section>
              <h2 className="text-lg font-bold">Lokacioni</h2>
              <iframe
                title={`Harta e ${property.title}`}
                src={mapSrc}
                loading="lazy"
                className="mt-3 h-72 w-full rounded-xl border border-slate-200"
              />
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card space-y-4 p-5">
            <div>
              <h2 className="text-base font-bold">Interesuar për këtë pronë?</h2>
              <p className="mt-1 text-sm text-slate-600">
                Telefononi {site.phone} ose dërgoni kërkesën më poshtë.
              </p>
            </div>
            <ContactForm
              propertyId={property.id}
              defaultMessage={`Përshëndetje, dua më shumë informacion për pronën “${property.title}”.`}
            />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold">Prona të ngjashme në {property.city}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
