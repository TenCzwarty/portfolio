import { ICONS_MOON_PHASES } from "./icons";

import type { TResetsArray } from "~amasia/_components/input-date/types";
import AMASIA_YEARS_INANIS from "~amasia/_const/amasia-years-inanis.json";
import { bisect } from "~amasia/_utils/bisect";

export const getMoonPhaseIcon = (resetsArray: TResetsArray, day: number) => {
  // fix misaligned Inanis days
  if (AMASIA_YEARS_INANIS.some((d) => d == day)) {
    return ICONS_MOON_PHASES[4];
  }

  const id = bisect(resetsArray)(day);
  const d = day - resetsArray[id] + 1;
  const month_length = resetsArray[id + 1] - resetsArray[id];

  return ICONS_MOON_PHASES[
    Math.floor((d / month_length) * (ICONS_MOON_PHASES.length - 1))
  ];
};
