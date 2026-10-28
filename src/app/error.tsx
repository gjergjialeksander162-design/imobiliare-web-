"use client";

import Link from "next/link";
import { useEffect } from "react";

import { site } from "@/lib/site";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">Problem i përkohshëm</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Faqja nuk u ngarkua</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
        Lista e pronave nuk u mor dot për momentin. Provoni përsëri pas pak ose na
        telefononi në{" "}
        <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-brand">
          {site.phone}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Provo përsëri
        </button>
        <Link href="/kontakt" className="btn-outline">
          Kontakt
        </Link>
      </div>
    </div>
  );
}
