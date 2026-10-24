"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useToggle } from "~/utils/use-toggle";

import { init } from "./init";
import type { TBackgroundVideo, TWrappedContext } from "./types";

import { DURATION_PAGE_FADE } from "~wrapped/_const";

const WrappedContext = React.createContext<TWrappedContext>(init);

export const WrappedContextProvider = ({ children }: TChildren) => {
  const [video, setVideo] = React.useState<TBackgroundVideo | null>(null);
  const [isMuted, toggleIsMuted] = useToggle(true);

  // browsers only let sound autoplay after an interaction - landing here from a click can start
  // unmuted, opening the link directly starts muted until the mute button is pressed
  React.useEffect(() => {
    if (navigator.userActivation?.hasBeenActive) toggleIsMuted(false);
  }, [toggleIsMuted]);

  const router = useRouter();
  const pathname = usePathname();
  const [isLeaving, setIsLeaving] = React.useState(false);
  const refNavigateTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => setIsLeaving(false), [pathname]);
  React.useEffect(() => () => clearTimeout(refNavigateTimeout.current), []);

  const navigate = React.useCallback(
    (href: string) => {
      if (href === pathname) return;

      setIsLeaving(true);
      clearTimeout(refNavigateTimeout.current);
      refNavigateTimeout.current = setTimeout(() => router.push(href), DURATION_PAGE_FADE);
    },
    [pathname, router]
  );

  const value = { video, setVideo, isMuted, toggleIsMuted, isLeaving, navigate };

  return <WrappedContext.Provider value={value}>{children}</WrappedContext.Provider>;
};

export const useWrappedContext = () => React.useContext(WrappedContext);
