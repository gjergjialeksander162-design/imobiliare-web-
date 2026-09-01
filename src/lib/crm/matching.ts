import type { Lead } from "@/lib/crm/types";
import { getRepository } from "@/lib/repo";
import type { Property } from "@/lib/types";

export async function matchProperties(lead: Lead, limit = 6): Promise<Property[]> {
  const properties = await getRepository().list();
  return properties
    .filter((property) => {
      if (lead.deal && property.deal !== lead.deal) return false;
      if (lead.kind && property.kind !== lead.kind) return false;
      if (lead.city && property.city.toLowerCase() !== lead.city.toLowerCase()) {
        return false;
      }
      if (lead.budgetMin != null && property.price < lead.budgetMin) return false;
      if (lead.budgetMax != null && property.price > lead.budgetMax) return false;
      if (lead.minRooms != null && property.rooms < lead.minRooms) return false;
      return true;
    })
    .slice(0, limit);
}
