import type { Property, PropertyFilters } from "@/lib/types";

export function slugify(value: string): string {
  const map: Record<string, string> = {
    ë: "e",
    ç: "c",
    Ë: "e",
    Ç: "c",
  };
  return value
    .replace(/[ëçËÇ]/g, (c) => map[c])
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function matches(property: Property, filters: PropertyFilters): boolean {
  if (filters.city && property.city !== filters.city) return false;
  if (filters.kind && property.kind !== filters.kind) return false;
  if (filters.deal && property.deal !== filters.deal) return false;
  if (filters.minPrice != null && property.price < filters.minPrice) return false;
  if (filters.maxPrice != null && property.price > filters.maxPrice) return false;
  if (filters.minRooms != null && property.rooms < filters.minRooms) return false;
  if (filters.minArea != null && property.area < filters.minArea) return false;
  if (filters.q) {
    const needle = filters.q.toLowerCase();
    const haystack = [
      property.title,
      property.description,
      property.city,
      property.address,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function applyFilters(
  properties: Property[],
  filters: PropertyFilters = {},
): Property[] {
  const result = properties.filter((property) => matches(property, filters));
  switch (filters.sort) {
    case "price-asc":
      return result.sort((a, b) => a.price - b.price);
    case "price-desc":
      return result.sort((a, b) => b.price - a.price);
    default:
      return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
