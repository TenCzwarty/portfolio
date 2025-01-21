import { useEventListener } from "@/utils/use-event-listener";

export const useOnMouseMove = ({
  ref,
  onMouseMove,
}: {
  ref?: React.RefObject<SVGElement | HTMLElement | null>;
  onMouseMove: () => void;
}) => useEventListener({ ref, type: "mousemove", listener: onMouseMove });
