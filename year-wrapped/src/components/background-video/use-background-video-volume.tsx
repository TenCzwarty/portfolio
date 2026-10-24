import React from 'react';

import { useToggle } from '@/src/utils/use-toggle';

const VOLUME_STEP = 0.05;

export const useBackgroundVideoVolume = () => {
  const [isMuted, toggleIsMuted] = useToggle(true);
  const [volume, setVolume] = React.useState<number>(0);

  const fadeInterval = React.useRef<NodeJS.Timeout | null>(null);

  const startVolumeFade = (targetVolume: number): void => {
    if (fadeInterval.current) {
      clearInterval(fadeInterval.current);
    }

    fadeInterval.current = setInterval(() => {
      setVolume((currentVolume: number) => {
        const newVolume = targetVolume === 1
          ? Math.min(currentVolume + VOLUME_STEP, 1)
          : Math.max(currentVolume - VOLUME_STEP, 0);

        if (newVolume === targetVolume) {
          if (fadeInterval.current) {
            clearInterval(fadeInterval.current);
          }
        }
        return newVolume;
      });
    }, 1 / VOLUME_STEP);
  };

  React.useEffect(() => {
    startVolumeFade(isMuted ? 0 : 1);

    return () => {
      if (fadeInterval.current) {
        clearInterval(fadeInterval.current);
      }
    };
  }, [isMuted]);

  return { 
    volume, 
    isMuted, 
    toggleIsMuted,
    mute: () => toggleIsMuted(true),
    unmute: () => toggleIsMuted(false)
  };
};
