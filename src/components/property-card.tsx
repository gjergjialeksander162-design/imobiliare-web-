import Image from "next/image";
import Link from "next/link";

import { formatNumber, formatPrice } from "@/lib/format";
import { DEAL_LABELS, KIND_LABELS, type Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const cover = property.images[0] ?? "/images/prona-1.svg";

  const specs = [
    `${formatNumber(property.area)} m²`,
    property.rooms > 0 ? `${property.rooms} dhoma` : "",
    property.baths > 0 ? `${property.baths} banjo` : "",
  ].filter(Boolean);

  return (
    <Link href={`/prona/${property.slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden bg-sand">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          {DEAL_LABELS[property.deal]} · {KIND_LABELS[property.kind]}
        </p>
        <h3 className="display mt-2 text-xl group-hover:text-brand">{property.title}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {property.address ? `${property.address}, ` : ""}
          {property.city}
        </p>
        <p className="mt-3 font-serif text-2xl text-brand">
          {formatPrice(property.price, property.deal)}
        </p>
        <p className="mt-3 border-t border-line pt-3 text-xs uppercase tracking-wider text-slate-500">
          {specs.join(" · ")}
        </p>
      </div>
    </Link>
  );
}
