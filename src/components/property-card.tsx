import Image from "next/image";
import Link from "next/link";

import { IconArea, IconBath, IconBed } from "@/components/icons";
import { formatNumber, formatPrice } from "@/lib/format";
import { DEAL_LABELS, KIND_LABELS, type Property } from "@/lib/types";

export function PropertyCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
  const cover = property.images[0] ?? "/images/prona-1.svg";

  return (
    <Link href={`/prona/${property.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={cover}
          alt={property.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent opacity-80 transition duration-500 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand">
          {DEAL_LABELS[property.deal]}
        </span>
        <p className="absolute bottom-4 left-4 font-serif text-2xl text-white drop-shadow">
          {formatPrice(property.price, property.deal)}
        </p>
      </div>

      <div className="pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-dark">
          {KIND_LABELS[property.kind]} · {property.city}
        </p>
        <h3 className="display mt-2 text-xl leading-snug transition-colors group-hover:text-gold-dark">
          {property.title}
        </h3>
        {property.address && (
          <p className="mt-1 text-sm text-slate-500">{property.address}</p>
        )}
        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3 text-xs text-slate-600">
          {property.area > 0 && (
            <li className="inline-flex items-center gap-1.5">
              <IconArea className="text-gold-dark" /> {formatNumber(property.area)} m²
            </li>
          )}
          {property.rooms > 0 && (
            <li className="inline-flex items-center gap-1.5">
              <IconBed className="text-gold-dark" /> {property.rooms} dhoma
            </li>
          )}
          {property.baths > 0 && (
            <li className="inline-flex items-center gap-1.5">
              <IconBath className="text-gold-dark" /> {property.baths} banjo
            </li>
          )}
        </ul>
        <span className="mt-3 block h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
      </div>
    </Link>
  );
}
