"use client";

import type { TFoilCardProps } from "./types";

import { useTilt } from "~sumo/_helpers/use-tilt";

/**
 * Card surface that tilts toward the cursor with a foil shine and a glare
 * spot following it. The outer element catches the pointer and stays still,
 * so the tilt doesn't change what's under the cursor and jitter.
 */
export const FoilCard = ({ maxTilt = 10, className = "", children }: TFoilCardProps) => {
  const ref = useTilt<HTMLDivElement>(maxTilt);

  return (
    <div ref={ref} className="sumo-foil">
      <div className={`sumo-foil__card ${className}`}>
        {children}
        <div className="sumo-foil__shine" aria-hidden />
        <div className="sumo-foil__glare" aria-hidden />
      </div>
    </div>
  );
};
