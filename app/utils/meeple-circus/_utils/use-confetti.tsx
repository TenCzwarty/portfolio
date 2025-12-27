"use client";

import React from "react";
import {
  confetti,
  type ConfettiOptions as TConfettiOptions,
} from "@tsparticles/confetti";
import { useOnMouseMove } from "~/utils/use-on-mouse-move";
import { getThemeColors } from "./get-theme-colors";

export const useConfetti = () => {
  const refIsInitialized = React.useRef(false);
  const refMousePosition = React.useRef({ x: 0, y: 0 });

  const onMouseMove = (e: MouseEvent) => {
    refMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  useOnMouseMove({ onMouseMove });

  // pre-initialize tsparticles on mount to prevent race conditions with tooltip cleanup
  React.useEffect(() => {
    if (refIsInitialized.current) {
      return;
    }

    confetti({
      count: 1,
      position: { x: -100, y: -100 },
      startVelocity: 0,
      gravity: 0,
      ticks: 1,
    });

    refIsInitialized.current = true;
  }, []);

  const trigger = React.useCallback((options?: TConfettiOptions) => {
    const pos = options?.position ?? refMousePosition.current;
    
    confetti({
      colors: getThemeColors(),
      spread: 60,
      ...options,

      position: {
        x: ((pos?.x ?? 0) / window.innerWidth) * 100,
        y: ((pos?.y ?? 0) / window.innerHeight) * 100,
      },
    });
  }, []);

  return trigger;
};
