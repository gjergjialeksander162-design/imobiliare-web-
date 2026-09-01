import type { CrmRepository } from "@/lib/crm/repo-types";
import type {
  Activity,
  ActivityType,
  Client,
  ClientInput,
  ClientSource,
  CrmTask,
  Lead,
  LeadInput,
  LeadStatus,
  LeadWithClient,
} from "@/lib/crm/types";
import type { Deal, PropertyKind } from "@/lib/types";

interface ClientRow {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: ClientSource;
  notes: string | null;
  created_at: string;
}

interface LeadRow {
  id: string;
  client_id: string;
  property_id: string | null;
  status: LeadStatus;
  deal: Deal | null;
  kind: PropertyKind | null;
  city: string | null;
  budget_min: number | null;
  budget_max: number | null;
  min_rooms: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ActivityRow {
  id: string;
  lead_id: string;
  type: ActivityType;
  note: string | null;
  created_at: string;
}

interface TaskRow {
  id: string;
  lead_id: string;
  title: string;
  due_at: string | null;
  done: boolean;
  created_at: string;
}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("CRM kërkon Supabase të konfiguruar.");
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function request<T>(pathAndQuery: string, init: RequestInit = {}): Promise<T> {
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

function toClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    email: row.email ?? "",
    source: row.source,
    notes: row.notes ?? "",
    createdAt: row.created_at,
  };
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    clientId: row.client_id,
    propertyId: row.property_id,
    status: row.status,
    deal: row.deal,
    kind: row.kind,
    city: row.city ?? "",
    budgetMin: row.budget_min == null ? null : Number(row.budget_min),
    budgetMax: row.budget_max == null ? null : Number(row.budget_max),
    minRooms: row.min_rooms,
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type,
    note: row.note ?? "",
    createdAt: row.created_at,
  };
}

function toTask(row: TaskRow): CrmTask {
  return {
    id: row.id,
    leadId: row.lead_id,
    title: row.title,
    dueAt: row.due_at,
    done: row.done,
    createdAt: row.created_at,
  };
}

function clientRow(input: ClientInput) {
  return {
    name: input.name,
    phone: input.phone,
    email: input.email,
    source: input.source,
    notes: input.notes,
  };
}

function leadRow(input: Partial<LeadInput>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.clientId !== undefined) row.client_id = input.clientId;
  if (input.propertyId !== undefined) row.property_id = input.propertyId;
  if (input.status !== undefined) row.status = input.status;
  if (input.deal !== undefined) row.deal = input.deal;
  if (input.kind !== undefined) row.kind = input.kind;
  if (input.city !== undefined) row.city = input.city;
  if (input.budgetMin !== undefined) row.budget_min = input.budgetMin;
  if (input.budgetMax !== undefined) row.budget_max = input.budgetMax;
  if (input.minRooms !== undefined) row.min_rooms = input.minRooms;
  if (input.notes !== undefined) row.notes = input.notes;
  return row;
}

type LeadRowWithClient = LeadRow & { clients: ClientRow };

function toLeadWithClient(row: LeadRowWithClient): LeadWithClient {
  return { ...toLead(row), client: toClient(row.clients) };
}

export const supabaseCrm: CrmRepository = {
  name: "supabase",

  async listClients() {
    const rows = await request<ClientRow[]>("clients?select=*&order=created_at.desc");
    return rows.map(toClient);
  },

  async clientById(id) {
    const rows = await request<ClientRow[]>(
      `clients?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
    );
    return rows[0] ? toClient(rows[0]) : null;
  },

  async createClient(input) {
    const rows = await request<ClientRow[]>("clients", {
      method: "POST",
      body: JSON.stringify(clientRow(input)),
    });
    return toClient(rows[0]);
  },

  async updateClient(id, input) {
    const rows = await request<ClientRow[]>(`clients?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(clientRow(input)),
    });
    return toClient(rows[0]);
  },

  async removeClient(id) {
    await request(`clients?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  async listLeads() {
    const rows = await request<LeadRowWithClient[]>(
      "leads?select=*,clients(*)&order=created_at.desc",
    );
    return rows.map(toLeadWithClient);
  },

  async leadById(id) {
    const rows = await request<LeadRowWithClient[]>(
      `leads?select=*,clients(*)&id=eq.${encodeURIComponent(id)}&limit=1`,
    );
    return rows[0] ? toLeadWithClient(rows[0]) : null;
  },

  async leadsByClient(clientId) {
    const rows = await request<LeadRow[]>(
      `leads?select=*&client_id=eq.${encodeURIComponent(clientId)}&order=created_at.desc`,
    );
    return rows.map(toLead);
  },

  async createLead(input) {
    const rows = await request<LeadRow[]>("leads", {
      method: "POST",
      body: JSON.stringify(leadRow(input)),
    });
    return toLead(rows[0]);
  },

  async updateLead(id, input) {
    const rows = await request<LeadRow[]>(`leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(leadRow(input)),
    });
    return toLead(rows[0]);
  },

  async setLeadStatus(id, status) {
    await request(`leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
    });
  },

  async removeLead(id) {
    await request(`leads?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  async listActivities(leadId) {
    const rows = await request<ActivityRow[]>(
      `activities?select=*&lead_id=eq.${encodeURIComponent(leadId)}&order=created_at.desc`,
    );
    return rows.map(toActivity);
  },

  async createActivity(input) {
    const rows = await request<ActivityRow[]>("activities", {
      method: "POST",
      body: JSON.stringify({
        lead_id: input.leadId,
        type: input.type,
        note: input.note,
      }),
    });
    return toActivity(rows[0]);
  },

  async listTasks(options = {}) {
    const params = new URLSearchParams({ select: "*", order: "due_at.asc" });
    if (options.leadId) params.append("lead_id", `eq.${options.leadId}`);
    if (options.onlyOpen) params.append("done", "is.false");
    const rows = await request<TaskRow[]>(`crm_tasks?${params.toString()}`);
    return rows.map(toTask);
  },

  async createTask(input) {
    const rows = await request<TaskRow[]>("crm_tasks", {
      method: "POST",
      body: JSON.stringify({
        lead_id: input.leadId,
        title: input.title,
        due_at: input.dueAt,
        done: input.done,
      }),
    });
    return toTask(rows[0]);
  },

  async setTaskDone(id, done) {
    await request(`crm_tasks?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ done }),
    });
  },

  async removeTask(id) {
    await request(`crm_tasks?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
