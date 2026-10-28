import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Faqja nuk u gjet",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">Gabim 404</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Kjo faqe nuk ekziston</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
        Prona mund të jetë shitur ose hequr nga lista, ose adresa është shkruar gabim.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/prona" className="btn-primary">
          Shiko pronat
        </Link>
        <Link href="/" className="btn-outline">
          Kryefaqja
        </Link>
      </div>
    </div>
  );
}
