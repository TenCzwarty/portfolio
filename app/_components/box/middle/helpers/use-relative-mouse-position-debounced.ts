import React from "react";

import { debounce } from "~/utils/debounce";
import { useOnMouseMove } from "~/utils/use-on-mouse-move";

import { DEFAULT_POSITION } from "../const/position";
import type { TRef } from "../types";

import { getRelativeMousePosition } from "./get-relative-mouse-position";

export const useRelativeMousePositionDebounced = (ref: TRef) => {
  const [position, setPosition] = React.useState(DEFAULT_POSITION);

  const recalculateMousePosition = (event: React.MouseEvent) =>
    setPosition(getRelativeMousePosition({ ref, event }));

  const onMouseMove = React.useMemo(
    () => debounce(recalculateMousePosition),
    [],
  );

  useOnMouseMove({ ref, onMouseMove });

  return position;
};
