import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { applyFilters, slugify } from "@/lib/repo/filter";
import type { PropertyRepository } from "@/lib/repo/types";
import type {
  Inquiry,
  InquiryInput,
  Property,
  PropertyFilters,
  PropertyInput,
} from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const propertiesFile = path.join(dataDir, "properties.json");
const inquiriesFile = path.join(dataDir, "inquiries.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readProperties(): Promise<Property[]> {
  return readJson<Property[]>(propertiesFile, []);
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base || "prona";
  let counter = 2;
  while (taken.has(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

export const localRepository: PropertyRepository = {
  name: "local",

  async list(filters: PropertyFilters = {}) {
    return applyFilters(await readProperties(), filters);
  },

  async featured(limit = 6) {
    const properties = await readProperties();
    const featured = properties.filter((property) => property.featured);
    return applyFilters(featured.length > 0 ? featured : properties).slice(0, limit);
  },

  async bySlug(slug: string) {
    const properties = await readProperties();
    return properties.find((property) => property.slug === slug) ?? null;
  },

  async byId(id: string) {
    const properties = await readProperties();
    return properties.find((property) => property.id === id) ?? null;
  },

  async cities() {
    const properties = await readProperties();
    return [...new Set(properties.map((property) => property.city))].sort((a, b) =>
      a.localeCompare(b),
    );
  },

  async create(input: PropertyInput) {
    const properties = await readProperties();
    const taken = new Set(properties.map((property) => property.slug));
    const property: Property = {
      ...input,
      id: randomUUID(),
      slug: uniqueSlug(slugify(input.slug || input.title), taken),
      createdAt: new Date().toISOString(),
    };
    await writeJson(propertiesFile, [property, ...properties]);
    return property;
  },

  async update(id: string, input: PropertyInput) {
    const properties = await readProperties();
    const index = properties.findIndex((property) => property.id === id);
    if (index === -1) throw new Error(`Prona ${id} nuk u gjet`);
    const taken = new Set(
      properties.filter((_, i) => i !== index).map((property) => property.slug),
    );
    const updated: Property = {
      ...properties[index],
      ...input,
      slug: uniqueSlug(slugify(input.slug || input.title), taken),
    };
    properties[index] = updated;
    await writeJson(propertiesFile, properties);
    return updated;
  },

  async remove(id: string) {
    const properties = await readProperties();
    await writeJson(
      propertiesFile,
      properties.filter((property) => property.id !== id),
    );
  },

  async createInquiry(input: InquiryInput) {
    const inquiries = await readJson<Inquiry[]>(inquiriesFile, []);
    const inquiry: Inquiry = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await writeJson(inquiriesFile, [inquiry, ...inquiries]);
    return inquiry;
  },

  async listInquiries() {
    const inquiries = await readJson<Inquiry[]>(inquiriesFile, []);
    return inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};
