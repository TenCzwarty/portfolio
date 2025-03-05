import { CIRCLES } from "../const/circles";
import type { TCircle, TCoordinates } from "../types";

type TReturn = TCircle | null;

export const findCircle = ({ x, y }: TCoordinates): TReturn =>
  CIRCLES.find((circle) => {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= circle.r;
  }) || null;
