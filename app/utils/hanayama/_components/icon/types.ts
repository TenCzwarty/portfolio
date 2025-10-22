import React from "react";

import type {
  TPuzzleRarity,
  TPuzzleSeries,
  TPuzzleStatus,
} from "../puzzle/types";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type TPuzzleIcon = {
  rarity: Record<TPuzzleRarity, IconComponent>;
  series: Record<TPuzzleSeries, IconComponent>;
  status: Record<TPuzzleStatus, IconComponent>;
};
