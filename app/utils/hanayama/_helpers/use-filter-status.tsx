import type { TPuzzle } from "~hanayama/_components/puzzle/types";
import type { TPuzzleStatuses } from "~hanayama/_context/types";
import { useToggleableArray } from "~hanayama/_utils/use-toggleable-array";

type TParameters = {
  isCollected: (puzzleId: string) => boolean;
  isCompleted: (puzzleId: string) => boolean;
};

type TReturn = [
  (puzzle: TPuzzle) => boolean,
  { collected: () => void; completed: () => void },
  Array<TPuzzleStatuses>,
];

export const useFilterStatus = ({
  isCollected,
  isCompleted,
}: TParameters): TReturn => {
  const { array, toggleValueInArray, is } = useToggleableArray([], 3);

  const filter = (puzzle: TPuzzle) => {
    const match = (statusYes: boolean, statusNot: boolean, actual: boolean) =>
      statusYes ? actual : statusNot ? !actual : true;

    return (
      match(is("collected"), is("-collected"), isCollected(puzzle.id)) &&
      match(is("completed"), is("-completed"), isCompleted(puzzle.id))
    );
  };

  const toggleFunctions = {
    collected: toggleValueInArray("collected"),
    completed: toggleValueInArray("completed"),
  };

  return [filter, toggleFunctions, array as Array<TPuzzleStatuses>];
};
