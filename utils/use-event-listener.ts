import React from "react";

type TParameters = {
  ref?: React.RefObject<SVGElement | HTMLElement | null>;
  type: string;
  listener: () => void;
};

export const useEventListener = ({ ref, type, listener }: TParameters) => {
  React.useEffect(() => {
    const element = ref?.current || window;

    element?.addEventListener(type, listener);

    return () => {
      element?.removeEventListener(type, listener);
    };
  }, [listener]);
};
