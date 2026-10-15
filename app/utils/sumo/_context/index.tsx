"use client";

import React from "react";

import { init } from "./init";
import type { TSumoContext } from "./types";

const SumoContext = React.createContext<TSumoContext>(init);

export const SumoContextProvider = ({ children }: TChildren) => {
  const value = {} satisfies TSumoContext;

  return (
    <SumoContext.Provider value={value}>{children}</SumoContext.Provider>
  );
};

export const useSumoContext = () => React.useContext(SumoContext);
