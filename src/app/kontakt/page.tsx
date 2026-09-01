import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontaktoni ${site.name} për shitje, qira ose vlerësim pronash.`,
};

export default function ContactPage() {
  return (
    <div className="container-page py-14">
      <p className="eyebrow">Kontakt</p>
      <h1 className="display mt-2 text-4xl sm:text-5xl">Bisedo me një agjent</h1>
      <p className="mt-4 max-w-2xl text-sm text-slate-600">
        Plotësoni formularin dhe një agjent do t&apos;ju kontaktojë brenda 24 orëve, ose
        vizitoni zyrën tonë gjatë orarit të punës.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="card p-8">
          <ContactForm />
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="display text-xl">Zyra</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
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

          <div className="card p-6">
            <h2 className="display text-xl">Shërbime</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
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
