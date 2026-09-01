import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  createActivityAction,
  createLeadAction,
  createTaskAction,
  deleteClientAction,
  deleteLeadAction,
  toggleTaskAction,
  updateClientAction,
  updateLeadStatusAction,
} from "@/app/admin/crm/actions";
import { getCrm } from "@/lib/crm";
import { matchProperties } from "@/lib/crm/matching";
import {
  ACTIVITY_TYPES,
  ACTIVITY_TYPE_LABELS,
  CLIENT_SOURCES,
  CLIENT_SOURCE_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
} from "@/lib/crm/types";
import { formatDate, formatPrice } from "@/lib/format";
import { getRepository } from "@/lib/repo";
import { DEALS, DEAL_LABELS, KINDS, KIND_LABELS } from "@/lib/types";

export const metadata: Metadata = {
  title: "CRM · Klienti",
  robots: { index: false, follow: false },
};

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const crm = getCrm();
  const client = await crm.clientById(id);
  if (!client) notFound();

  const leads = await crm.leadsByClient(id);
  const properties = await getRepository().list();
  const redirectTo = `/admin/crm/klientet/${id}`;

  const details = await Promise.all(
    leads.map(async (lead) => ({
      lead,
      activities: await crm.listActivities(lead.id),
      tasks: await crm.listTasks({ leadId: lead.id }),
      matches: await matchProperties(lead),
    })),
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="card h-fit p-5">
          <h2 className="text-lg font-bold">Të dhënat e klientit</h2>
          <form action={updateClientAction} className="mt-4 space-y-3 text-sm">
            <input type="hidden" name="id" value={client.id} />
            <label className="block">
              <span className="font-medium">Emri *</span>
              <input name="name" required defaultValue={client.name} className={inputClass} />
            </label>
            <label className="block">
              <span className="font-medium">Telefon</span>
              <input name="phone" defaultValue={client.phone} className={inputClass} />
            </label>
            <label className="block">
              <span className="font-medium">Email</span>
              <input name="email" defaultValue={client.email} className={inputClass} />
            </label>
            <label className="block">
              <span className="font-medium">Burimi</span>
              <select name="source" defaultValue={client.source} className={inputClass}>
                {CLIENT_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {CLIENT_SOURCE_LABELS[source]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-medium">Shënime</span>
              <textarea name="notes" rows={3} defaultValue={client.notes} className={inputClass} />
            </label>
            <button type="submit" className="btn-primary w-full">
              Ruaj
            </button>
          </form>
          <form action={deleteClientAction} className="mt-3">
            <input type="hidden" name="id" value={client.id} />
            <button type="submit" className="text-sm font-medium text-rose-600 hover:underline">
              Fshi klientin
            </button>
          </form>
        </section>

        <section className="card h-fit p-5">
          <h2 className="text-lg font-bold">Kërkesë e re (lead)</h2>
          <form action={createLeadAction} className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <input type="hidden" name="clientId" value={client.id} />
            <label className="block">
              <span className="font-medium">Transaksioni</span>
              <select name="deal" defaultValue="" className={inputClass}>
                <option value="">— të gjitha —</option>
                {DEALS.map((deal) => (
                  <option key={deal} value={deal}>
                    {DEAL_LABELS[deal]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-medium">Tipi</span>
              <select name="kind" defaultValue="" className={inputClass}>
                <option value="">— të gjitha —</option>
                {KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {KIND_LABELS[kind]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-medium">Qyteti</span>
              <input name="city" className={inputClass} />
            </label>
            <label className="block">
              <span className="font-medium">Dhoma min.</span>
              <input name="minRooms" type="number" min="0" className={inputClass} />
            </label>
            <label className="block">
              <span className="font-medium">Buxhet min. (€)</span>
              <input name="budgetMin" type="number" min="0" className={inputClass} />
            </label>
            <label className="block">
              <span className="font-medium">Buxhet maks. (€)</span>
              <input name="budgetMax" type="number" min="0" className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-medium">Prona e interesuar</span>
              <select name="propertyId" defaultValue="" className={inputClass}>
                <option value="">— asnjë —</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="font-medium">Shënime</span>
              <textarea name="notes" rows={2} className={inputClass} />
            </label>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                Shto lead
              </button>
            </div>
          </form>
        </section>
      </div>

      <section>
        <h2 className="text-lg font-bold">Lead-et ({leads.length})</h2>
        {details.length === 0 ? (
          <p className="card mt-3 p-6 text-sm text-slate-600">Nuk ka lead-e për këtë klient.</p>
        ) : (
          <div className="mt-3 space-y-5">
            {details.map(({ lead, activities, tasks, matches }) => (
              <article key={lead.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {[
                        lead.deal ? DEAL_LABELS[lead.deal] : "Kërkesë",
                        lead.kind ? KIND_LABELS[lead.kind] : "",
                        lead.city,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {[
                        lead.budgetMin ? `nga ${lead.budgetMin} €` : "",
                        lead.budgetMax ? `deri ${lead.budgetMax} €` : "",
                        lead.minRooms ? `${lead.minRooms}+ dhoma` : "",
                      ]
                        .filter(Boolean)
                        .join(" · ") || "pa kritere"}
                    </p>
                    {lead.notes ? (
                      <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
                        {lead.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <form action={updateLeadStatusAction} className="flex gap-2">
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="clientId" value={client.id} />
                      <input type="hidden" name="redirectTo" value={redirectTo} />
                      <select
                        name="status"
                        defaultValue={lead.status}
                        className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {LEAD_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white"
                      >
                        Ruaj
                      </button>
                    </form>
                    <form action={deleteLeadAction}>
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="clientId" value={client.id} />
                      <button
                        type="submit"
                        className="text-sm font-medium text-rose-600 hover:underline"
                      >
                        Fshi
                      </button>
                    </form>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Aktivitete
                    </h3>
                    <form action={createActivityAction} className="mt-2 space-y-2 text-sm">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <input type="hidden" name="clientId" value={client.id} />
                      <select
                        name="type"
                        defaultValue="telefonate"
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      >
                        {ACTIVITY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {ACTIVITY_TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                      <textarea
                        name="note"
                        rows={2}
                        required
                        placeholder="Çfarë ndodhi?"
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      />
                      <button
                        type="submit"
                        className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white"
                      >
                        Shto
                      </button>
                    </form>
                    <ul className="mt-3 space-y-2 text-sm">
                      {activities.map((activity) => (
                        <li key={activity.id} className="rounded-md bg-slate-50 p-2">
                          <p className="text-xs font-semibold text-slate-600">
                            {ACTIVITY_TYPE_LABELS[activity.type]} ·{" "}
                            {formatDate(activity.createdAt)}
                          </p>
                          <p className="whitespace-pre-line">{activity.note}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Detyra
                    </h3>
                    <form action={createTaskAction} className="mt-2 space-y-2 text-sm">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <input type="hidden" name="clientId" value={client.id} />
                      <input type="hidden" name="redirectTo" value={redirectTo} />
                      <input
                        name="title"
                        required
                        placeholder="p.sh. telefono nesër"
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      />
                      <input
                        name="dueAt"
                        type="datetime-local"
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      />
                      <button
                        type="submit"
                        className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white"
                      >
                        Shto detyrë
                      </button>
                    </form>
                    <ul className="mt-3 space-y-2 text-sm">
                      {tasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-start justify-between gap-2 rounded-md bg-slate-50 p-2"
                        >
                          <div>
                            <p className={task.done ? "line-through text-slate-400" : ""}>
                              {task.title}
                            </p>
                            {task.dueAt ? (
                              <p className="text-xs text-slate-500">
                                afati {formatDate(task.dueAt)}
                              </p>
                            ) : null}
                          </div>
                          <form action={toggleTaskAction}>
                            <input type="hidden" name="id" value={task.id} />
                            <input type="hidden" name="done" value={String(task.done)} />
                            <input type="hidden" name="clientId" value={client.id} />
                            <input type="hidden" name="redirectTo" value={redirectTo} />
                            <button type="submit" className="text-xs font-medium text-brand">
                              {task.done ? "Rikthe" : "Kryer"}
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Prona që përputhen
                    </h3>
                    {matches.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-500">
                        Asnjë pronë me këto kritere.
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-2 text-sm">
                        {matches.map((property) => (
                          <li key={property.id} className="rounded-md bg-slate-50 p-2">
                            <Link
                              href={`/prona/${property.slug}`}
                              className="font-medium hover:text-brand"
                            >
                              {property.title}
                            </Link>
                            <p className="text-xs text-slate-500">
                              {property.city} · {property.rooms} dhoma ·{" "}
                              {formatPrice(property.price, property.deal)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
