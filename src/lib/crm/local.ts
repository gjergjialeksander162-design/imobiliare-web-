import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CrmRepository } from "@/lib/crm/repo-types";
import type {
  Activity,
  ActivityInput,
  Client,
  ClientInput,
  CrmTask,
  CrmTaskInput,
  Lead,
  LeadInput,
  LeadStatus,
  LeadWithClient,
} from "@/lib/crm/types";

const dataDir = path.join(process.cwd(), "data");
const files = {
  clients: path.join(dataDir, "clients.json"),
  leads: path.join(dataDir, "leads.json"),
  activities: path.join(dataDir, "activities.json"),
  tasks: path.join(dataDir, "crm-tasks.json"),
};

async function readJson<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T[];
  } catch {
    return [];
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const newest = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);

async function withClients(leads: Lead[]): Promise<LeadWithClient[]> {
  const clients = await readJson<Client>(files.clients);
  return leads
    .map((lead) => {
      const client = clients.find((item) => item.id === lead.clientId);
      return client ? { ...lead, client } : null;
    })
    .filter((lead): lead is LeadWithClient => lead !== null);
}

export const localCrm: CrmRepository = {
  name: "local",

  async listClients() {
    return (await readJson<Client>(files.clients)).sort(newest);
  },

  async clientById(id) {
    const clients = await readJson<Client>(files.clients);
    return clients.find((client) => client.id === id) ?? null;
  },

  async createClient(input: ClientInput) {
    const clients = await readJson<Client>(files.clients);
    const client: Client = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    await writeJson(files.clients, [client, ...clients]);
    return client;
  },

  async updateClient(id, input) {
    const clients = await readJson<Client>(files.clients);
    const index = clients.findIndex((client) => client.id === id);
    if (index === -1) throw new Error(`Klienti ${id} nuk u gjet`);
    clients[index] = { ...clients[index], ...input };
    await writeJson(files.clients, clients);
    return clients[index];
  },

  async removeClient(id) {
    const clients = await readJson<Client>(files.clients);
    await writeJson(
      files.clients,
      clients.filter((client) => client.id !== id),
    );
    const leads = await readJson<Lead>(files.leads);
    await writeJson(
      files.leads,
      leads.filter((lead) => lead.clientId !== id),
    );
  },

  async listLeads() {
    const leads = (await readJson<Lead>(files.leads)).sort(newest);
    return withClients(leads);
  },

  async leadById(id) {
    const leads = await readJson<Lead>(files.leads);
    const lead = leads.find((item) => item.id === id);
    if (!lead) return null;
    return (await withClients([lead]))[0] ?? null;
  },

  async leadsByClient(clientId) {
    const leads = await readJson<Lead>(files.leads);
    return leads.filter((lead) => lead.clientId === clientId).sort(newest);
  },

  async createLead(input: LeadInput) {
    const leads = await readJson<Lead>(files.leads);
    const now = new Date().toISOString();
    const lead: Lead = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };
    await writeJson(files.leads, [lead, ...leads]);
    return lead;
  },

  async updateLead(id, input) {
    const leads = await readJson<Lead>(files.leads);
    const index = leads.findIndex((lead) => lead.id === id);
    if (index === -1) throw new Error(`Lead-i ${id} nuk u gjet`);
    leads[index] = { ...leads[index], ...input, updatedAt: new Date().toISOString() };
    await writeJson(files.leads, leads);
    return leads[index];
  },

  async setLeadStatus(id: string, status: LeadStatus) {
    await localCrm.updateLead(id, { status });
  },

  async removeLead(id) {
    const leads = await readJson<Lead>(files.leads);
    await writeJson(
      files.leads,
      leads.filter((lead) => lead.id !== id),
    );
  },

  async listActivities(leadId) {
    const activities = await readJson<Activity>(files.activities);
    return activities.filter((activity) => activity.leadId === leadId).sort(newest);
  },

  async createActivity(input: ActivityInput) {
    const activities = await readJson<Activity>(files.activities);
    const activity: Activity = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await writeJson(files.activities, [activity, ...activities]);
    return activity;
  },

  async listTasks(options = {}) {
    const tasks = await readJson<CrmTask>(files.tasks);
    return tasks
      .filter((task) => (options.leadId ? task.leadId === options.leadId : true))
      .filter((task) => (options.onlyOpen ? !task.done : true))
      .sort((a, b) => (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999"));
  },

  async createTask(input: CrmTaskInput) {
    const tasks = await readJson<CrmTask>(files.tasks);
    const task: CrmTask = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await writeJson(files.tasks, [task, ...tasks]);
    return task;
  },

  async setTaskDone(id, done) {
    const tasks = await readJson<CrmTask>(files.tasks);
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) throw new Error(`Detyra ${id} nuk u gjet`);
    tasks[index] = { ...tasks[index], done };
    await writeJson(files.tasks, tasks);
  },

  async removeTask(id) {
    const tasks = await readJson<CrmTask>(files.tasks);
    await writeJson(
      files.tasks,
      tasks.filter((task) => task.id !== id),
    );
  },
};
