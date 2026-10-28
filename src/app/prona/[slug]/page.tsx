import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact-form";
import { Gallery } from "@/components/gallery";
import { MobileActions } from "@/components/mobile-actions";
import { PropertyCard } from "@/components/property-card";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { getRepository } from "@/lib/repo";
import { site } from "@/lib/site";
import { DEAL_LABELS, KIND_LABELS, type Property } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getRepository().bySlug(slug);
  if (!property) return { title: "Prona nuk u gjet", robots: { index: false } };
  const description = propertyDescription(property);
  const image = property.images[0];
  return {
    title: property.title,
    description,
    alternates: { canonical: `/prona/${property.slug}` },
    openGraph: {
      type: "article",
      title: property.title,
      description,
      url: `/prona/${property.slug}`,
      images: image ? [{ url: image, alt: property.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: property.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function propertyDescription(property: Property): string {
  if (property.description.trim()) return property.description.trim().slice(0, 160);
  const parts = [
    `${KIND_LABELS[property.kind]} ${DEAL_LABELS[property.deal].toLowerCase()} në ${property.city}`,
    property.area > 0 ? `${formatNumber(property.area)} m²` : "",
    property.rooms > 0 ? `${property.rooms} dhoma` : "",
    formatPrice(property.price, property.deal),
  ].filter(Boolean);
  return `${parts.join(", ")}. ${site.name}.`;
}

function propertyJsonLd(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: propertyDescription(property),
    url: `${site.url}/prona/${property.slug}`,
    image: property.images,
    datePosted: property.createdAt,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "EUR",
      businessFunction:
        property.deal === "qira"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address || undefined,
      addressLocality: property.city,
    },
    ...(property.lat != null && property.lng != null
      ? { geo: { "@type": "GeoCoordinates", latitude: property.lat, longitude: property.lng } }
      : {}),
    floorSize:
      property.area > 0
        ? { "@type": "QuantitativeValue", value: property.area, unitCode: "MTK" }
        : undefined,
    numberOfRooms: property.rooms > 0 ? property.rooms : undefined,
    provider: { "@type": "RealEstateAgent", name: site.name, telephone: site.phone, url: site.url },
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
    <div className="container-page py-10 pb-28 lg:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd(property)) }}
      />
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

      <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-8">
          <Gallery images={property.images} alt={property.title} />

          <div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              <span className="text-brand">{DEAL_LABELS[property.deal]}</span>
              <span>Publikuar më {formatDate(property.createdAt)}</span>
            </div>
            <h1 className="display mt-4 break-words text-3xl sm:text-4xl">
              {property.title}
            </h1>
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

          {property.description.trim() && (
            <section>
              <h2 className="display text-2xl">Përshkrimi</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {property.description}
              </p>
            </section>
          )}

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
                className="mt-4 h-64 w-full border border-line sm:h-80"
              />
            </section>
          )}
        </div>

        <aside id="kontakt-prone" className="scroll-mt-40 lg:sticky lg:top-52 lg:h-fit">
          <div className="card space-y-4 p-5 sm:p-6">
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

      <MobileActions phone={site.phone} />
    </div>
  );
}
