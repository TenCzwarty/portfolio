"use client";

import React from "react";

import { getAllPuzzles } from "~/app/utils/hanayama/_const";
import { useHanayamaQueryString } from "~/app/utils/hanayama/_helpers/query-string";
import { usePuzzlePercentagesText } from "~/app/utils/hanayama/_helpers/use-puzzle-percentages-text";
import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/components/accordion";
import { IconToggle } from "~/components/icon-toggle";
import { Section } from "~/components/section";
import { ToastContainer } from "~/components/toast";

import "./styles.css";

import { Icon } from "~hanayama/_components/icon";
import { PuzzleLevel } from "~hanayama/_components/puzzle-level";
import { useHanayamaTrackerContext } from "~hanayama/_context";

export default function UtilsHanayamaTrackerPage() {
  useHanayamaQueryString();

  const {
    toggleFunctionsRarity,
    toggleFunctionsSeries,
    toggleFunctionsStatus,
  } = useHanayamaTrackerContext();

  const allPuzzles = getAllPuzzles();

  const [textPercentageCollected, textPercentageCompleted] =
    usePuzzlePercentagesText();

  return (
    <>
      <ToastContainer />

      <main className="min-h-[calc(100dvh-56px)]">
        <Section>
          <AccordionController>
            {(accordionProps) => (
              <>
                <div className="mt-16 mb-8 ml-4">
                  <h1 className="text-xl font-semibold sm:text-3xl">
                    Hanayama Tracker
                  </h1>

                  <div className="flex gap-2">
                    <p>track your metal puzzles collection</p>
                    <AccordionExtraSettingsToggle {...accordionProps} />
                  </div>

                  <Accordion {...accordionProps}>
                    <div className="mt-4 -ml-4 flex flex-col space-y-2 rounded-xl border border-neutral-200 p-4">
                      <div className="flex gap-2">
                        <h4 className="mr-2">rarity</h4>
                        <IconToggle
                          id="basic"
                          toggleFunction={toggleFunctionsRarity.basic}
                        >
                          <Icon.rarity.basic />
                        </IconToggle>
                        <IconToggle
                          id="rare"
                          toggleFunction={toggleFunctionsRarity.rare}
                        >
                          <Icon.rarity.rare />
                        </IconToggle>
                      </div>

                      <div className="flex gap-2">
                        <h4 className="mr-2">series</h4>
                        <IconToggle
                          id="sea"
                          toggleFunction={toggleFunctionsSeries.sea}
                        >
                          <Icon.series.sea />
                        </IconToggle>
                        <IconToggle
                          id="zelda"
                          toggleFunction={toggleFunctionsSeries.zelda}
                        >
                          <Icon.series.zelda />
                        </IconToggle>
                        <IconToggle
                          id="chess"
                          toggleFunction={toggleFunctionsSeries.chess}
                        >
                          <Icon.series.chess />
                        </IconToggle>
                        <IconToggle
                          id="disney"
                          toggleFunction={toggleFunctionsSeries.disney}
                        >
                          <Icon.series.disney />
                        </IconToggle>
                        <IconToggle
                          id="pokemon"
                          toggleFunction={toggleFunctionsSeries.pokemon}
                        >
                          <Icon.series.pokemon />
                        </IconToggle>
                        <IconToggle
                          id="ultraman"
                          toggleFunction={toggleFunctionsSeries.ultraman}
                        >
                          <Icon.series.ultraman />
                        </IconToggle>
                      </div>

                      <div className="flex gap-2">
                        <h4 className="mr-2">status</h4>
                        <IconToggle
                          id="collected"
                          toggleFunction={toggleFunctionsStatus.collected}
                          numberOfStates={3}
                          initialState={0}
                          title={textPercentageCollected}
                        >
                          <Icon.status.collected />
                        </IconToggle>
                        <IconToggle
                          id="completed"
                          toggleFunction={toggleFunctionsStatus.completed}
                          numberOfStates={3}
                          initialState={0}
                          title={textPercentageCompleted}
                        >
                          <Icon.status.completed />
                        </IconToggle>
                      </div>
                    </div>
                  </Accordion>
                </div>

                <div className="flex gap-4">
                  <div className="w-full space-y-4">
                    {allPuzzles.map(({ level, puzzles }) => (
                      <PuzzleLevel
                        key={level}
                        level={level}
                        puzzles={puzzles}
                        isSettingsOpened={accordionProps.isOpened}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </AccordionController>
        </Section>
      </main>
    </>
  );
}
