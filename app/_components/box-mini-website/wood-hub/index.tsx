import React from "react";

import { LogoWoodHub } from "./components/logo";

export const BoxWoodHub = () => {
  const [isAnimationPaused, setisAnimationPaused] = React.useState(true);

  const pause = () => setisAnimationPaused(true);
  const unpause = () => setisAnimationPaused(false);

  return (
    <a
      onMouseEnter={unpause}
      onMouseLeave={pause}
      target="_blank"
      rel="noreferrer noopener"
      className="box group border-primary-800 hover:bg-accent-500 hover:text-primary-900 cursor-not-allowed"
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold sm:text-xl">woodhub.pl</h3>
          <div className="text-sm">in progress...</div>
        </div>
        <LogoWoodHub isAnimationPaused={isAnimationPaused} />
      </div>
    </a>
  );
};
