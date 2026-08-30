export type Deal = "shitje" | "qira";

export type PropertyKind =
  | "apartament"
  | "shtepi"
  | "vile"
  | "truall"
  | "lokal"
  | "zyre";

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  deal: Deal;
  kind: PropertyKind;
  city: string;
  address: string;
  rooms: number;
  baths: number;
  area: number;
  floor: number | null;
  year: number | null;
  features: string[];
  images: string[];
  lat: number | null;
  lng: number | null;
  featured: boolean;
  createdAt: string;
}

export type PropertyInput = Omit<Property, "id" | "slug" | "createdAt"> &
  Partial<Pick<Property, "slug">>;

export interface PropertyFilters {
  q?: string;
  city?: string;
  kind?: PropertyKind;
  deal?: Deal;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  minArea?: number;
  sort?: "newest" | "price-asc" | "price-desc";
}

export interface Inquiry {
  id: string;
  propertyId: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export type InquiryInput = Omit<Inquiry, "id" | "createdAt">;

export const DEALS: Deal[] = ["shitje", "qira"];

export const KINDS: PropertyKind[] = [
  "apartament",
  "shtepi",
  "vile",
  "truall",
  "lokal",
  "zyre",
];

export const KIND_LABELS: Record<PropertyKind, string> = {
  apartament: "Apartament",
  shtepi: "Shtëpi",
  vile: "Vilë",
  truall: "Truall",
  lokal: "Lokal",
  zyre: "Zyrë",
};

export const DEAL_LABELS: Record<Deal, string> = {
  shitje: "Në shitje",
  qira: "Me qira",
};
