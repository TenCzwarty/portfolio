import React from "react";

import { coinToss, random } from "~/utils/random";
import { useRandomInterval } from "~/app/_components/box-mini-website/wood-hub/utils/useRandomInterval";

import "./styles.css";

const WOOD_LOG_ROLLING_SPEED = 0.5;
const WOOD_GRAIN_LENGTH_MIN = 3;
const WOOD_GRAIN_LENGTH_MAX = 15;
const WOOD_GRAIN_DENSITY = 5;

const wood_log_roll_time = 1000 / WOOD_LOG_ROLLING_SPEED;

export const LogoWoodHub = ({ height = 32, isAnimationPaused = true }) => {
  const refPaths = React.useRef<SVGGElement>(null);

  const createRandomWoodGrain = () => {
    if (isAnimationPaused) return;

    const element = refPaths.current;

    if (!element) return;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute(
      "d",
      `M -26.034107,0.50079 h ${random(
        WOOD_GRAIN_LENGTH_MIN,
        WOOD_GRAIN_LENGTH_MAX,
      )}`,
    );

    path.classList.add("grain");

    if (coinToss()) {
      path.classList.add("reversed");
    }

    if (coinToss()) {
      path.style.setProperty("offset-anchor", `-${random(10, 90)}% 0`);
    }

    element.appendChild(path);

    setTimeout(() => path.remove(), wood_log_roll_time);
  };

  useRandomInterval({
    callback: createRandomWoodGrain,
    min: 0,
    max: wood_log_roll_time / WOOD_GRAIN_DENSITY,
  });

  return (
    <svg
      viewBox="0 0 16 33"
      version="1.1"
      width={(70 / 32) * height}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      strokeLinecap="round"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
      style={
        {
          "--roll-animation-duration": `${wood_log_roll_time}ms`,
        } as React.CSSProperties
      }
    >
      <g ref={refPaths} />
      <path d="m 33.688134,1.024524 c 4.672,0 8.46,6.77 8.46,15.12 0,8.351 -3.788,15.121 -8.46,15.121 m 0,0 h -50.75 m 50.75,-30.241 h -50.75" />
      <path d="m -8.60086,16.14552 c 0,8.35 -3.788,15.12 -8.46,15.12 -4.672,0 -8.46,-6.77 -8.46,-15.12 0,-8.351 3.788,-15.12 8.46,-15.12 4.672,0 8.46,6.769 8.46,15.12 z" />
      <path d="m -11.68287,16.14552 a 5.3779998,9.816 0 0 1 -5.378,9.816 5.3779998,9.816 0 0 1 -5.378,-9.816 5.3779998,9.816 0 0 1 5.378,-9.816 5.3779998,9.816 0 0 1 5.378,9.816 z" />
      <path d="m -14.59687,16.14552 a 2.464,4.8010001 0 0 1 -2.464,4.801 2.464,4.8010001 0 0 1 -2.464,-4.801 2.464,4.8010001 0 0 1 2.464,-4.80101 2.464,4.8010001 0 0 1 2.464,4.80101 z" />
    </svg>
  );
};
