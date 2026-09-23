"use client";

import { useVisualViewport } from "@/lib/use-visual-viewport";

export function MobileActions({ phone }: { phone: string }) {
  const viewport = useVisualViewport();
  const zoomed = viewport ? viewport.scale > 1.05 : false;

  if (zoomed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-line bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn-outline flex-1">
        Telefono
      </a>
      <a href="#kontakt-prone" className="btn-primary flex-1">
        Dërgo kërkesë
      </a>
    </div>
  );
}
