import React from "react";

export const useEventListener = ({
  ref,
  type,
  listener,
}: {
  ref?: React.RefObject<SVGElement | HTMLElement | null>;
  type: string;
  listener: () => void;
}) => {
  React.useEffect(() => {
    const element = ref?.current || window;

    element?.addEventListener(type, listener);

    return () => {
      element?.removeEventListener(type, listener);
    };
  }, [listener]);
};
