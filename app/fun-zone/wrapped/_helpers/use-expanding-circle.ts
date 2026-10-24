import React from "react";

import { createExpandingCircle } from "~wrapped/_utils/expanding-circle";

/** a circle spreads from the click point whenever a link inside the ref is clicked */
export const useExpandingCircle = <T extends HTMLElement>() => {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("a")) return;

      createExpandingCircle({
        x: event.clientX,
        y: event.clientY,
        size: Math.max(window.innerWidth, window.innerHeight) * 2,
      });
    };

    element.addEventListener("click", onClick);

    return () => element.removeEventListener("click", onClick);
  }, []);

  return ref;
};
