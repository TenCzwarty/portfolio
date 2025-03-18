import React from "react";

import { random } from "./random";

export const useRandomInterval = ({
  callback,
  min = 0,
  max = 1000,
}: {
  callback: () => void;
  min: number;
  max: number;
}) => {
  const refInterval = React.useRef<NodeJS.Timeout>(null);
  const refCallback = React.useRef(() => {});

  React.useEffect(() => {
    refCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      refInterval.current = setTimeout(tick, random(min, max));

      if (refCallback.current) {
        refCallback.current();
      }
    }

    tick();

    return () => {
      if (refInterval.current) {
        clearTimeout(refInterval.current);
      }
    };
  }, []);
};
