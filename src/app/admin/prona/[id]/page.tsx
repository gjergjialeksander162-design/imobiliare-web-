import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { PropertyForm } from "@/app/admin/property-form";
import { isAuthenticated } from "@/lib/auth";
import { getRepository } from "@/lib/repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edito pronën",
  robots: { index: false, follow: false },
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin");

  const { id } = await params;
  const property = await getRepository().byId(id);
  if (!property) notFound();

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold">Edito pronën</h1>
      <p className="mt-1 text-sm text-slate-600">{property.title}</p>
      <div className="mt-6">
        <PropertyForm property={property} />
      </div>
    </div>
  );
}
