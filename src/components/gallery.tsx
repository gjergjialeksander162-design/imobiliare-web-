"use client";

import Image from "next/image";
import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from "react";

import { useVisualViewport } from "@/lib/use-visual-viewport";

const SWIPE_THRESHOLD = 40;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

type Transform = { scale: number; x: number; y: number };

const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };

function distance(a: Touch, b: Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function isOutsideImage(overlay: HTMLElement, x: number, y: number) {
  const img = overlay.querySelector("img");
  if (!img) return false;
  const rect = img.getBoundingClientRect();
  const ratio = Math.min(
    rect.width / (img.naturalWidth || 1),
    rect.height / (img.naturalHeight || 1),
  );
  const width = (img.naturalWidth || rect.width) * ratio;
  const height = (img.naturalHeight || rect.height) * ratio;
  const left = rect.left + (rect.width - width) / 2;
  const top = rect.top + (rect.height - height) / 2;
  return x < left || x > left + width || y < top || y > top + height;
}

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length > 0 ? images : ["/images/prona-1.svg"];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [transform, setTransform] = useState<Transform>(IDENTITY);
  const transformRef = useRef<Transform>(IDENTITY);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const gestureEndRef = useRef(0);
  const viewport = useVisualViewport();

  const step = useCallback(
    (delta: number) => setActive((index) => (index + delta + list.length) % list.length),
    [list.length],
  );

  const applyTransform = useCallback((next: Transform) => {
    transformRef.current = next;
    setTransform(next);
  }, []);

  useEffect(() => {
    applyTransform(IDENTITY);
  }, [active, zoomed, applyTransform]);

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

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!zoomed || !overlay) return;

    let pinch: { dist: number; scale: number } | null = null;
    let pan: { x: number; y: number; ox: number; oy: number } | null = null;
    let swipe: { x: number; y: number; onButton: boolean } | null = null;
    let lastTapAt = 0;
    let closeTimer: ReturnType<typeof setTimeout> | null = null;

    function clampOffset(next: Transform): Transform {
      const rect = overlay!.getBoundingClientRect();
      const limitX = (Math.max(next.scale, 1) - 1) * rect.width * 0.5;
      const limitY = (Math.max(next.scale, 1) - 1) * rect.height * 0.5;
      return {
        scale: next.scale,
        x: Math.min(limitX, Math.max(-limitX, next.x)),
        y: Math.min(limitY, Math.max(-limitY, next.y)),
      };
    }

    function onTouchStart(event: TouchEvent) {
      const current = transformRef.current;
      if (event.touches.length === 2) {
        pinch = { dist: distance(event.touches[0], event.touches[1]), scale: current.scale };
        pan = null;
        swipe = null;
        event.preventDefault();
        return;
      }
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (current.scale > 1.01) {
        pan = { x: touch.clientX, y: touch.clientY, ox: current.x, oy: current.y };
        swipe = null;
      } else {
        swipe = {
          x: touch.clientX,
          y: touch.clientY,
          onButton: Boolean((event.target as Element | null)?.closest("button")),
        };
      }
    }

    function onTouchMove(event: TouchEvent) {
      if (pinch && event.touches.length === 2) {
        const ratio = distance(event.touches[0], event.touches[1]) / pinch.dist;
        const scale = Math.min(MAX_SCALE, Math.max(1, pinch.scale * ratio));
        applyTransform(clampOffset({ ...transformRef.current, scale }));
        event.preventDefault();
        return;
      }
      if (pan && event.touches.length === 1) {
        const touch = event.touches[0];
        applyTransform(
          clampOffset({
            scale: transformRef.current.scale,
            x: pan.ox + (touch.clientX - pan.x),
            y: pan.oy + (touch.clientY - pan.y),
          }),
        );
        event.preventDefault();
      }
    }

    function handleTap(x: number, y: number) {
      const now = Date.now();
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      if (transformRef.current.scale > 1.01) return;

      if (now - lastTapAt < 300) {
        lastTapAt = 0;
        applyTransform({ scale: DOUBLE_TAP_SCALE, x: 0, y: 0 });
        return;
      }
      lastTapAt = now;

      if (!isOutsideImage(overlay!, x, y)) return;
      closeTimer = setTimeout(() => {
        closeTimer = null;
        if (transformRef.current.scale <= 1.01) setZoomed(false);
      }, 320);
    }

    function onTouchEnd(event: TouchEvent) {
      if (pinch) {
        pinch = null;
        gestureEndRef.current = Date.now();
        if (transformRef.current.scale <= 1.05) applyTransform(IDENTITY);
        return;
      }
      if (pan) {
        const moved = event.changedTouches[0];
        const still =
          Math.abs(moved.clientX - pan.x) < 10 && Math.abs(moved.clientY - pan.y) < 10;
        pan = null;
        gestureEndRef.current = Date.now();
        if (still) handleTap(moved.clientX, moved.clientY);
        return;
      }

      const start = swipe;
      swipe = null;
      if (!start) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;

      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        if (!start.onButton) handleTap(touch.clientX, touch.clientY);
        return;
      }

      if (list.length < 2) return;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      gestureEndRef.current = Date.now();
      step(dx < 0 ? 1 : -1);
    }

    function onTouchEndWrapped(event: TouchEvent) {
      onTouchEnd(event);
      gestureEndRef.current = Date.now();
    }

    overlay.addEventListener("touchstart", onTouchStart, { passive: false });
    overlay.addEventListener("touchmove", onTouchMove, { passive: false });
    overlay.addEventListener("touchend", onTouchEndWrapped, { passive: false });
    overlay.addEventListener("touchcancel", onTouchEndWrapped, { passive: false });
    return () => {
      if (closeTimer) clearTimeout(closeTimer);
      overlay.removeEventListener("touchstart", onTouchStart);
      overlay.removeEventListener("touchmove", onTouchMove);
      overlay.removeEventListener("touchend", onTouchEndWrapped);
      overlay.removeEventListener("touchcancel", onTouchEndWrapped);
    };
  }, [zoomed, list.length, step, applyTransform]);

  function closeIfIdle(event: ReactMouseEvent<HTMLDivElement>) {
    if (Date.now() - gestureEndRef.current < 300) return;
    if (transformRef.current.scale > 1.01) return;
    const overlay = overlayRef.current;
    if (overlay && !isOutsideImage(overlay, event.clientX, event.clientY)) return;
    setZoomed(false);
  }

  return (
    <div className="min-w-0 space-y-3">
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
        <div className="no-scrollbar flex w-full max-w-full gap-3 overflow-x-auto pb-1">
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
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={closeIfIdle}
          style={
            viewport && (viewport.scale > 1.01 || viewport.offsetTop > 0 || viewport.offsetLeft > 0)
              ? {
                  width: viewport.width,
                  height: viewport.height,
                  transform: `translate(${viewport.offsetLeft}px, ${viewport.offsetTop}px)`,
                }
              : undefined
          }
          className="fixed left-0 top-0 z-50 flex h-full w-full touch-none select-none items-center justify-center overflow-hidden bg-black/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
        >
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transition: "transform 120ms ease-out",
            }}
          >
            <div className="relative h-full max-h-[80vh] w-full max-w-5xl">
              <Image
                src={list[active]}
                alt={alt}
                fill
                sizes="100vw"
                draggable={false}
                className="object-contain"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setZoomed(false);
            }}
            aria-label="Mbyll"
            className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
          >
            ×
          </button>

          {list.length > 1 && transform.scale <= 1.01 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Foto e mëparshme"
                className="absolute bottom-0 left-0 top-20 z-10 flex w-[28%] items-center justify-start pl-3"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20">
                  ‹
                </span>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Foto tjetër"
                className="absolute bottom-0 right-0 top-20 z-10 flex w-[28%] items-center justify-end pr-3"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20">
                  ›
                </span>
              </button>
            </>
          )}

          <p className="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 text-sm text-white/80">
            {active + 1} / {list.length}
          </p>
        </div>
      )}
    </div>
  );
}
