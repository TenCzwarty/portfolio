import React from "react";

export const useEventListener = ({
  type,
  listener,
}: {
  type: string;
  listener: () => void;
}) => {
  React.useEffect(() => {
    listener();

    window.addEventListener(type, listener);

    return () => window.removeEventListener(type, listener);
  }, []);
};
