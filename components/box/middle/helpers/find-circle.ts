import { CIRCLES } from "../const/circles";
import type { CircleType, CoordinatesType } from "../types";

type Props = CircleType | null;

export const findCircle = ({ x, y }: CoordinatesType): Props =>
  CIRCLES.find((circle) => {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= circle.r;
  }) || null;
