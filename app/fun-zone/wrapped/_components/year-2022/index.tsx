"use client";

import React from "react";

import { Loader } from "../loader";

import type { TWrappedYear } from "~wrapped/_const/types";
import { useBackgroundVideo } from "~wrapped/_helpers/use-background-video";
import { useExpandingCircle } from "~wrapped/_helpers/use-expanding-circle";

// delays count from the moment the song starts (at 3:06), so the lines land on the beat
const SLIDES = [
  { delay: 7_000, content: <h1 className="text-8xl">2022</h1> },
  { delay: 14_000, content: <p className="text-5xl">to rok</p> },
  { delay: 21_000, content: <p className="wrapped-font-fix text-8xl">dosko(naly)</p> },
  { delay: 28_000, content: <p className="text-5xl">94 spotkan</p> },
  { delay: 35_000, content: <p className="text-5xl">87 gier</p> },
  { delay: 42_000, content: <p className="text-5xl">xxx</p> },
];

export const Year2022 = ({ entry }: { entry: TWrappedYear }) => {
  const ref = useExpandingCircle<HTMLElement>();
  const refTimeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const [isStarted, setIsStarted] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(0);

  const clearTimeouts = () => refTimeouts.current.forEach(clearTimeout);

  const onStart = () => {
    clearTimeouts();
    setIsStarted(true);
    setVisibleCount(0);

    refTimeouts.current = SLIDES.map(({ delay }, index) =>
      setTimeout(() => setVisibleCount(index + 1), delay)
    );
  };

  React.useEffect(() => clearTimeouts, []);

  useBackgroundVideo({ ...entry, onStart });

  return (
    <main ref={ref} className="flex min-h-dvh flex-col items-center justify-center p-8 sm:p-20">
      <div className="wrapped-beat text-center">
        {isStarted ? (
          SLIDES.slice(0, visibleCount).map(({ delay, content }) => (
            <React.Fragment key={delay}>{content}</React.Fragment>
          ))
        ) : (
          <Loader color="#ffd600" />
        )}
      </div>
      <p className="text-5xl"> =&gt; </p>
    </main>
  );
};
