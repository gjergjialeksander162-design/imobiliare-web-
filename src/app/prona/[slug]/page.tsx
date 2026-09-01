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
    <div className="container-page py-10">
      <nav className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        <Link href="/" className="hover:text-brand">
          Kryefaqja
        </Link>{" "}
        /{" "}
        <Link href="/prona" className="hover:text-brand">
          Prona
        </Link>{" "}
        / <span className="text-slate-700">{property.title}</span>
      </nav>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Gallery images={property.images} alt={property.title} />

          <div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              <span className="text-brand">{DEAL_LABELS[property.deal]}</span>
              <span>Publikuar më {formatDate(property.createdAt)}</span>
            </div>
            <h1 className="display mt-4 text-3xl sm:text-4xl">{property.title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {property.address ? `${property.address}, ` : ""}
              {property.city}
            </p>
            <p className="mt-4 font-serif text-4xl text-brand">
              {formatPrice(property.price, property.deal)}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-white p-5">
                <dt className="text-[11px] uppercase tracking-widest text-slate-500">
                  {spec.label}
                </dt>
                <dd className="mt-1 font-serif text-xl">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h2 className="display text-2xl">Përshkrimi</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {property.description}
            </p>
          </section>

          {property.features.length > 0 && (
            <section>
              <h2 className="display text-2xl">Karakteristika</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {property.features.map((feature) => (
                  <li
                    key={feature}
                    className="border border-line px-3 py-1.5 text-xs uppercase tracking-wider text-slate-600"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {mapSrc && (
            <section>
              <h2 className="display text-2xl">Lokacioni</h2>
              <iframe
                title={`Harta e ${property.title}`}
                src={mapSrc}
                loading="lazy"
                className="mt-4 h-80 w-full border border-line"
              />
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-40 lg:h-fit">
          <div className="card space-y-4 p-6">
            <div>
              <h2 className="display text-xl">Interesuar për këtë pronë?</h2>
              <p className="mt-2 text-sm text-slate-600">
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
        <section className="mt-20 border-t border-line pt-10">
          <h2 className="display text-3xl">Prona të ngjashme në {property.city}</h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
