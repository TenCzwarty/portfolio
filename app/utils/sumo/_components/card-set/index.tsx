"use client";

import type { TSumoCardSetProps } from "./types";

import { SumoCard } from "~sumo/_components/card";

export const SumoCardSet = ({ sumoSet, isSettingsOpened }: TSumoCardSetProps) => {
  const { set, year, label, cards } = sumoSet;

  const subtitle = label ? `${year} — ${label}` : `${year}`;

  return (
    <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{set}</h3>
          <span className="text-sm text-neutral-500">{subtitle}</span>
        </div>

        <span className="text-sm text-neutral-500">
          {cards.length} cards
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {cards.map((card) => (
          <SumoCard key={card.id} {...card} isSettingsOpened={isSettingsOpened} />
        ))}
      </div>
    </div>
  );
};
