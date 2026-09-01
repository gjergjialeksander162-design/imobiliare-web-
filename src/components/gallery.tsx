"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length > 0 ? images : ["/images/prona-1.svg"];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const step = useCallback(
    (delta: number) => setActive((index) => (index + delta + list.length) % list.length),
    [list.length],
  );

  useEffect(() => {
    if (!zoomed) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomed, step]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label="Zmadho foton"
        className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-100"
      >
        <Image
          src={list[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          Kliko për të zmadhuar
        </span>
      </button>

      {list.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Foto ${index + 1}`}
              aria-current={index === active}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${
                index === active ? "border-brand" : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Mbyll"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-2xl leading-none text-white hover:bg-white/20"
          >
            ×
          </button>

          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Foto e mëparshme"
                className="absolute left-3 rounded-full bg-white/10 px-4 py-3 text-2xl leading-none text-white hover:bg-white/20"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Foto tjetër"
                className="absolute right-3 rounded-full bg-white/10 px-4 py-3 text-2xl leading-none text-white hover:bg-white/20"
              >
                ›
              </button>
            </>
          )}

          <div
            onClick={(event) => event.stopPropagation()}
            className="relative h-[85vh] w-full max-w-5xl"
          >
            <Image
              src={list[active]}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <p className="absolute bottom-4 text-sm text-white/80">
            {active + 1} / {list.length}
          </p>
        </div>
      )}
    </div>
  );
}
