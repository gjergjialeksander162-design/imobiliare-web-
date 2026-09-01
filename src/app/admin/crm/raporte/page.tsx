import type { Metadata } from "next";

import { getCrm } from "@/lib/crm";
import {
  CLIENT_SOURCES,
  CLIENT_SOURCE_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
} from "@/lib/crm/types";

export const metadata: Metadata = {
  title: "CRM · Raporte",
  robots: { index: false, follow: false },
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default async function ReportsPage() {
  const crm = getCrm();
  const [clients, leads, tasks] = await Promise.all([
    crm.listClients(),
    crm.listLeads(),
    crm.listTasks(),
  ]);

  const won = leads.filter((lead) => lead.status === "fituar").length;
  const lost = leads.filter((lead) => lead.status === "humbur").length;
  const closed = won + lost;
  const conversion = closed === 0 ? 0 : Math.round((won / closed) * 100);
  const openTasks = tasks.filter((task) => !task.done).length;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonth = leads.filter(
    (lead) => new Date(lead.createdAt).getTime() >= monthStart.getTime(),
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Klientë" value={clients.length} />
        <Stat label="Lead-e" value={leads.length} />
        <Stat label="Lead-e këtë muaj" value={thisMonth} />
        <Stat label="Konvertim" value={`${conversion}%`} />
        <Stat label="Detyra hapur" value={openTasks} />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-lg font-bold">Lead-e sipas statusit</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {LEAD_STATUSES.map((status) => (
              <li key={status} className="flex justify-between">
                <span>{LEAD_STATUS_LABELS[status]}</span>
                <span className="font-semibold">
                  {leads.filter((lead) => lead.status === status).length}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-bold">Klientë sipas burimit</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CLIENT_SOURCES.map((source) => (
              <li key={source} className="flex justify-between">
                <span>{CLIENT_SOURCE_LABELS[source]}</span>
                <span className="font-semibold">
                  {clients.filter((client) => client.source === source).length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
