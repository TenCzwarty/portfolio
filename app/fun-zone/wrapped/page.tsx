"use client";

import { YearCard } from "./_components/year-card";
import { useBackgroundVideo } from "./_helpers/use-background-video";
import { useExpandingCircle } from "./_helpers/use-expanding-circle";
import { HOME_VIDEO, YEARS } from "./_const";

export default function FunZoneWrappedPage() {
  const ref = useExpandingCircle<HTMLElement>();

  useBackgroundVideo(HOME_VIDEO);

  return (
    <main ref={ref} className="flex min-h-dvh items-center justify-center p-8">
      <div className="grid grid-cols-2 justify-items-center gap-4">
        {YEARS.map(({ year }) => (
          <YearCard key={year} year={year} />
        ))}
      </div>
    </main>
  );
}
