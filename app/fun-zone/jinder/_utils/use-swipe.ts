import React from "react";

const THRESHOLD = 120;
const SLOP = 10;
const IGNORED = "input, textarea, select, button, a, label, [data-no-swipe]";

/**
 * Horizontal drag on the card. Vertical movement is left to the browser (scrolling the
 * description), and interactive elements inside the card keep working as usual.
 */
export const useSwipe = (onSwipe: (keep: boolean) => void, enabled: boolean) => {
  const [offset, setOffset] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const start = React.useRef<{ x: number; y: number } | null>(null);

  const reset = React.useCallback(() => {
    start.current = null;
    setDragging(false);
    setOffset(0);
  }, []);

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (!enabled || e.button !== 0) return;
      if ((e.target as HTMLElement).closest(IGNORED)) return;
      start.current = { x: e.clientX, y: e.clientY };
      // capture right away – grabbed near the edge, the pointer leaves the card within a few px
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!start.current) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;

      if (!dragging) {
        if (Math.abs(dy) > SLOP && Math.abs(dy) > Math.abs(dx)) {
          start.current = null;
          return;
        }
        if (Math.abs(dx) < SLOP) return;
        setDragging(true);
        window.getSelection()?.removeAllRanges();
      }
      setOffset(dx);
    },
    onPointerUp: () => {
      if (dragging && Math.abs(offset) > THRESHOLD) onSwipe(offset > 0);
      else reset();
      start.current = null;
      setDragging(false);
    },
    onPointerCancel: () => reset(),
    // dragging selected text would start the browser's own drag & drop and cancel the swipe
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
  };

  return { offset, dragging, handlers, reset, threshold: THRESHOLD };
};
