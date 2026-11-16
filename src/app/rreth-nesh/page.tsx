import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rreth nesh",
  description: site.description,
  alternates: { canonical: "/rreth-nesh" },
};

export default function AboutPage() {
  return (
    <div className="container-page py-14">
      <p className="eyebrow-rule">Agjencia</p>
      <h1 className="display mt-2 text-4xl sm:text-5xl">Rreth {site.name}</h1>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-700">
        Jemi agjenci imobiliare me fokus në ndërmjetësimin e shitjes dhe qirasë të
        pronave residenciale dhe komerciale. Çdo listim publikohet vetëm pas
        verifikimit të dokumentacionit të pronësisë, kështu që klientët tanë
        shikojnë oferta reale me çmime të krahasueshme me tregun.
      </p>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <section className="card p-8">
          <h2 className="display text-2xl">Për pronarët</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Vlerësim falas, prezantim profesional me foto dhe planimetri, promovim në
            portal e rrjete sociale, filtrim i blerësve serioz dhe ndjekje e plotë e
            procesit notarial deri në nënshkrimin e kontratës.
          </p>
        </section>

        <section className="card p-8">
          <h2 className="display text-2xl">Për blerësit dhe qiramarrësit</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Kërkim i personalizuar sipas buxhetit dhe zonës, organizim i vizitave,
            verifikim i statusit hipotekor të pronës dhe asistencë për kredi bankare
            me bankat partnere.
          </p>
        </section>
      </div>

      <div className="mt-12">
        <Link href="/kontakt" className="btn-primary">
          Bisedo me një agjent
        </Link>
      </div>
    </div>
  );
}
