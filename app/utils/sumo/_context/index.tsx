"use client";

import React from "react";

import { useToggle } from "~/utils/use-toggle";

import { init } from "./init";
import type { TSumoContext } from "./types";

const SumoContext = React.createContext<TSumoContext>(init);

export const SumoContextProvider = ({ children }: TChildren) => {
  const [isShowingFinishPreviews, toggleIsShowingFinishPreviews] = useToggle(true);

  const value = {
    isShowingFinishPreviews,
    toggleIsShowingFinishPreviews,
  } satisfies TSumoContext;

  return <SumoContext.Provider value={value}>{children}</SumoContext.Provider>;
};

export const useSumoContext = () => React.useContext(SumoContext);
