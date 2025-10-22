import type { TPuzzle } from "~hanayama/_components/puzzle/types";
import { useToggleableArray } from "~hanayama/_utils/use-toggleable-array";

type TReturn = [
  (puzzle: TPuzzle) => boolean,
  {
    sea: () => void;
    zelda: () => void;
    chess: () => void;
    disney: () => void;
    pokemon: () => void;
    ultraman: () => void;
  },
];

export const useFilterSeries = (): TReturn => {
  const { toggleValueInArray, is } = useToggleableArray([
    "sea",
    "chess",
    "ultraman",
    "zelda",
    "disney",
    "pokemon",
  ]);

  const filter = (puzzle: TPuzzle) =>
    puzzle.tags === undefined ? true : puzzle.tags?.some(is);

  const toggleFunctions = {
    sea: toggleValueInArray("sea"),
    zelda: toggleValueInArray("zelda"),
    chess: toggleValueInArray("chess"),
    disney: toggleValueInArray("disney"),
    pokemon: toggleValueInArray("pokemon"),
    ultraman: toggleValueInArray("ultraman"),
  };

  return [filter, toggleFunctions];
};
