import {
  AwardIcon,
  CheckIcon,
  CoinsIcon,
  CrownIcon,
  FishIcon,
  GemIcon,
  RatIcon,
  SquirrelIcon,
  SwordsIcon,
  VenetianMask,
} from "lucide-react";

import type { TPuzzleIcon } from "./types";

import type { TPuzzleSeries } from "~hanayama/_components/puzzle/types";

export const Icon = {
  rarity: {
    basic: CoinsIcon,
    rare: GemIcon,
  },
  series: {
    chess: CrownIcon,
    disney: RatIcon,
    pokemon: SquirrelIcon,
    sea: FishIcon,
    ultraman: VenetianMask,
    zelda: SwordsIcon,
  },
  status: {
    completed: AwardIcon,
    collected: CheckIcon,
  },
} satisfies TPuzzleIcon;

export const getSeriesIcon = (series: TPuzzleSeries) => {
  const SeriesIcon = Icon.series[series] || series;

  return <SeriesIcon />;
};
