"use client";

import React from "react";
import NextImage from "next/image";

import type { TSumoCardProps } from "./types";

import { CardZoom } from "~sumo/_components/card-zoom";
import { FinishIcon } from "~sumo/_components/finish-icon";
import { FoilCard } from "~sumo/_components/foil-card";
import { getRikishi } from "~sumo/_const";
import { ownedKey, useSumoContext } from "~sumo/_context";

const RIKISHI = getRikishi();

export const SumoCard = (props: TSumoCardProps) => {
  const { id, title, number, src, finishes, rikishi } = props;
  const { isOwned } = useSumoContext();
  const [imgError, setImgError] = React.useState(false);
  const [zoomed, setZoomed] = React.useState(false);

  const people = rikishi.map((slug) => RIKISHI[slug]);

  // Dual cards print "Mitakeumi Hisashi / Tamawashi Ichiro"
  const printedNames = title.split(" / ").map((name) => name.split(" ")[0]);
  // Some TCDB titles are kanji only — show the romanized shikona instead
  const displayName = printedNames
    .map((name, i) => (/[a-z]/i.test(name) ? name : (people[i]?.shikona.split(" ")[0] ?? name)))
    .join(" / ");

  const kanji = people
    .map((person) => person?.kanji?.split(" ")[0])
    .filter(Boolean)
    .join(" / ");

  const details = people.map((person, i) => {
    if (!person) return printedNames[i];
    const currentShikona = person.shikona.split(" ")[0];
    const name =
      currentShikona === printedNames[i]
        ? currentShikona
        : `${currentShikona} (${printedNames[i]} on card)`;
    return [name, person.topRank, person.heya].filter(Boolean).join(" · ");
  });

  const imageSrc = src && !imgError ? `/images/utils/sumo/${src}` : null;

  // Collected in the zoomed card; the grid shows one icon per owned variant
  const ownedFinishes = finishes.filter((finish) => isOwned(ownedKey(id, finish.id)));
  // finishes run from most common to rarest, so the last owned one is the rarest
  const shownFinish = ownedFinishes.at(-1) ?? finishes[0];

  const face = imageSrc ? (
    <NextImage
      src={imageSrc}
      fill
      sizes="112px"
      className="object-cover"
      alt={title}
      onError={() => setImgError(true)}
      unoptimized
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center text-center text-neutral-400">
      <span className="text-2xl font-bold">#{number}</span>
      <span className="mt-1 px-1 text-xs leading-tight">{displayName}</span>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center gap-1" title={details.join("\n")}>
        <FoilCard
          effect={shownFinish?.effect}
          className="rounded-xl border border-neutral-200 bg-white p-2"
        >
          <div className="relative h-[160px] w-[112px] overflow-hidden rounded-lg bg-neutral-100">
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="block h-full w-full cursor-zoom-in"
              aria-label={`Zoom in on #${number} ${displayName}`}
            >
              {face}
            </button>
          </div>

          {ownedFinishes.length > 0 && (
            <div className="bg-accent-900 pointer-events-none absolute right-0 bottom-0 z-10 flex gap-1 rounded-md p-1.5 text-white">
              {ownedFinishes.map((finish) => (
                <FinishIcon key={finish.id} effect={finish.effect ?? "sleeve"} size={14} />
              ))}
              <span className="sr-only">
                In your collection: {ownedFinishes.map((finish) => finish.name).join(", ")}
              </span>
            </div>
          )}
        </FoilCard>

        <h4 className="max-w-[120px] truncate text-center text-xs">{displayName}</h4>
        {kanji && (
          <span className="-mt-1 max-w-[120px] truncate text-center text-[10px] text-neutral-500">
            {kanji}
          </span>
        )}
      </div>

      {zoomed && (
        <CardZoom
          onClose={() => setZoomed(false)}
          src={imageSrc}
          alt={title}
          number={number}
          name={displayName}
          kanji={kanji}
          details={details}
          cardId={id}
          finishes={finishes}
        />
      )}
    </>
  );
};
