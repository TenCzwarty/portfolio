import React from "react";

import { usePercentages } from "~/app/utils/hanayama/_helpers/use-puzzle-percentages";
import {
  Accordion,
  AccordionController,
  AccordionToggleMoreInfo,
} from "~/components/accordion";

import type { TPuzzleLevel } from "./types";

import { Puzzle } from "~hanayama/_components/puzzle";
import { useHanayamaTrackerContext } from "~hanayama/_context";

export const PuzzleLevel = ({
  level,
  puzzles,
  isSettingsOpened,
}: TPuzzleLevel) => {
  const { filterRarity, filterSeries, filterStatus } =
    useHanayamaTrackerContext();

  const puzzlesFiltered = puzzles.filter(filterRarity).filter(filterSeries);

  const [percentageCollected, percentageCompleted] =
    usePercentages(puzzlesFiltered);

  const textPercentages = isSettingsOpened
    ? `${percentageCollected}% collected / ${percentageCompleted}% completed`
    : "";

  const puzzlesFilteredAndSorted = puzzlesFiltered
    .filter(filterStatus)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <AccordionController initialIsOpened={true}>
      {(accordionProps) => (
        <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h3>{level}</h3>

            <div className="flex gap-4">
              <span>{textPercentages}</span>
              <AccordionToggleMoreInfo {...accordionProps} />
            </div>
          </div>

          <Accordion {...accordionProps}>
            <div className="mt-4 flex flex-wrap gap-4">
              {puzzlesFilteredAndSorted.length > 0 ? (
                puzzlesFilteredAndSorted.map((props) => (
                  <Puzzle
                    key={props.id}
                    isSettingsOpened={isSettingsOpened}
                    {...props}
                  />
                ))
              ) : (
                <div className="text-neutral-500">no puzzles found</div>
              )}
            </div>
          </Accordion>
        </div>
      )}
    </AccordionController>
  );
};
