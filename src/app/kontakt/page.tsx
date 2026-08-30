import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontaktoni ${site.name} për shitje, qira ose vlerësim pronash.`,
};

export default function ContactPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Kontakt</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Plotësoni formularin dhe një agjent do t&apos;ju kontaktojë brenda 24 orëve, ose
        vizitoni zyrën tonë gjatë orarit të punës.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <ContactForm />
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-base font-bold">Zyra</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>{site.address}</li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-brand">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-brand">
                  {site.email}
                </a>
              </li>
              <li className="text-slate-500">{site.hours}</li>
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-bold">Shërbime</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Ndërmjetësim në shitje dhe qira</li>
              <li>Vlerësim falas i pronës</li>
              <li>Konsulencë investimi dhe qira afatshkurtër</li>
              <li>Asistencë notariale dhe hipotekore</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
