import React from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Tilts an element toward the pointer by writing CSS variables on it:
 * --rx / --ry (rotation in deg), --mx / --my (pointer position in %),
 * --hyp (0 at the center, 1 at a corner) and data-active while hovered.
 * Styles live in styles.css (.sumo-foil). Writes straight to the DOM once
 * per frame, so moving the mouse never re-renders React.
 */
export const useTilt = <T extends HTMLElement>(maxTilt: number) => {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia(REDUCED_MOTION).matches) return;

    let frame = 0;

    const onPointerMove = (e: PointerEvent) => {
      // A finger dragging over a card is a scroll, not a tilt
      if (e.pointerType === "touch") return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        element.dataset.active = "";
        element.style.setProperty("--rx", `${(-y * maxTilt * 2).toFixed(2)}deg`);
        element.style.setProperty("--ry", `${(x * maxTilt * 2).toFixed(2)}deg`);
        element.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
        element.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
        element.style.setProperty("--hyp", Math.min(Math.hypot(x, y) / 0.7071, 1).toFixed(3));
      });
    };

    const onPointerLeave = () => {
      cancelAnimationFrame(frame);
      delete element.dataset.active;
      for (const name of ["--rx", "--ry", "--mx", "--my", "--hyp"]) {
        element.style.removeProperty(name);
      }
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [maxTilt]);

  return ref;
};
