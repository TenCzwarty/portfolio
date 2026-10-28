"use client";

import React from "react";

import { useLocalStorage } from "~/utils/use-local-storage";

import { init } from "./init";
import type { THannahContext } from "./types";

import { STORAGE_KEY_OWNED_FINISHES } from "~hannah-montana/_const";
import type { TCardSize, TOwnedKey } from "~sumo/_context/types";

const HannahContext = React.createContext<THannahContext>(init);

export const HannahContextProvider = ({ children }: TChildren) => {
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
    cardSize,
    setCardSize,

    ownedFinishes,
    setOwnedFinishes,
    toggleOwned,
    isOwned,
  } satisfies THannahContext;

  return <HannahContext.Provider value={value}>{children}</HannahContext.Provider>;
};

export const useHannahContext = () => React.useContext(HannahContext);
