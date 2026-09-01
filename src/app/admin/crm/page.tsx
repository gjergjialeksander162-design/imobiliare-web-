import type { Metadata } from "next";
import Link from "next/link";

import { updateLeadStatusAction } from "@/app/admin/crm/actions";
import { getCrm } from "@/lib/crm";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type LeadWithClient,
} from "@/lib/crm/types";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "CRM · Pipeline",
  robots: { index: false, follow: false },
};

export default async function CrmPipelinePage() {
  const leads = await getCrm().listLeads();
  const byStatus = new Map<string, LeadWithClient[]>(
    LEAD_STATUSES.map((status) => [status, []]),
  );
  for (const lead of leads) {
    byStatus.get(lead.status)?.push(lead);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {leads.length} lead-e gjithsej në pipeline
        </p>
        <Link href="/admin/crm/klientet" className="btn-primary">
          Shto klient / lead
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LEAD_STATUSES.map((status) => {
          const items = byStatus.get(status) ?? [];
          return (
            <section key={status} className="card p-4">
              <h2 className="flex items-center justify-between text-sm font-bold uppercase tracking-wide text-slate-600">
                {LEAD_STATUS_LABELS[status]}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  {items.length}
                </span>
              </h2>
              <ul className="mt-3 space-y-3">
                {items.map((lead) => (
                  <li key={lead.id} className="rounded-lg border border-slate-200 p-3">
                    <Link
                      href={`/admin/crm/klientet/${lead.clientId}`}
                      className="font-medium hover:text-brand"
                    >
                      {lead.client.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {[lead.client.phone, lead.client.email].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {[
                        lead.city,
                        lead.budgetMax ? `deri ${lead.budgetMax} €` : "",
                        lead.minRooms ? `${lead.minRooms}+ dhoma` : "",
                      ]
                        .filter(Boolean)
                        .join(" · ") || "pa kritere"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(lead.createdAt)}
                    </p>
                    <form action={updateLeadStatusAction} className="mt-2 flex gap-2">
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="clientId" value={lead.clientId} />
                      <input type="hidden" name="redirectTo" value="/admin/crm" />
                      <select
                        name="status"
                        defaultValue={lead.status}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                      >
                        {LEAD_STATUSES.map((option) => (
                          <option key={option} value={option}>
                            {LEAD_STATUS_LABELS[option]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white"
                      >
                        Ruaj
                      </button>
                    </form>
                  </li>
                ))}
                {items.length === 0 ? (
                  <li className="text-xs text-slate-400">Bosh</li>
                ) : null}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
