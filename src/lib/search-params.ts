import { DEALS, KINDS, type PropertyFilters } from "@/lib/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

function num(value: string | string[] | undefined): number | undefined {
  const raw = first(value);
  if (raw === undefined) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFilters(params: RawSearchParams): PropertyFilters {
  const deal = first(params.deal);
  const kind = first(params.kind);
  const sort = first(params.sort);
  return {
    q: first(params.q),
    city: first(params.city),
    deal: DEALS.find((item) => item === deal),
    kind: KINDS.find((item) => item === kind),
    minPrice: num(params.minPrice),
    maxPrice: num(params.maxPrice),
    minRooms: num(params.minRooms),
    minArea: num(params.minArea),
    sort:
      sort === "price-asc" || sort === "price-desc" || sort === "newest"
        ? sort
        : undefined,
  };
}
