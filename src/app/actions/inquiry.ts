"use server";

import { getRepository } from "@/lib/repo";

export interface InquiryState {
  status: "idle" | "success" | "error";
  message: string;
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

  return {
    status: "success",
    message: "Faleminderit! Një agjent do t'ju kontaktojë brenda 24 orëve.",
  };
}
