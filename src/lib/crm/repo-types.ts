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

export interface CrmRepository {
  name: string;
  listClients(): Promise<Client[]>;
  clientById(id: string): Promise<Client | null>;
  createClient(input: ClientInput): Promise<Client>;
  updateClient(id: string, input: ClientInput): Promise<Client>;
  removeClient(id: string): Promise<void>;

  listLeads(): Promise<LeadWithClient[]>;
  leadById(id: string): Promise<LeadWithClient | null>;
  leadsByClient(clientId: string): Promise<Lead[]>;
  createLead(input: LeadInput): Promise<Lead>;
  updateLead(id: string, input: Partial<LeadInput>): Promise<Lead>;
  setLeadStatus(id: string, status: LeadStatus): Promise<void>;
  removeLead(id: string): Promise<void>;

  listActivities(leadId: string): Promise<Activity[]>;
  createActivity(input: ActivityInput): Promise<Activity>;

  listTasks(options?: { leadId?: string; onlyOpen?: boolean }): Promise<CrmTask[]>;
  createTask(input: CrmTaskInput): Promise<CrmTask>;
  setTaskDone(id: string, done: boolean): Promise<void>;
  removeTask(id: string): Promise<void>;
}
