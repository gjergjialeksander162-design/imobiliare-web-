"use server";

import { getCrm } from "@/lib/crm";
import { getRepository } from "@/lib/repo";

export interface InquiryState {
  status: "idle" | "success" | "error";
  message: string;
}

async function captureLead(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string | null;
}): Promise<void> {
  const crm = getCrm();
  const clients = await crm.listClients();
  const existing = clients.find(
    (client) =>
      (input.email && client.email.toLowerCase() === input.email.toLowerCase()) ||
      (input.phone && client.phone === input.phone),
  );

  const client =
    existing ??
    (await crm.createClient({
      name: input.name,
      phone: input.phone,
      email: input.email,
      source: "web",
      notes: "",
    }));

  const lead = await crm.createLead({
    clientId: client.id,
    propertyId: input.propertyId,
    status: "i_re",
    deal: null,
    kind: null,
    city: "",
    budgetMin: null,
    budgetMax: null,
    minRooms: null,
    notes: input.message,
  });

  await crm.createActivity({
    leadId: lead.id,
    type: "shenim",
    note: `Kërkesë nga faqja: ${input.message}`,
  });
}

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const propertyId = String(formData.get("propertyId") ?? "").trim() || null;

  if (!name || message.length < 5 || (!email && !phone)) {
    return {
      status: "error",
      message:
        "Plotësoni emrin, mesazhin (min. 5 karaktere) dhe së paku një kontakt (email ose telefon).",
    };
  }

  try {
    await getRepository().createInquiry({ name, email, phone, message, propertyId });
  } catch {
    return {
      status: "error",
      message: "Kërkesa nuk u regjistrua. Provoni përsëri ose telefononi agjencinë.",
    };
  }

  try {
    await captureLead({ name, email, phone, message, propertyId });
  } catch (error) {
    console.error("Lead-i i CRM-it nuk u krijua", error);
  }

  return {
    status: "success",
    message: "Faleminderit! Një agjent do t'ju kontaktojë brenda 24 orëve.",
  };
}
