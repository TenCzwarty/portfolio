"use client";

import React from "react";
import { LayersIcon, SparklesIcon } from "lucide-react";

import { getAllSets } from "~/app/utils/sumo/_const";
import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/components/accordion";
import { IconToggle } from "~/components/icon-toggle";
import { Section } from "~/components/section";
import { ToastContainer } from "~/components/toast";

import "./styles.css";

import { SumoCardSet } from "~sumo/_components/card-set";
import { useSumoContext } from "~sumo/_context";
import { useSumoQueryString } from "~sumo/_helpers/query-string";

export default function UtilsSumoTrackerPage() {
  useSumoQueryString();

  const { toggleIsShowingFinishPreviews } = useSumoContext();
  const allSets = getAllSets();
  const [selectedSetCode, setSelectedSetCode] = React.useState(allSets[allSets.length - 1].code);

  const selectedSet = allSets.find((s) => s.code === selectedSetCode)!;

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <AccordionController>
          {(accordionProps) => (
            <>
              <div className="mt-16 mb-8 ml-4">
                <h1 className="text-xl font-semibold sm:text-3xl">Sumo Card Tracker</h1>

                <div className="flex gap-2">
                  <p>BBM sumo trading card catalog — Reiwa era (2020–present)</p>
                  <AccordionExtraSettingsToggle {...accordionProps} />
                </div>

                <Accordion {...accordionProps}>
                  <div className="mt-4 -ml-4 flex flex-col space-y-2 rounded-xl border border-neutral-200 p-4">
                    <div className="flex gap-2">
                      <h4 className="mr-2">finish previews</h4>
                      <IconToggle
                        id="finish-previews"
                        title="preview finishes a card wasn't printed in"
                        toggleFunction={toggleIsShowingFinishPreviews}
                      >
                        <SparklesIcon />
                      </IconToggle>
                    </div>

                    <p className="text-sm text-neutral-500">
                      while settings are open, click a card to add it to your collection; collect
                      its other versions from the zoomed card. The link holds your collection.
                    </p>
                  </div>
                </Accordion>
              </div>

              {/* Same select as /utils/meeple-circus; the card count is in the set header */}
              <div className="mb-4 ml-4 flex items-center gap-2">
                <LayersIcon className="z-10" />

                <select
                  value={selectedSetCode}
                  onChange={(e) => setSelectedSetCode(e.target.value)}
                  aria-label="Card set"
                  className="-ml-10 h-[40px] w-[376px] max-w-[calc(100vw-2rem)] appearance-none rounded-xl pl-10 hover:cursor-pointer hover:bg-neutral-200"
                >
                  {allSets.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.set}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <div className="w-full space-y-4">
                  <SumoCardSet sumoSet={selectedSet} isSettingsOpened={accordionProps.isOpened} />
                </div>
              </div>
            </>
          )}
        </AccordionController>
      </Section>

      <ToastContainer />
    </main>
  );
}
