import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PropertyForm } from "@/app/admin/property-form";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shto pronë",
  robots: { index: false, follow: false },
};

export default async function NewPropertyPage() {
  if (!(await isAuthenticated())) redirect("/admin");

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold">Shto pronë</h1>
      <div className="mt-6">
        <PropertyForm />
      </div>
    </div>
  );
}
