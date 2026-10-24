import React from "react";

const VOLUME_STEP = 0.05;
const VOLUME_STEP_INTERVAL = 20;

/** eases the volume (0-1) towards the target instead of cutting the sound */
export const useVolumeFade = (target: 0 | 1) => {
  const [volume, setVolume] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVolume((current) => {
        const next =
          target === 1 ? Math.min(current + VOLUME_STEP, 1) : Math.max(current - VOLUME_STEP, 0);

        if (next === target) clearInterval(interval);

        return next;
      });
    }, VOLUME_STEP_INTERVAL);

    return () => clearInterval(interval);
  }, [target]);

  return volume;
};
