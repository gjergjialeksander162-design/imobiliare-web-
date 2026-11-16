import Link from "next/link";

import { logoutAction } from "@/app/admin/actions";
import { NewLeadsBadge } from "@/components/new-leads-badge";
import { isAuthenticated } from "@/lib/auth";
import { countNewLeads } from "@/lib/crm/new-leads";

export async function AdminBar() {
  if (!(await isAuthenticated())) return null;

  const newLeads = await countNewLeads();

  return (
    <div className="bg-slate-900 text-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold">Modaliteti admin</span>
          <NewLeadsBadge initialCount={newLeads} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <Link href="/admin" className="inline-flex min-h-10 items-center hover:underline">
            Paneli
          </Link>
          <Link
            href="/admin/prona/e-re"
            className="inline-flex min-h-10 items-center hover:underline"
          >
            Shto pronë
          </Link>
          <Link
            href="/admin/crm"
            className="inline-flex min-h-10 items-center hover:underline"
          >
            CRM
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="min-h-10 hover:underline">
              Shkyçu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
