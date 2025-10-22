import { usePercentages } from "./use-puzzle-percentages";

import { getAllPuzzles } from "~hanayama/_const";
import { useHanayamaTrackerContext } from "~hanayama/_context";

export const usePuzzlePercentagesText = () => {
  const { filterRarity, filterSeries, status } = useHanayamaTrackerContext();

  const allPuzzles = getAllPuzzles();
  const allPuzzlesFlat = allPuzzles.flatMap((level) => level.puzzles);
  const allPuzzlesFiltered = allPuzzlesFlat
    .filter(filterRarity)
    .filter(filterSeries);

  const [percentageCollected, percentageCompleted] =
    usePercentages(allPuzzlesFiltered);

  const percentageNotCollected = 100 - percentageCollected;
  const percentageNotCompleted = 100 - percentageCompleted;

  const statusNotCollected = status.includes("-collected");
  const statusNotCompleted = status.includes("-completed");

  return [
    `${statusNotCollected ? "not " : ""}collected ${statusNotCollected ? percentageNotCollected : percentageCollected}%`,
    `${statusNotCompleted ? "not " : ""}completed ${statusNotCompleted ? percentageNotCompleted : percentageCompleted}%`,
  ];
};
