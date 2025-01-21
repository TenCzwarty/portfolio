import React from "react";

import { useOnMouseMove } from "@/utils/use-on-mouse-move";
import { debounce } from "@/utils/debounce";

import { getRelativeMousePosition } from "./get-relative-mouse-position";

import { RefType } from "../types";

import { DEFAULT_POSITION } from "../const/position";

export const useRelativeMousePositionDebounced = (ref: RefType) => {
  const [position, setPosition] = React.useState(DEFAULT_POSITION);

  const recalculateMousePosition = (event: React.MouseEvent) =>
    setPosition(getRelativeMousePosition({ ref, event }));

  const onMouseMove = React.useCallback(
    React.useMemo(() => debounce(recalculateMousePosition), []),
    [],
  );

  useOnMouseMove({ ref, onMouseMove });

  return position;
};
