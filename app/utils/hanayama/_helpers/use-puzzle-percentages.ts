import type { TPuzzle } from "~hanayama/_components/puzzle/types";
import { useHanayamaTrackerContext } from "~hanayama/_context";

const percent = (a: number, b: number) => Math.round((a / (b || 1)) * 100);

type TReturn = [percentageCollected: number, percentageCompleted: number];

export const usePercentages = (puzzles: Array<TPuzzle>): TReturn => {
  const { isCollected, isCompleted, filterStatus, status } =
    useHanayamaTrackerContext();

  const puzzleIds = puzzles.map(({ id }) => id);

  const collectedPuzzles = puzzleIds.filter(isCollected);
  const completedPuzzles = puzzleIds.filter(isCompleted);
  const puzzlesFilteredWithStatus = puzzles
    .filter(filterStatus)
    .map(({ id }) => id);

  const isCollectedInStatus = status.includes("collected");
  const isNotCollectedInStatus = status.includes("-collected");
  const isCompletedInStatus = status.includes("completed");
  const isNotCompletedInStatus = status.includes("-completed");

  const percentageCollectedForAll = percent(
    collectedPuzzles.length,
    puzzles.length,
  );
  const percentageCompletedForAll = percent(
    completedPuzzles.length,
    puzzles.length,
  );

  const percentageCollectedForFilteredWithStatus = percent(
    puzzlesFilteredWithStatus.filter(isCompleted).length,
    puzzlesFilteredWithStatus.length,
  );
  const percentageCompletedForFilteredWithStatus = percent(
    puzzlesFilteredWithStatus.filter(isCollected).length,
    puzzlesFilteredWithStatus.length,
  );

  // [collected, completed] OR [-collected, -completed] or []
  if (
    (isCollectedInStatus && isCompletedInStatus) ||
    (isNotCollectedInStatus && isNotCompletedInStatus) ||
    status.length === 0
  )
    return [percentageCollectedForAll, percentageCompletedForAll];

  // [collected]
  if (isCollectedInStatus && !isCompletedInStatus && !isNotCompletedInStatus)
    return [
      percentageCollectedForAll,
      percentageCollectedForFilteredWithStatus,
    ];

  // [completed]
  if (!isCollectedInStatus && !isNotCollectedInStatus && isCompletedInStatus)
    return [
      percentageCompletedForFilteredWithStatus,
      percentageCompletedForAll,
    ];

  // [collected, -completed]
  if (isCollectedInStatus && isNotCompletedInStatus)
    return [percentageCollectedForAll, percentageCompletedForAll];

  // [-collected, completed]
  if (isNotCollectedInStatus && isCompletedInStatus)
    return [percentageCollectedForAll, percentageCompletedForAll];

  // [-collected]
  if (isNotCollectedInStatus && !isCompletedInStatus && !isNotCompletedInStatus)
    return [
      percentageCollectedForAll,
      percentageCollectedForFilteredWithStatus,
    ];

  // [-completed]
  if (!isCollectedInStatus && !isNotCollectedInStatus && isNotCompletedInStatus)
    return [
      percentageCompletedForFilteredWithStatus,
      percentageCompletedForAll,
    ];

  return [0, 0];
};
