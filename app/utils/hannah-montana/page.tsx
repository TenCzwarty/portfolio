"use client";

import React from "react";

import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/components/accordion";
import { Section } from "~/components/section";

// The card tilt / foil effects live with the sumo tracker
import "~sumo/styles.css";
import "./starburst.css";

import { HannahCard } from "~hannah-montana/_components/card";
import { HANNAH_SET } from "~hannah-montana/_const";
import { useHannahContext } from "~hannah-montana/_context";
import { useHannahQueryString } from "~hannah-montana/_helpers/query-string";
import type { TCardSize } from "~sumo/_context/types";

const CARD_SIZES: Array<TCardSize> = ["small", "medium", "large"];

export default function UtilsHannahMontanaPage() {
  useHannahQueryString();

  const { cardSize, setCardSize } = useHannahContext();

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <AccordionController>
          {(accordionProps) => (
            <>
              <div className="mt-16 mb-8 ml-4">
                <h1 className="text-xl font-semibold sm:text-3xl">Hannah Montana Cards</h1>

                <div className="flex gap-2">
                  <p>a small collection tracker — open a card to add it</p>
                  <AccordionExtraSettingsToggle {...accordionProps} />
                </div>

                <Accordion {...accordionProps}>
                  <div className="mt-4 -ml-4 flex flex-col space-y-2 rounded-xl border border-neutral-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 id="card-size-label" className="mr-2">
                        card size
                      </h4>
                      <div role="group" aria-labelledby="card-size-label" className="flex gap-1">
                        {CARD_SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            aria-pressed={cardSize === size}
                            onClick={() => setCardSize(size)}
                            className={`rounded-lg px-3 py-1 text-sm ${
                              cardSize === size
                                ? "bg-primary-900 text-white"
                                : "text-neutral-500 hover:bg-neutral-200"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Accordion>
              </div>

              <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Hannah Montana</h3>
                  <span className="text-sm text-neutral-500">{HANNAH_SET.cards.length} cards</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  {HANNAH_SET.cards.map((card) => (
                    <HannahCard key={card.id} card={card} />
                  ))}
                </div>
              </div>
            </>
          )}
        </AccordionController>
      </Section>
    </main>
  );
}
