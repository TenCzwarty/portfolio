import { TransitionLink } from "../transition-link";

import { getYearPath } from "~wrapped/_const";

export const YearCard = ({ year }: { year: string }) => (
  <TransitionLink
    href={getYearPath(year)}
    className="wrapped-arcade rounded-lg bg-white/30 p-4 text-5xl backdrop-blur-md sm:text-8xl"
  >
    {year}
  </TransitionLink>
);
