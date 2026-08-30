"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState } from "@/app/admin/form-state";
import { endSession, isAuthenticated, startSession, verifyPassword } from "@/lib/auth";
import { getRepository } from "@/lib/repo";
import { DEALS, KINDS, type PropertyInput } from "@/lib/types";

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { status: "error", message: "Fjalëkalim i pasaktë." };
  }
  await startSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin");
}

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function optionalInt(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalFloat(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseProperty(formData: FormData): PropertyInput | string {
  const title = String(formData.get("title") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const price = optionalFloat(formData.get("price"));
  const deal = DEALS.find((item) => item === formData.get("deal"));
  const kind = KINDS.find((item) => item === formData.get("kind"));

  if (!title || !city || price == null || !deal || !kind) {
    return "Titulli, qyteti, çmimi, transaksioni dhe tipi janë të detyrueshëm.";
  }

  return {
    title,
    description: String(formData.get("description") ?? "").trim(),
    price,
    deal,
    kind,
    city,
    address: String(formData.get("address") ?? "").trim(),
    rooms: optionalInt(formData.get("rooms")) ?? 0,
    baths: optionalInt(formData.get("baths")) ?? 0,
    area: optionalFloat(formData.get("area")) ?? 0,
    floor: optionalInt(formData.get("floor")),
    year: optionalInt(formData.get("year")),
    features: lines(formData.get("features")),
    images: lines(formData.get("images")),
    lat: optionalFloat(formData.get("lat")),
    lng: optionalFloat(formData.get("lng")),
    featured: formData.get("featured") === "on",
    slug: String(formData.get("slug") ?? "").trim(),
  };
}

export async function savePropertyAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAuthenticated())) {
    return { status: "error", message: "Sesioni ka skaduar. Kyçuni përsëri." };
  }

  const parsed = parseProperty(formData);
  if (typeof parsed === "string") {
    return { status: "error", message: parsed };
  }

  const id = String(formData.get("id") ?? "").trim();
  try {
    if (id) {
      await getRepository().update(id, parsed);
    } else {
      await getRepository().create(parsed);
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Ruajtja dështoi.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/prona");
  redirect("/admin");
}

export async function deletePropertyAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = String(formData.get("id") ?? "").trim();
  if (id) await getRepository().remove(id);
  revalidatePath("/admin");
  revalidatePath("/prona");
  redirect("/admin");
}
