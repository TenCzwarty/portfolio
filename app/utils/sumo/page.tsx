"use client";

import React from "react";

import { getAllSets } from "~/app/utils/sumo/_const";
import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/components/accordion";
import { Section } from "~/components/section";

import "./styles.css";

import { SumoCardSet } from "~sumo/_components/card-set";

export default function UtilsSumoTrackerPage() {
  const allSets = getAllSets();
  const [selectedSetCode, setSelectedSetCode] = React.useState(
    allSets[allSets.length - 1].code,
  );

  const selectedSet = allSets.find((s) => s.code === selectedSetCode)!;

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <AccordionController>
          {(accordionProps) => (
            <>
              <div className="mt-16 mb-8 ml-4">
                <h1 className="text-xl font-semibold sm:text-3xl">
                  Sumo Card Tracker
                </h1>

                <div className="flex gap-2">
                  <p>BBM sumo trading card catalog — Reiwa era (2020–present)</p>
                  <AccordionExtraSettingsToggle {...accordionProps} />
                </div>

                <Accordion {...accordionProps}>
                  <div className="mt-4 -ml-4 flex flex-col space-y-2 rounded-xl border border-neutral-200 p-4">
                    <span className="text-sm text-neutral-500">
                      settings coming soon
                    </span>
                  </div>
                </Accordion>
              </div>

              <div className="mb-4 ml-4">
                <select
                  value={selectedSetCode}
                  onChange={(e) => setSelectedSetCode(e.target.value)}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
                >
                  {allSets.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.set} ({s.cards.length} cards)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <div className="w-full space-y-4">
                  <SumoCardSet sumoSet={selectedSet} />
                </div>
              </div>
            </>
          )}
        </AccordionController>
      </Section>
    </main>
  );
}
