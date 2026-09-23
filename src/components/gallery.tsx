"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 40;

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length > 0 ? images : ["/images/prona-1.svg"];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

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

  function onTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchEnd(event: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || list.length < 2) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    step(dx < 0 ? 1 : -1);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label="Zmadho foton"
        className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden bg-sand"
      >
        <Image
          src={list[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 bg-black/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white">
          Kliko për të zmadhuar
        </span>
      </button>

      {list.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Foto ${index + 1}`}
              aria-current={index === active}
              className={`relative h-20 w-28 shrink-0 overflow-hidden border-2 ${
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
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-50 flex touch-pan-y select-none items-center justify-center bg-black/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Mbyll"
            className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
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
                className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
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
                className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
              >
                ›
              </button>
            </>
          )}

          <div
            onClick={(event) => event.stopPropagation()}
            className="relative h-[80svh] w-full max-w-5xl"
          >
            <Image
              src={list[active]}
              alt={alt}
              fill
              sizes="100vw"
              draggable={false}
              className="object-contain"
            />
          </div>

          <p className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] text-sm text-white/80">
            {active + 1} / {list.length}
          </p>
        </div>
      )}
    </div>
  );
}
