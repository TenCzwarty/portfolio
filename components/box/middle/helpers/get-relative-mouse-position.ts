import { DEFAULT_POSITION } from "../const/position";
import type { TRef } from "../types";

type TParameters = {
  ref: TRef;
  event: React.MouseEvent;
};

export const getRelativeMousePosition = ({ ref, event }: TParameters) => {
  const viewBox = ref?.current?.getAttribute("viewBox");

  if (!viewBox) return DEFAULT_POSITION;

  const rect = ref?.current?.getBoundingClientRect();

  if (!rect) return DEFAULT_POSITION;

  const [maxX, maxY] = viewBox
    ? viewBox.split(" ").slice(2).map(Number)
    : [0, 0];

  const x = ((event.clientX - rect.left) / rect.width) * maxX;
  const y = ((event.clientY - rect.top) / rect.height) * maxY;

  return { x, y };
};
