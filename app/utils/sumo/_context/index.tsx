"use client";

import React from "react";

import { useLocalStorage } from "~/utils/use-local-storage";
import { useToggle } from "~/utils/use-toggle";

import { init } from "./init";
import type { TCardSize, TOwnedKey, TSumoContext } from "./types";

import { STORAGE_KEY_OWNED_FINISHES } from "~sumo/_const";

const SumoContext = React.createContext<TSumoContext>(init);

export const ownedKey = (cardId: string, finishId: string): TOwnedKey => `${cardId}@${finishId}`;

export const SumoContextProvider = ({ children }: TChildren) => {
  const [isShowingFinishPreviews, toggleIsShowingFinishPreviews] = useToggle(false);
  const [cardSize, setCardSize] = React.useState<TCardSize>("medium");

  const [ownedFinishes, setOwnedFinishes] = useLocalStorage<Array<TOwnedKey>>(
    STORAGE_KEY_OWNED_FINISHES,
    []
  ) as [Array<TOwnedKey>, (keys: Array<TOwnedKey>) => void];

  const toggleOwned = (key: TOwnedKey) =>
    setOwnedFinishes(
      ownedFinishes.includes(key)
        ? ownedFinishes.filter((owned) => owned !== key)
        : [...ownedFinishes, key]
    );

  const isOwned = (key: TOwnedKey) => ownedFinishes.includes(key);

  const value = {
    isShowingFinishPreviews,
    toggleIsShowingFinishPreviews,

    cardSize,
    setCardSize,

    ownedFinishes,
    setOwnedFinishes,
    toggleOwned,
    isOwned,
  } satisfies TSumoContext;

  return <SumoContext.Provider value={value}>{children}</SumoContext.Provider>;
};

export const useSumoContext = () => React.useContext(SumoContext);
