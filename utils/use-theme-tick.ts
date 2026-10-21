import React from "react";

// a bit longer than the theme transition in globals.css, so the last frame lands on the final colors
const FOLLOW_MS = 2200;

/**
 * A counter that ticks every frame while the site theme changes (and its colors fade), for things
 * that read theme colors in JS - canvas, computed palettes - and should fade along with the page.
 */
export const useThemeTick = () => {
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    let frame: number | null = null;
    let until = 0;

    const follow = () => {
      setTick((t) => t + 1);
      frame = performance.now() < until ? requestAnimationFrame(follow) : null;
    };

    // the theme hues live in the inline style of <html>
    const observer = new MutationObserver(() => {
      until = performance.now() + FOLLOW_MS;
      if (frame === null) frame = requestAnimationFrame(follow);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return tick;
};
