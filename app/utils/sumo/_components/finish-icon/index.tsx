import {
  Flower2Icon,
  GripIcon,
  HeartIcon,
  RectangleVerticalIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";

import type { TFinishIconProps } from "./types";

import type { TFinishEffect } from "~sumo/_const/types";

const ICONS = {
  sleeve: RectangleVerticalIcon,
  sparkle: SparklesIcon,
  sakura: Flower2Icon,
  dots: GripIcon,
  hearts: HeartIcon,
  stars: StarIcon,
  starburst: SparklesIcon,
} satisfies Record<TFinishEffect, unknown>;

/** One icon per finish effect, shared by the zoomed card and the grid */
export const FinishIcon = ({ effect, size = 24, className }: TFinishIconProps) => {
  const Icon = ICONS[effect];
  return <Icon size={size} className={className} aria-hidden />;
};
