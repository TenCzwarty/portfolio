import Link from "next/link";

import { getYearPath } from "~wrapped/_const";

export const YearCard = ({ year }: { year: string }) => (
  <Link
    href={getYearPath(year)}
    className="wrapped-arcade rounded-lg bg-white/30 p-4 text-5xl backdrop-blur-md sm:text-8xl"
  >
    {year}
  </Link>
);
