import type { TPuzzle } from "~hanayama/_components/puzzle/types";
import { useToggleableArray } from "~hanayama/_utils/use-toggleable-array";

type TReturn = [
  (puzzle: TPuzzle) => boolean,
  { basic: () => void; rare: () => void },
];

export const useFilterRarity = (): TReturn => {
  const { toggleValueInArray, is } = useToggleableArray(["basic", "rare"]);

  const filter = (puzzle: TPuzzle) => {
    if (is("basic") && is("rare")) return true;
    if (is("rare")) return puzzle.rare === true;
    if (is("basic")) return puzzle.rare !== true;
    return !!puzzle.tags;
  };

  const toggleFunctions = {
    basic: toggleValueInArray("basic"),
    rare: toggleValueInArray("rare"),
  };

  return [filter, toggleFunctions];
};
