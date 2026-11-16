import { getCrm } from "@/lib/crm";

export async function countNewLeads(): Promise<number> {
  try {
    const leads = await getCrm().listLeads();
    return leads.filter((lead) => lead.status === "i_re").length;
  } catch {
    return 0;
  }
}
