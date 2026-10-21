"use client";

import type { TSumoCardSetProps } from "./types";

import { SumoCard } from "~sumo/_components/card";

export const SumoCardSet = ({ sumoSet }: TSumoCardSetProps) => {
  const { set, year, label, themes, cards } = sumoSet;

  const subtitle = label ? `${year} — ${label}` : `${year}`;

  // Cards grouped by checklist chapter; the Japanese name shows when it adds
  // something beyond the English one
  const groups = themes.map((theme) => ({
    ...theme,
    cards: cards.filter((card) => card.theme === theme.id),
  }));

  return (
    <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{set}</h3>
          <span className="text-sm text-neutral-500">{subtitle}</span>
        </div>

        <span className="text-sm text-neutral-500">{cards.length} cards</span>
      </div>

      <div className="mt-4 space-y-6">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`theme-${group.id}`}>
            <h4 id={`theme-${group.id}`} className="mb-3 flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold">{group.name}</span>
              {group.nameJa !== group.name && (
                <span className="text-sm text-neutral-500">{group.nameJa}</span>
              )}
              <span className="text-sm text-neutral-400">
                #{group.cards[0].number}
                {group.cards.length > 1 && `–${group.cards.at(-1)!.number}`}
              </span>
            </h4>

            <div className="flex flex-wrap gap-4">
              {group.cards.map((card) => (
                <SumoCard key={card.id} {...card} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
