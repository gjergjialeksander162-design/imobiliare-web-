"use client";

import { useActionState } from "react";

import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";

const initialState: InquiryState = { status: "idle", message: "" };

export function ContactForm({
  propertyId = null,
  defaultMessage = "",
}: {
  propertyId?: string | null;
  defaultMessage?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initialState);

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="rounded-lg border border-brand bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3">
      {propertyId && <input type="hidden" name="propertyId" value={propertyId} />}

      <div>
        <label className="label" htmlFor="name">
          Emri dhe mbiemri
        </label>
        <input id="name" name="name" required className="field" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">
            Telefoni
          </label>
          <input id="phone" name="phone" type="tel" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" className="field" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="message">
          Mesazhi
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          defaultValue={defaultMessage}
          className="field"
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-rose-600">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Po dërgohet…" : "Dërgo kërkesën"}
      </button>
    </form>
  );
}
