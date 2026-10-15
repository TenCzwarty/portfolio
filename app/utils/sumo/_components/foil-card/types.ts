import type { TFinishEffect } from "~sumo/_const/types";

export type TFoilCardProps = {
  /** degrees the card leans at its edges */
  maxTilt?: number;
  effect?: TFinishEffect;
  className?: string;
  children: React.ReactNode;
};
