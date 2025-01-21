import React from "react";

import { useNewCircleOnHover } from "./helpers/use-new-circle-on-hover";

import { PATH } from "./const/path";

import "./styles.css";

const SVG_ELEMENT_ID = "svg-element";

export const BoxMiddle = () => {
  const { ref } = useNewCircleOnHover(SVG_ELEMENT_ID);

  return (
    <div className="h-full select-none overflow-hidden rounded-[30%]">
      <svg
        ref={ref}
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

        <g
          fill="var(--color-primary-800)"
          transform="translate(16982.422,9783.2031)"
          className="transform-gpu duration-[2s] will-change-[fill]"
        >
          <path d={PATH} />
        </g>

        <g id={SVG_ELEMENT_ID} className="colored-circles text-accent-900" />
      </svg>
    </div>
  );
};
