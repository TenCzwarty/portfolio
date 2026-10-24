"use client";

import { ChevronLeftIcon, ChevronRightIcon, HouseIcon } from "lucide-react";
import Link from "next/link";

import { getYearPath, WRAPPED_PATH, YEARS } from "~wrapped/_const";
import type { TWrappedYear } from "~wrapped/_const/types";
import { useBackgroundVideo } from "~wrapped/_helpers/use-background-video";
import { useExpandingCircle } from "~wrapped/_helpers/use-expanding-circle";

const BUTTON_CLASSES = "rounded-full bg-blue-500 p-3 text-white transition-colors";

const NavLink = ({ year, label, icon }: { year?: string; label: string; icon: React.ReactNode }) =>
  year ? (
    <Link
      href={getYearPath(year)}
      className={`${BUTTON_CLASSES} hover:bg-blue-600`}
      aria-label={label}
    >
      {icon}
    </Link>
  ) : (
    <span className={`${BUTTON_CLASSES} cursor-not-allowed opacity-40`} aria-hidden>
      {icon}
    </span>
  );

/** a year that has its music but no slides yet */
export const YearPlaceholder = ({ entry }: { entry: TWrappedYear }) => {
  const ref = useExpandingCircle<HTMLElement>();
  const index = YEARS.findIndex(({ year }) => year === entry.year);

  useBackgroundVideo(entry);

  return (
    <main ref={ref} className="flex min-h-dvh flex-col items-center justify-center p-8 sm:p-20">
      <h1 className="mb-8 text-center text-4xl font-bold">{entry.year}</h1>
      <div className="flex items-center gap-4">
        <NavLink
          year={YEARS[index - 1]?.year}
          label="Previous year"
          icon={<ChevronLeftIcon size={24} />}
        />
        <Link
          href={WRAPPED_PATH}
          className={`${BUTTON_CLASSES} hover:bg-blue-600`}
          aria-label="Back to the years"
        >
          <HouseIcon size={24} />
        </Link>
        <NavLink
          year={YEARS[index + 1]?.year}
          label="Next year"
          icon={<ChevronRightIcon size={24} />}
        />
      </div>
    </main>
  );
};
