import Image from "next/image";
import Link from "next/link";

import { formatNumber, formatPrice } from "@/lib/format";
import { DEAL_LABELS, KIND_LABELS, type Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const cover = property.images[0] ?? "/images/prona-1.svg";

  return (
    <Link
      href={`/prona/${property.slug}`}
      className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-brand">
          {DEAL_LABELS[property.deal]}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-lg font-bold text-brand">
            {formatPrice(property.price, property.deal)}
          </p>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {KIND_LABELS[property.kind]}
          </span>
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {property.title}
        </h3>

        <p className="text-xs text-slate-500">
          {property.city}
          {property.address ? ` · ${property.address}` : ""}
        </p>

        <dl className="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <div className="flex gap-1">
            <dt className="text-slate-400">Sipërfaqe</dt>
            <dd className="font-semibold">{formatNumber(property.area)} m²</dd>
          </div>
          {property.rooms > 0 && (
            <div className="flex gap-1">
              <dt className="text-slate-400">Dhoma</dt>
              <dd className="font-semibold">{property.rooms}</dd>
            </div>
          )}
          {property.baths > 0 && (
            <div className="flex gap-1">
              <dt className="text-slate-400">Banjo</dt>
              <dd className="font-semibold">{property.baths}</dd>
            </div>
          )}
        </dl>
      </div>
    </Link>
  );
}
