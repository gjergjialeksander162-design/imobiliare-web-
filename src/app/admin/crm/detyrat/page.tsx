import type { Metadata } from "next";
import Link from "next/link";

import { deleteTaskAction, toggleTaskAction } from "@/app/admin/crm/actions";
import { getCrm } from "@/lib/crm";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "CRM · Detyra",
  robots: { index: false, follow: false },
};

export default async function TasksPage() {
  const crm = getCrm();
  const [tasks, leads] = await Promise.all([crm.listTasks(), crm.listLeads()]);
  const open = tasks.filter((task) => !task.done);
  const done = tasks.filter((task) => task.done);
  const clientOf = (leadId: string) => leads.find((lead) => lead.id === leadId);
  const now = Date.now();

  const rows = [...open, ...done];

  return (
    <div>
      <p className="text-sm text-slate-600">
        {open.length} detyra hapur · {done.length} të kryera
      </p>

      {rows.length === 0 ? (
        <p className="card mt-4 p-6 text-sm text-slate-600">
          Nuk ka detyra. Shtoji nga faqja e klientit.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((task) => {
            const lead = clientOf(task.leadId);
            const late = !task.done && task.dueAt && new Date(task.dueAt).getTime() < now;
            return (
              <li key={task.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className={task.done ? "line-through text-slate-400" : "font-medium"}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {lead ? (
                      <Link
                        href={`/admin/crm/klientet/${lead.clientId}`}
                        className="hover:text-brand"
                      >
                        {lead.client.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                    {task.dueAt ? ` · afati ${formatDate(task.dueAt)}` : ""}
                    {late ? " · i kaluar" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <form action={toggleTaskAction}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="done" value={String(task.done)} />
                    <button type="submit" className="text-sm font-medium text-brand hover:underline">
                      {task.done ? "Rikthe" : "Shëno kryer"}
                    </button>
                  </form>
                  <form action={deleteTaskAction}>
                    <input type="hidden" name="id" value={task.id} />
                    <button type="submit" className="text-sm font-medium text-rose-600 hover:underline">
                      Fshi
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
