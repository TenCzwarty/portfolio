import { useEventListener } from "~/utils/use-event-listener";

type TParameters<T extends Array<unknown>> = {
  ref?: React.RefObject<SVGElement | HTMLElement | null>;
  onMouseMove: (...args: T) => void;
};

export const useOnMouseMove = <T extends Array<unknown>>({
  ref,
  onMouseMove,
}: TParameters<T>) =>
  useEventListener({ ref, type: "mousemove", listener: onMouseMove });
