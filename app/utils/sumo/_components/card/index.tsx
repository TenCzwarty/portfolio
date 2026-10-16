"use client";

import React from "react";
import NextImage from "next/image";

import type { TSumoCardProps } from "./types";

import { CardZoom } from "~sumo/_components/card-zoom";
import { FoilCard } from "~sumo/_components/foil-card";
import { getRikishi } from "~sumo/_const";

const RIKISHI = getRikishi();

export const SumoCard = (props: TSumoCardProps) => {
  const { title, number, src, finishes, rikishi } = props;
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

  return (
    <>
      <div className="flex flex-col items-center gap-1" title={details.join("\n")}>
        <FoilCard
          effect={finishes[0]?.effect}
          className="rounded-xl border border-neutral-200 bg-white p-2"
        >
          <div className="relative h-[160px] w-[112px] overflow-hidden rounded-lg bg-neutral-100">
            {imageSrc ? (
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className="block h-full w-full cursor-zoom-in"
                aria-label={`Zoom in on #${number} ${displayName}`}
              >
                <NextImage
                  src={imageSrc}
                  fill
                  sizes="112px"
                  className="object-cover"
                  alt={title}
                  onError={() => setImgError(true)}
                  unoptimized
                />
              </button>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-center text-neutral-400">
                <span className="text-2xl font-bold">#{number}</span>
                <span className="mt-1 px-1 text-xs leading-tight">{displayName}</span>
              </div>
            )}
          </div>
        </FoilCard>

        <h4 className="max-w-[120px] truncate text-center text-xs">{displayName}</h4>
        {kanji && (
          <span className="-mt-1 max-w-[120px] truncate text-center text-[10px] text-neutral-500">
            {kanji}
          </span>
        )}
      </div>

      {imageSrc && zoomed && (
        <CardZoom
          onClose={() => setZoomed(false)}
          src={imageSrc}
          alt={title}
          number={number}
          name={displayName}
          kanji={kanji}
          details={details}
          finishes={finishes}
        />
      )}
    </>
  );
};
