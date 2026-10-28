import type { MetadataRoute } from "next";

import { getRepository } from "@/lib/repo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/prona`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/prona?deal=shitje`, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/prona?deal=qira`, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/rreth-nesh`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/kontakt`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let properties: MetadataRoute.Sitemap = [];
  try {
    properties = (await getRepository().list()).map((property) => ({
      url: `${site.url}/prona/${property.slug}`,
      lastModified: new Date(property.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    properties = [];
  }

  return [...staticPages, ...properties];
}
