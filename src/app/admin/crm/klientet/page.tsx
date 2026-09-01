import type { Metadata } from "next";
import Link from "next/link";

import { createClientAction } from "@/app/admin/crm/actions";
import { getCrm } from "@/lib/crm";
import { CLIENT_SOURCES, CLIENT_SOURCE_LABELS } from "@/lib/crm/types";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "CRM · Klientë",
  robots: { index: false, follow: false },
};

export default async function ClientsPage() {
  const crm = getCrm();
  const [clients, leads] = await Promise.all([crm.listClients(), crm.listLeads()]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        <h2 className="text-lg font-bold">Klientët ({clients.length})</h2>
        {clients.length === 0 ? (
          <p className="card mt-3 p-6 text-sm text-slate-600">
            Nuk ka klientë. Shtoje të parin me formularin në krah.
          </p>
        ) : (
          <div className="card mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Klienti</th>
                  <th className="px-4 py-3">Kontakt</th>
                  <th className="px-4 py-3">Burimi</th>
                  <th className="px-4 py-3">Lead-e</th>
                  <th className="px-4 py-3">Shtuar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/crm/klientet/${client.id}`}
                        className="font-medium hover:text-brand"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {[client.phone, client.email].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-4 py-3">{CLIENT_SOURCE_LABELS[client.source]}</td>
                    <td className="px-4 py-3">
                      {leads.filter((lead) => lead.clientId === client.id).length}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(client.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card h-fit p-5">
        <h2 className="text-lg font-bold">Klient i re</h2>
        <form action={createClientAction} className="mt-4 space-y-3 text-sm">
          <label className="block">
            <span className="font-medium">Emri *</span>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="font-medium">Telefon</span>
            <input
              name="phone"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="font-medium">Email</span>
            <input
              name="email"
              type="email"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="font-medium">Burimi</span>
            <select
              name="source"
              defaultValue="telefon"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            >
              {CLIENT_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {CLIENT_SOURCE_LABELS[source]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-medium">Shënime</span>
            <textarea
              name="notes"
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <button type="submit" className="btn-primary w-full">
            Ruaj klientin
          </button>
        </form>
      </section>
    </div>
  );
}
