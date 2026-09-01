import Link from "next/link";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin/crm", label: "Pipeline" },
  { href: "/admin/crm/klientet", label: "Klientë" },
  { href: "/admin/crm/detyrat", label: "Detyra" },
  { href: "/admin/crm/raporte", label: "Raporte" },
  { href: "/admin", label: "Prona" },
];

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/admin");

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold">CRM</h1>
      <nav className="mt-4 flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full bg-slate-100 px-4 py-1.5 font-medium text-slate-700 hover:bg-slate-200"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
