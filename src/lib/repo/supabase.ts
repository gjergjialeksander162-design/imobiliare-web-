import { slugify } from "@/lib/repo/filter";
import type { PropertyRepository } from "@/lib/repo/types";
import type {
  Deal,
  InquiryInput,
  Property,
  PropertyFilters,
  PropertyInput,
  PropertyKind,
} from "@/lib/types";

interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  deal: Deal;
  kind: PropertyKind;
  city: string;
  address: string | null;
  rooms: number | null;
  baths: number | null;
  area: number | null;
  floor: number | null;
  year: number | null;
  features: string[] | null;
  images: string[] | null;
  lat: number | null;
  lng: number | null;
  featured: boolean | null;
  created_at: string;
}

interface InquiryRow {
  id: string;
  property_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  created_at: string;
}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase nuk është konfiguruar: mungon NEXT_PUBLIC_SUPABASE_URL ose çelësi.",
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function request<T>(
  pathAndQuery: string,
  init: RequestInit = {},
): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${pathAndQuery}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Supabase ${response.status}: ${await response.text().catch(() => "")}`,
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function toProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    price: Number(row.price),
    deal: row.deal,
    kind: row.kind,
    city: row.city,
    address: row.address ?? "",
    rooms: row.rooms ?? 0,
    baths: row.baths ?? 0,
    area: row.area ?? 0,
    floor: row.floor,
    year: row.year,
    features: row.features ?? [],
    images: row.images ?? [],
    lat: row.lat,
    lng: row.lng,
    featured: row.featured ?? false,
    createdAt: row.created_at,
  };
}

function toRow(input: PropertyInput): Omit<PropertyRow, "id" | "created_at"> {
  return {
    slug: slugify(input.slug || input.title),
    title: input.title,
    description: input.description,
    price: input.price,
    deal: input.deal,
    kind: input.kind,
    city: input.city,
    address: input.address,
    rooms: input.rooms,
    baths: input.baths,
    area: input.area,
    floor: input.floor,
    year: input.year,
    features: input.features,
    images: input.images,
    lat: input.lat,
    lng: input.lng,
    featured: input.featured,
  };
}

function query(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  params.set("select", "*");
  if (filters.city) params.append("city", `eq.${filters.city}`);
  if (filters.kind) params.append("kind", `eq.${filters.kind}`);
  if (filters.deal) params.append("deal", `eq.${filters.deal}`);
  if (filters.minPrice != null) params.append("price", `gte.${filters.minPrice}`);
  if (filters.maxPrice != null) params.append("price", `lte.${filters.maxPrice}`);
  if (filters.minRooms != null) params.append("rooms", `gte.${filters.minRooms}`);
  if (filters.minArea != null) params.append("area", `gte.${filters.minArea}`);
  if (filters.q) {
    const term = filters.q.replace(/[(),*]/g, " ").trim();
    if (term) {
      params.set(
        "or",
        `(title.ilike.*${term}*,description.ilike.*${term}*,city.ilike.*${term}*,address.ilike.*${term}*)`,
      );
    }
  }
  switch (filters.sort) {
    case "price-asc":
      params.set("order", "price.asc");
      break;
    case "price-desc":
      params.set("order", "price.desc");
      break;
    default:
      params.set("order", "created_at.desc");
  }
  return params.toString();
}

export const supabaseRepository: PropertyRepository = {
  name: "supabase",

  async list(filters: PropertyFilters = {}) {
    const rows = await request<PropertyRow[]>(`properties?${query(filters)}`);
    return rows.map(toProperty);
  },

  async featured(limit = 6) {
    const rows = await request<PropertyRow[]>(
      `properties?select=*&featured=is.true&order=created_at.desc&limit=${limit}`,
    );
    if (rows.length > 0) return rows.map(toProperty);
    const latest = await request<PropertyRow[]>(
      `properties?select=*&order=created_at.desc&limit=${limit}`,
    );
    return latest.map(toProperty);
  },

  async bySlug(slug: string) {
    const rows = await request<PropertyRow[]>(
      `properties?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    );
    return rows[0] ? toProperty(rows[0]) : null;
  },

  async byId(id: string) {
    const rows = await request<PropertyRow[]>(
      `properties?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
    );
    return rows[0] ? toProperty(rows[0]) : null;
  },

  async cities() {
    const rows = await request<Pick<PropertyRow, "city">[]>(
      "properties?select=city&order=city.asc",
    );
    return [...new Set(rows.map((row) => row.city))];
  },

  async create(input: PropertyInput) {
    const rows = await request<PropertyRow[]>("properties", {
      method: "POST",
      body: JSON.stringify(toRow(input)),
    });
    return toProperty(rows[0]);
  },

  async update(id: string, input: PropertyInput) {
    const rows = await request<PropertyRow[]>(
      `properties?id=eq.${encodeURIComponent(id)}`,
      { method: "PATCH", body: JSON.stringify(toRow(input)) },
    );
    return toProperty(rows[0]);
  },

  async remove(id: string) {
    await request<PropertyRow[]>(`properties?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  async createInquiry(input: InquiryInput) {
    const rows = await request<InquiryRow[]>("inquiries", {
      method: "POST",
      body: JSON.stringify({
        property_id: input.propertyId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
      }),
    });
    const row = rows[0];
    return {
      id: row.id,
      propertyId: row.property_id,
      name: row.name,
      email: row.email ?? "",
      phone: row.phone ?? "",
      message: row.message,
      createdAt: row.created_at,
    };
  },

  async listInquiries() {
    const rows = await request<InquiryRow[]>(
      "inquiries?select=*&order=created_at.desc",
    );
    return rows.map((row) => ({
      id: row.id,
      propertyId: row.property_id,
      name: row.name,
      email: row.email ?? "",
      phone: row.phone ?? "",
      message: row.message,
      createdAt: row.created_at,
    }));
  },
};
