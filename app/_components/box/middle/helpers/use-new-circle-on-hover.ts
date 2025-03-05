import React from "react";

import { appendSvgCircle } from "./append-svg-circle";
import { useRelativeMousePositionDebounced } from "./use-relative-mouse-position-debounced";

export const useNewCircleOnHover = (svgElementId: string) => {
  const ref = React.useRef<SVGSVGElement>(null);

  const position = useRelativeMousePositionDebounced(ref);

  const onRelativeMousePositionUpdated = () => {
    appendSvgCircle(svgElementId, position);
  };

  React.useEffect(onRelativeMousePositionUpdated, [position]);

  return { ref };
};
