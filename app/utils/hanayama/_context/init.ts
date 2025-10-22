import type { THanayamaTrackerContext } from "./types";

export const init = {
  collectedPuzzles: [],
  toggleCollected: () => {},
  isCollected: () => false,
  setCollectedPuzzles: () => {},

  completedPuzzles: [],
  toggleCompleted: () => {},
  isCompleted: () => false,
  setCompletedPuzzles: () => {},

  filterRarity: () => false,
  toggleFunctionsRarity: { basic: () => {}, rare: () => {} },

  filterSeries: () => false,
  toggleFunctionsSeries: {
    sea: () => {},
    zelda: () => {},
    chess: () => {},
    disney: () => {},
    pokemon: () => {},
    ultraman: () => {},
  },

  filterStatus: () => false,
  toggleFunctionsStatus: { collected: () => {}, completed: () => {} },
  status: [],
} satisfies THanayamaTrackerContext;
