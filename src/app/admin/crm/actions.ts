"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";
import { getCrm } from "@/lib/crm";
import {
  ACTIVITY_TYPES,
  CLIENT_SOURCES,
  LEAD_STATUSES,
  type ActivityType,
  type LeadStatus,
} from "@/lib/crm/types";
import { DEALS, KINDS, type Deal, type PropertyKind } from "@/lib/types";

async function guard(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
}

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalNumber(formData: FormData, key: string): number | null {
  const raw = text(formData, key);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function refresh(clientId?: string): void {
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/klientet");
  revalidatePath("/admin/crm/detyrat");
  revalidatePath("/admin/crm/raporte");
  if (clientId) revalidatePath(`/admin/crm/klientet/${clientId}`);
}

export async function createClientAction(formData: FormData): Promise<void> {
  await guard();
  const name = text(formData, "name");
  if (!name) redirect("/admin/crm/klientet?error=emri");

  const source =
    CLIENT_SOURCES.find((item) => item === text(formData, "source")) ?? "web";

  const client = await getCrm().createClient({
    name,
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    source,
    notes: text(formData, "notes"),
  });

  refresh(client.id);
  redirect(`/admin/crm/klientet/${client.id}`);
}

export async function updateClientAction(formData: FormData): Promise<void> {
  await guard();
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!id || !name) redirect("/admin/crm/klientet");

  const source =
    CLIENT_SOURCES.find((item) => item === text(formData, "source")) ?? "web";

  await getCrm().updateClient(id, {
    name,
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    source,
    notes: text(formData, "notes"),
  });

  refresh(id);
  redirect(`/admin/crm/klientet/${id}`);
}

export async function deleteClientAction(formData: FormData): Promise<void> {
  await guard();
  const id = text(formData, "id");
  if (id) await getCrm().removeClient(id);
  refresh();
  redirect("/admin/crm/klientet");
}

export async function createLeadAction(formData: FormData): Promise<void> {
  await guard();
  const clientId = text(formData, "clientId");
  if (!clientId) redirect("/admin/crm/klientet");

  const status: LeadStatus =
    LEAD_STATUSES.find((item) => item === text(formData, "status")) ?? "i_re";
  const deal: Deal | null = DEALS.find((item) => item === text(formData, "deal")) ?? null;
  const kind: PropertyKind | null =
    KINDS.find((item) => item === text(formData, "kind")) ?? null;

  await getCrm().createLead({
    clientId,
    propertyId: text(formData, "propertyId") || null,
    status,
    deal,
    kind,
    city: text(formData, "city"),
    budgetMin: optionalNumber(formData, "budgetMin"),
    budgetMax: optionalNumber(formData, "budgetMax"),
    minRooms: optionalNumber(formData, "minRooms"),
    notes: text(formData, "notes"),
  });

  refresh(clientId);
  redirect(`/admin/crm/klientet/${clientId}`);
}

export async function updateLeadStatusAction(formData: FormData): Promise<void> {
  await guard();
  const id = text(formData, "id");
  const status = LEAD_STATUSES.find((item) => item === text(formData, "status"));
  if (id && status) await getCrm().setLeadStatus(id, status);
  refresh(text(formData, "clientId") || undefined);
  redirect(text(formData, "redirectTo") || "/admin/crm");
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await guard();
  const id = text(formData, "id");
  if (id) await getCrm().removeLead(id);
  const clientId = text(formData, "clientId");
  refresh(clientId || undefined);
  redirect(clientId ? `/admin/crm/klientet/${clientId}` : "/admin/crm");
}

export async function createActivityAction(formData: FormData): Promise<void> {
  await guard();
  const leadId = text(formData, "leadId");
  const note = text(formData, "note");
  const type: ActivityType =
    ACTIVITY_TYPES.find((item) => item === text(formData, "type")) ?? "shenim";
  if (leadId && note) await getCrm().createActivity({ leadId, type, note });
  const clientId = text(formData, "clientId");
  refresh(clientId || undefined);
  redirect(clientId ? `/admin/crm/klientet/${clientId}` : "/admin/crm");
}

export async function createTaskAction(formData: FormData): Promise<void> {
  await guard();
  const leadId = text(formData, "leadId");
  const title = text(formData, "title");
  const due = text(formData, "dueAt");
  if (leadId && title) {
    await getCrm().createTask({
      leadId,
      title,
      dueAt: due ? new Date(due).toISOString() : null,
      done: false,
    });
  }
  const clientId = text(formData, "clientId");
  refresh(clientId || undefined);
  redirect(text(formData, "redirectTo") || "/admin/crm/detyrat");
}

export async function toggleTaskAction(formData: FormData): Promise<void> {
  await guard();
  const id = text(formData, "id");
  if (id) await getCrm().setTaskDone(id, text(formData, "done") !== "true");
  refresh(text(formData, "clientId") || undefined);
  redirect(text(formData, "redirectTo") || "/admin/crm/detyrat");
}

export async function deleteTaskAction(formData: FormData): Promise<void> {
  await guard();
  const id = text(formData, "id");
  if (id) await getCrm().removeTask(id);
  refresh(text(formData, "clientId") || undefined);
  redirect(text(formData, "redirectTo") || "/admin/crm/detyrat");
}
