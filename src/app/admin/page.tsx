import type { Metadata } from "next";
import Link from "next/link";

import { deletePropertyAction, logoutAction } from "@/app/admin/actions";
import { LoginForm } from "@/app/admin/login-form";
import { formatDate, formatPrice } from "@/lib/format";
import { isAuthenticated } from "@/lib/auth";
import { getRepository } from "@/lib/repo";
import { DEAL_LABELS, KIND_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel administrimi",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    return (
      <div className="container-page py-14">
        <LoginForm />
      </div>
    );
  }

  const repo = getRepository();
  const [properties, inquiries] = await Promise.all([
    repo.list(),
    repo.listInquiries(),
  ]);

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Panel administrimi</h1>
          <p className="mt-1 text-sm text-slate-600">
            {properties.length} listime · {inquiries.length} kërkesa · burimi i të
            dhënave: <span className="font-semibold">{repo.name}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/prona/e-re" className="btn-primary">
            Shto pronë
          </Link>
          <Link href="/admin/crm" className="btn-outline">
            CRM
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="btn-outline">
              Shkyçu
            </button>
          </form>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Listimet</h2>
        <div className="card mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Prona</th>
                <th className="px-4 py-3">Qyteti</th>
                <th className="px-4 py-3">Tipi</th>
                <th className="px-4 py-3">Çmimi</th>
                <th className="px-4 py-3">Publikuar</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-4 py-3">
                    <Link href={`/prona/${property.slug}`} className="font-medium hover:text-brand">
                      {property.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {DEAL_LABELS[property.deal]}
                      {property.featured ? " · e zgjedhur" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">{property.city}</td>
                  <td className="px-4 py-3">{KIND_LABELS[property.kind]}</td>
                  <td className="px-4 py-3">{formatPrice(property.price, property.deal)}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(property.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/prona/${property.id}`}
                        className="text-sm font-medium text-brand hover:underline"
                      >
                        Edito
                      </Link>
                      <form action={deletePropertyAction}>
                        <input type="hidden" name="id" value={property.id} />
                        <button
                          type="submit"
                          className="text-sm font-medium text-rose-600 hover:underline"
                        >
                          Fshi
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold">Kërkesat e klientëve</h2>
        {inquiries.length === 0 ? (
          <p className="card mt-3 p-6 text-sm text-slate-600">
            Nuk ka kërkesa të regjistruara.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id} className="card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{inquiry.name}</p>
                  <p className="text-xs text-slate-500">{formatDate(inquiry.createdAt)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {[inquiry.phone, inquiry.email].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                  {inquiry.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
