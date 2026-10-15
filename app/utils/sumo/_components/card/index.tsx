"use client";

import React from "react";
import NextImage from "next/image";

import { Pill } from "~/components/pill";

import type { TSumoCardProps } from "./types";

import { getRikishi } from "~sumo/_const";

const RIKISHI = getRikishi();

export const SumoCard = (props: TSumoCardProps) => {
  const { title, number, src, finishes, rikishi } = props;
  const [imgError, setImgError] = React.useState(false);

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

  const tooltip = people
    .map((person, i) => {
      if (!person) return printedNames[i];
      const currentShikona = person.shikona.split(" ")[0];
      const name =
        currentShikona === printedNames[i]
          ? currentShikona
          : `${currentShikona} (${printedNames[i]} on card)`;
      return [name, person.topRank, person.heya].filter(Boolean).join(" · ");
    })
    .join("\n");

  const imageSrc = src ? `/images/utils/sumo/${src}` : null;

  return (
    <div className="flex flex-col items-center gap-1" title={tooltip}>
      <div className="group relative rounded-xl border border-neutral-200 bg-white p-2">
        <div className="relative h-[160px] w-[112px] overflow-hidden rounded-lg bg-neutral-100">
          {imageSrc && !imgError ? (
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
          )}
        </div>

        {finishes.length > 1 && (
          <div className="absolute top-1 right-1 flex gap-0.5">
            {finishes.slice(1).map((finish) => (
              <Pill key={finish.id} classes="!px-1.5 !py-0 text-[10px]">
                {finish.name}
              </Pill>
            ))}
          </div>
        )}
      </div>

      <h4 className="max-w-[120px] truncate text-center text-xs">{displayName}</h4>
      {kanji && (
        <span className="-mt-1 max-w-[120px] truncate text-center text-[10px] text-neutral-500">
          {kanji}
        </span>
      )}
    </div>
  );
};
