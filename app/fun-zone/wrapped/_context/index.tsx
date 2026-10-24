"use client";

import React from "react";

import { useToggle } from "~/utils/use-toggle";

import { init } from "./init";
import type { TBackgroundVideo, TWrappedContext } from "./types";

const WrappedContext = React.createContext<TWrappedContext>(init);

export const WrappedContextProvider = ({ children }: TChildren) => {
  const [video, setVideo] = React.useState<TBackgroundVideo | null>(null);
  const [isMuted, toggleIsMuted] = useToggle(true);

  // browsers only let sound autoplay after an interaction - landing here from a click can start
  // unmuted, opening the link directly starts muted until the mute button is pressed
  React.useEffect(() => {
    if (navigator.userActivation?.hasBeenActive) toggleIsMuted(false);
  }, [toggleIsMuted]);

  const value = { video, setVideo, isMuted, toggleIsMuted };

  return <WrappedContext.Provider value={value}>{children}</WrappedContext.Provider>;
};

export const useWrappedContext = () => React.useContext(WrappedContext);
