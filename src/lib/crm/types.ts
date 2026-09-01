import type { Deal, PropertyKind } from "@/lib/types";

export const LEAD_STATUSES = [
  "i_re",
  "kontaktuar",
  "vizite",
  "oferte",
  "fituar",
  "humbur",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  i_re: "I re",
  kontaktuar: "Kontaktuar",
  vizite: "Vizitë",
  oferte: "Ofertë",
  fituar: "Fituar",
  humbur: "Humbur",
};

export const CLIENT_SOURCES = [
  "web",
  "telefon",
  "instagram",
  "facebook",
  "referim",
  "tjeter",
] as const;

export type ClientSource = (typeof CLIENT_SOURCES)[number];

export const CLIENT_SOURCE_LABELS: Record<ClientSource, string> = {
  web: "Faqja web",
  telefon: "Telefon",
  instagram: "Instagram",
  facebook: "Facebook",
  referim: "Referim",
  tjeter: "Tjetër",
};

export const ACTIVITY_TYPES = ["telefonate", "email", "vizite", "shenim"] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  telefonate: "Telefonatë",
  email: "Email",
  vizite: "Vizitë",
  shenim: "Shënim",
};

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: ClientSource;
  notes: string;
  createdAt: string;
}

export type ClientInput = Omit<Client, "id" | "createdAt">;

export interface Lead {
  id: string;
  clientId: string;
  propertyId: string | null;
  status: LeadStatus;
  deal: Deal | null;
  kind: PropertyKind | null;
  city: string;
  budgetMin: number | null;
  budgetMax: number | null;
  minRooms: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadInput = Omit<Lead, "id" | "createdAt" | "updatedAt">;

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  note: string;
  createdAt: string;
}

export type ActivityInput = Omit<Activity, "id" | "createdAt">;

export interface CrmTask {
  id: string;
  leadId: string;
  title: string;
  dueAt: string | null;
  done: boolean;
  createdAt: string;
}

export type CrmTaskInput = Omit<CrmTask, "id" | "createdAt">;

export interface LeadWithClient extends Lead {
  client: Client;
}
