import { randomUUID } from "node:crypto";

import { slugify } from "@/lib/repo/filter";

const BUCKET = "property-images";
const MAX_BYTES = 8 * 1024 * 1024;

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Ngarkimi i fotove kërkon Supabase (NEXT_PUBLIC_SUPABASE_URL dhe SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

export async function uploadPropertyImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`Skedari "${file.name}" nuk është foto.`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`Foto "${file.name}" e kalon kufirin prej 8 MB.`);
  }

  const { url, key } = config();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "foto";
  const path = `${new Date().getFullYear()}/${randomUUID()}-${base}.${extension}`;

  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: await file.arrayBuffer(),
  });

  if (!response.ok) {
    throw new Error(
      `Ngarkimi dështoi (${response.status}): ${await response.text().catch(() => "")}`,
    );
  }

  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}
