import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rreth nesh",
  description: site.description,
};

const stats = [
  { value: "12+", label: "vite në tregun imobiliar" },
  { value: "850+", label: "transaksione të përfunduara" },
  { value: "6", label: "qytete me mbulim aktiv" },
  { value: "24h", label: "kohë përgjigjeje për kërkesat" },
];

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Rreth {site.name}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">
        Jemi agjenci imobiliare me fokus në ndërmjetësimin e shitjes dhe qirasë të
        pronave residenciale dhe komerciale. Çdo listim publikohet vetëm pas
        verifikimit të dokumentacionit të pronësisë, kështu që klientët tanë
        shikojnë oferta reale me çmime të krahasueshme me tregun.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-2xl font-bold text-brand">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-lg font-bold">Për pronarët</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Vlerësim falas, prezantim profesional me foto dhe planimetri, promovim në
            portal e rrjete sociale, filtrim i blerësve serioz dhe ndjekje e plotë e
            procesit notarial deri në nënshkrimin e kontratës.
          </p>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold">Për blerësit dhe qiramarrësit</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Kërkim i personalizuar sipas buxhetit dhe zonës, organizim i vizitave,
            verifikim i statusit hipotekor të pronës dhe asistencë për kredi bankare
            me bankat partnere.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link href="/kontakt" className="btn-primary">
          Bisedo me një agjent
        </Link>
      </div>
    </div>
  );
}
