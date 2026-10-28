"use client";

import React from "react";
import NextImage from "next/image";

import type { THannahCardProps } from "./types";

import { HannahCardZoom } from "~hannah-montana/_components/card-zoom";
import { useHannahContext } from "~hannah-montana/_context";
import { FinishIcon } from "~sumo/_components/finish-icon";
import { FoilCard } from "~sumo/_components/foil-card";
import { ownedKey } from "~sumo/_context";
import type { TCardSize } from "~sumo/_context/types";

// Same sizes as the sumo grid; full class names so Tailwind keeps them
const SIZES = {
  small: { face: "h-[120px] w-[84px]", px: "84px", number: "text-lg", icon: 12 },
  medium: { face: "h-[160px] w-[112px]", px: "112px", number: "text-2xl", icon: 14 },
  large: { face: "h-[240px] w-[168px]", px: "168px", number: "text-4xl", icon: 16 },
} satisfies Record<TCardSize, unknown>;

export const HannahCard = ({ card }: THannahCardProps) => {
  const { isOwned, cardSize } = useHannahContext();
  const [imgError, setImgError] = React.useState(false);
  const [zoomed, setZoomed] = React.useState(false);

  const size = SIZES[cardSize];
  const src = card.src && !imgError ? `/images/utils/hannah-montana/${card.src}` : null;

  const ownedFinishes = card.finishes.filter((finish) => isOwned(ownedKey(card.id, finish.id)));
  // finishes run from most common to rarest, so the last owned one is the rarest
  const shownFinish = ownedFinishes.at(-1) ?? card.finishes[0];

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <FoilCard
          effect={shownFinish.effect}
          className="rounded-xl border border-neutral-200 bg-white p-2"
        >
          <div className={`relative ${size.face} overflow-hidden rounded-lg bg-neutral-100`}>
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="block h-full w-full cursor-zoom-in"
              aria-label={`Zoom in on Hannah Montana card #${card.number}`}
            >
              {src ? (
                <NextImage
                  src={src}
                  fill
                  sizes={size.px}
                  className="object-cover"
                  alt={`Hannah Montana card #${card.number}`}
                  onError={() => setImgError(true)}
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  <span className={`${size.number} font-bold`}>#{card.number}</span>
                </div>
              )}
            </button>
          </div>

          {ownedFinishes.length > 0 && (
            <div className="bg-accent-900 pointer-events-none absolute right-0 bottom-0 z-10 flex gap-1 rounded-md p-1.5 text-white">
              {ownedFinishes.map((finish) => (
                <FinishIcon key={finish.id} effect={finish.effect ?? "sleeve"} size={size.icon} />
              ))}
              <span className="sr-only">
                In your collection: {ownedFinishes.map((finish) => finish.name).join(", ")}
              </span>
            </div>
          )}
        </FoilCard>

        <h4 className="text-center text-xs">#{card.number}</h4>
      </div>

      {zoomed && <HannahCardZoom card={card} src={src} onClose={() => setZoomed(false)} />}
    </>
  );
};
