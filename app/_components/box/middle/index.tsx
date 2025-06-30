import type { TSVGArtVariant } from "./art/types";
import { getPath } from "./art";

import "./styles.css";

export const SVGArt = ({ variant }: { variant: TSVGArtVariant }) => {
  const path = getPath(variant);

  return (
    <div className="svg-art h-full overflow-hidden rounded-[30%] select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 500 500"
        className="relative"
      >
        <path
          d="M0 0h500v500H0z"
          fill="var(--color-accent-500)"
          className="transform-gpu duration-[2s]"
        />

        <g className="colored-circles text-primary-800 transform-gpu will-change-[fill]">
          {path}
        </g>
      </svg>
    </div>
  );
};
