import React from "react";

import { useFilterRarity } from "~/app/utils/hanayama/_helpers/use-filter-rarity";
import { useFilterSeries } from "~/app/utils/hanayama/_helpers/use-filter-series";
import { useFilterStatus } from "~/app/utils/hanayama/_helpers/use-filter-status";

import { init } from "./init";
import type { THanayamaTrackerContext } from "./types";
import { useLocallyStoredToggleableArray } from "./use-locally-stored-toggleable-array";

import {
  STORAGE_KEY_COLLECTED_PUZZLES,
  STORAGE_KEY_COMPLETED_PUZZLES,
} from "~hanayama/_const";

const HanayamaTrackerContext =
  React.createContext<THanayamaTrackerContext>(init);

export const HanayamaTrackerContextProvider = ({ children }: TChildren) => {
  const [collectedPuzzles, toggleCollected, isCollected, setCollectedPuzzles] =
    useLocallyStoredToggleableArray<string>(STORAGE_KEY_COLLECTED_PUZZLES);

  const [completedPuzzles, toggleCompleted, isCompleted, setCompletedPuzzles] =
    useLocallyStoredToggleableArray<string>(STORAGE_KEY_COMPLETED_PUZZLES);

  const [filterRarity, toggleFunctionsRarity] = useFilterRarity();
  const [filterSeries, toggleFunctionsSeries] = useFilterSeries();
  const [filterStatus, toggleFunctionsStatus, status] = useFilterStatus({
    isCollected,
    isCompleted,
  });

  const value = {
    collectedPuzzles,
    toggleCollected,
    isCollected,
    setCollectedPuzzles,

    completedPuzzles,
    toggleCompleted,
    isCompleted,
    setCompletedPuzzles,

    filterRarity,
    toggleFunctionsRarity,

    filterSeries,
    toggleFunctionsSeries,

    filterStatus,
    toggleFunctionsStatus,
    status,
  } satisfies THanayamaTrackerContext;

  return (
    <HanayamaTrackerContext.Provider value={value}>
      {children}
    </HanayamaTrackerContext.Provider>
  );
};

export const useHanayamaTrackerContext = () =>
  React.useContext(HanayamaTrackerContext);
