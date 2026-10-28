"use client";

import { useState } from "react";

import { IconShare, IconWhatsApp } from "@/components/icons";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  function url() {
    return `${window.location.origin}${path}`;
  }

  async function share() {
    const data = { title, url: url() };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* përdoruesi e anuloi */
      }
    }
    try {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard i padisponueshëm */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title)}%20`}
        onClick={(event) => {
          event.preventDefault();
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`,
            "_blank",
            "noopener",
          );
        }}
        className="inline-flex min-h-10 items-center gap-2 border border-line px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-600 transition hover:border-gold hover:text-gold-dark"
      >
        <IconWhatsApp /> WhatsApp
      </a>
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-10 items-center gap-2 border border-line px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-600 transition hover:border-gold hover:text-gold-dark"
      >
        <IconShare /> {copied ? "U kopjua" : "Ndaj"}
      </button>
    </div>
  );
}
