"use client";

import React from "react";

import { ARM_PATH, ARMS, HALF, OUTSIDE_STAR_PATH, REFLECTIONS, STAR_PATH, T } from "./geometry";
import type { THannahHoloProps } from "./types";

import "./holo.css";

// The overlay's own units: card-shaped, 100 wide
const VIEW_W = 100;
const VIEW_H = 143;
// One circle spacing on the card, in those units (~2.4 circles across)
const TILE = 41.6;

/**
 * The sparkle cards' holo print as a lattice of reflections, each a 10-arm
 * sunburst that turns around its own center as the card tilts (the tilt
 * variables come from the FoilCard around it, see holo.css). Lives inside a
 * FoilCard with effect "starburst", over the card picture.
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
                      <path
                        key={i}
                        d={ARM_PATH}
                        transform={`rotate(${(i * 360) / ARMS})`}
                        style={{
                          fill: `hsl(calc(var(--holo-hue) + ${(i * 360) / ARMS + r.phase}deg) 100% 62%)`,
                        }}
                      />
                    ))}
                  </g>
                </g>
              </g>
            </g>
          ))}
        </pattern>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill={`url(#${id("tile")})`} />
    </svg>
  );
};
