import Link from "next/link";

import { logoutAction } from "@/app/admin/actions";
import { isAuthenticated } from "@/lib/auth";

export async function AdminBar() {
  if (!(await isAuthenticated())) return null;

  return (
    <div className="bg-slate-900 text-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
        <span className="font-semibold">Modaliteti admin</span>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/admin" className="hover:underline">
            Paneli
          </Link>
          <Link href="/admin/prona/e-re" className="hover:underline">
            Shto pronë
          </Link>
          <Link href="/admin/crm" className="hover:underline">
            CRM
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="hover:underline">
              Shkyçu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
