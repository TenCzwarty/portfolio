import type { TPuzzle } from "~hanayama/_components/puzzle/types";

export type TPuzzleStatuses =
  | "collected"
  | "-collected"
  | "completed"
  | "-completed";

export type THanayamaTrackerContext = {
  collectedPuzzles: Array<string>;
  toggleCollected: (puzzleId: string) => void;
  isCollected: (puzzleId: string) => boolean;
  setCollectedPuzzles: (puzzleIds: Array<string>) => void;

  completedPuzzles: Array<string>;
  toggleCompleted: (puzzleId: string) => void;
  isCompleted: (puzzleId: string) => boolean;
  setCompletedPuzzles: (puzzleIds: Array<string>) => void;

  filterRarity: (puzzle: TPuzzle) => boolean;
  toggleFunctionsRarity: { basic: () => void; rare: () => void };

  filterSeries: (puzzle: TPuzzle) => boolean;
  toggleFunctionsSeries: {
    sea: () => void;
    zelda: () => void;
    chess: () => void;
    disney: () => void;
    pokemon: () => void;
    ultraman: () => void;
  };

  filterStatus: (puzzle: TPuzzle) => boolean;
  toggleFunctionsStatus: { collected: () => void; completed: () => void };
  status: Array<TPuzzleStatuses>;
};
