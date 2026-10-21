"use client";

import React from "react";
import { CheckIcon } from "lucide-react";
import NextImage from "next/image";

import { toast } from "~/components/toast";

import type { TSumoCardProps } from "./types";

import { CardZoom } from "~sumo/_components/card-zoom";
import { FoilCard } from "~sumo/_components/foil-card";
import { getRikishi } from "~sumo/_const";
import { ownedKey, useSumoContext } from "~sumo/_context";

const RIKISHI = getRikishi();

export const SumoCard = ({ isSettingsOpened, ...props }: TSumoCardProps) => {
  const { id, title, number, src, finishes, rikishi } = props;
  const { isOwned, toggleOwned } = useSumoContext();
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

  const ownedNames = finishes
    .filter((finish) => isOwned(ownedKey(id, finish.id)))
    .map((finish) => finish.name);

  // Like the hanayama tracker: with settings open, a click collects the
  // standard version; the other finishes are collected in the zoomed card
  const baseKey = ownedKey(id, finishes[0].id);
  const isBaseOwned = isOwned(baseKey);
  const collectLabel = isBaseOwned
    ? `removed #${number} ${displayName} from your collection`
    : `added #${number} ${displayName} to your collection`;

  const collect = () => {
    toast(collectLabel);
    toggleOwned(baseKey);
  };

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
          effect={finishes[0]?.effect}
          className="rounded-xl border border-neutral-200 bg-white p-2"
        >
          <div className="relative h-[160px] w-[112px] overflow-hidden rounded-lg bg-neutral-100">
            {isSettingsOpened || imageSrc ? (
              <button
                type="button"
                onClick={isSettingsOpened ? collect : () => setZoomed(true)}
                className={`block h-full w-full ${isSettingsOpened ? "cursor-pointer" : "cursor-zoom-in"}`}
                aria-label={
                  isSettingsOpened
                    ? `${isBaseOwned ? "Remove" : "Add"} #${number} ${displayName} ${isBaseOwned ? "from" : "to"} your collection`
                    : `Zoom in on #${number} ${displayName}`
                }
              >
                {face}
              </button>
            ) : (
              face
            )}
          </div>

          {ownedNames.length > 0 && (
            <div className="bg-accent-900 pointer-events-none absolute right-0 bottom-0 z-10 rounded-md p-1.5 text-white">
              <CheckIcon size={16} aria-hidden />
              <span className="sr-only">In your collection: {ownedNames.join(", ")}</span>
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

      {imageSrc && zoomed && (
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
