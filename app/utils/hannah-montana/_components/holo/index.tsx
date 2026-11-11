"use client";

import React from "react";

import {
  ARM_LAYER_OPACITY,
  ARM_PATHS,
  ARMS,
  HALF,
  OUTSIDE_STAR_PATH,
  REFLECTIONS,
  STAR_PATH,
  T,
} from "./geometry";
import type { THannahHoloProps } from "./types";

import "./holo.css";

// The overlay's own units: card-shaped, 100 wide
const VIEW_W = 100;
const VIEW_H = 143;
// One circle spacing on the card, in those units (~2.4 circles across)
const TILE = 41.6;
// One full rainbow along the gradient, in card units
const RAINBOW_LENGTH = 70;
const RAINBOW = [
  "hsl(0 100% 62%)",
  "hsl(45 100% 58%)",
  "hsl(110 100% 55%)",
  "hsl(185 100% 58%)",
  "hsl(240 100% 66%)",
  "hsl(300 100% 64%)",
  "hsl(0 100% 62%)",
];

/**
 * The sparkle cards' holo print as a lattice of reflections, each a 10-arm
 * sunburst that turns a few degrees around its own center as the card tilts.
 * The lattice is a mask over one rainbow that slides gently across the card
 * (the tilt variables come from the FoilCard around it, see holo.css). Lives
 * inside a FoilCard with effect "starburst", over the card picture.
 */
export const HannahHolo = ({ cardNumber }: THannahHoloProps) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (name: string) => `hm-holo-${uid}-${name}`;

  // The foil was laid on the sheet before cutting, so the lattice falls
  // differently on every card: a fixed shift within one tile per card number
  const n = Number(cardNumber);
  const offsetX = ((n * 0.618034) % 1) * TILE;
  const offsetY = ((n * 0.414214 + 0.37) % 1) * TILE;

  return (
    <svg
      className="hm-holo"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <clipPath id={id("outside-star")}>
          <path clipRule="evenodd" d={OUTSIDE_STAR_PATH} />
        </clipPath>
        <clipPath id={id("star")}>
          <path d={STAR_PATH} />
        </clipPath>
        {REFLECTIONS.map((r) => (
          <clipPath key={r.id} id={id(r.id)}>
            {"circle" in r.clip ? (
              <circle cx={r.clip.circle[0]} cy={r.clip.circle[1]} r={HALF} />
            ) : (
              <rect
                x={r.clip.quarter[0] < 0 ? 0 : HALF}
                y={r.clip.quarter[1] < 0 ? 0 : HALF}
                width={HALF}
                height={HALF}
              />
            )}
          </clipPath>
        ))}

        <pattern
          id={id("tile")}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
          width={TILE}
          height={TILE}
          viewBox={`0 0 ${T} ${T}`}
        >
          {REFLECTIONS.map((r) => (
            <g key={r.id} clipPath={`url(#${id("circle" in r.clip ? "outside-star" : "star")})`}>
              <g clipPath={`url(#${id(r.id)})`}>
                <g transform={`translate(${r.cx} ${r.cy})`}>
                  <g
                    className="hm-holo__spin"
                    style={{ "--phase": `${r.phase}deg` } as React.CSSProperties}
                  >
                    {Array.from({ length: ARMS }, (_, i) => (
                      <g key={i} transform={`rotate(${(i * 360) / ARMS})`}>
                        {ARM_PATHS.map((d) => (
                          <path key={d} d={d} fill="white" fillOpacity={ARM_LAYER_OPACITY} />
                        ))}
                      </g>
                    ))}
                  </g>
                </g>
              </g>
            </g>
          ))}
        </pattern>

        {/* the lattice is only a mask: the colors are one rainbow over the card */}
        <mask id={id("mask")}>
          <rect width={VIEW_W} height={VIEW_H} fill={`url(#${id("tile")})`} />
        </mask>
        <linearGradient
          id={id("rainbow")}
          gradientUnits="userSpaceOnUse"
          spreadMethod="repeat"
          x1="0"
          y1="0"
          x2={RAINBOW_LENGTH}
          y2={RAINBOW_LENGTH * 0.6}
        >
          {RAINBOW.map((color, i) => (
            <stop key={i} offset={i / (RAINBOW.length - 1)} stopColor={color} />
          ))}
        </linearGradient>
      </defs>

      <g mask={`url(#${id("mask")})`}>
        {/* bigger than the card so it can slide with the tilt */}
        <rect
          className="hm-holo__rainbow"
          x={-VIEW_W}
          y={-VIEW_H}
          width={VIEW_W * 3}
          height={VIEW_H * 3}
          fill={`url(#${id("rainbow")})`}
        />
      </g>
    </svg>
  );
};
