import { useEventListener } from "~/utils/use-event-listener";

type TParameters = {
  ref?: React.RefObject<SVGElement | HTMLElement | null>;
  onMouseMove: () => void;
};

export const useOnMouseMove = ({ ref, onMouseMove }: TParameters) =>
  useEventListener({ ref, type: "mousemove", listener: onMouseMove });
