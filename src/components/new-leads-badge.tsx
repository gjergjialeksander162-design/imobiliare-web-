"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const POLL_MS = 30_000;

export function NewLeadsBadge({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/admin/new-leads", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { count: number };
        if (active) setCount(data.count);
      } catch {
        // rrjeti mungon përkohësisht; provohet sërish në ciklin tjetër
      }
    };
    const timer = window.setInterval(refresh, POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  if (count === 0) return null;

  return (
    <Link
      href="/admin/crm"
      aria-live="polite"
      className="inline-flex min-h-8 items-center gap-2 rounded-full bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-500"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      {count === 1 ? "1 kërkesë e re" : `${count} kërkesa të reja`}
    </Link>
  );
}
