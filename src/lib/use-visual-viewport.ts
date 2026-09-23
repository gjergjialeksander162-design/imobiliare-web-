"use client";

import { useEffect, useState } from "react";

export type VisualViewportState = {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
  scale: number;
};

export function useVisualViewport() {
  const [state, setState] = useState<VisualViewportState | null>(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    function update() {
      if (!viewport) return;
      const next = {
        width: viewport.width,
        height: viewport.height,
        offsetLeft: viewport.offsetLeft,
        offsetTop: viewport.offsetTop,
        scale: viewport.scale,
      };
      setState((previous) =>
        previous &&
        previous.width === next.width &&
        previous.height === next.height &&
        previous.offsetLeft === next.offsetLeft &&
        previous.offsetTop === next.offsetTop &&
        previous.scale === next.scale
          ? previous
          : next,
      );
    }

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return state;
}
