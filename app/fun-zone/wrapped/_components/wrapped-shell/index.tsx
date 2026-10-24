"use client";

import { HouseIcon, Volume2Icon, VolumeXIcon } from "lucide-react";

import { IconToggle } from "~/components/icon-toggle";

import { BackgroundVideo } from "../background-video";
import { TransitionLink } from "../transition-link";

import "~wrapped/styles.css";

import { WRAPPED_PATH } from "~wrapped/_const";
import { useWrappedContext, WrappedContextProvider } from "~wrapped/_context";

const Controls = () => {
  const { isMuted, toggleIsMuted } = useWrappedContext();

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-4 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm">
      <TransitionLink href={WRAPPED_PATH} aria-label="Back to the years">
        <HouseIcon size={24} />
      </TransitionLink>
      <IconToggle
        id="wrapped-mute"
        title={isMuted ? "unmute" : "mute"}
        state={isMuted ? 0 : 1}
        toggleFunction={toggleIsMuted}
      >
        {isMuted ? <VolumeXIcon size={24} /> : <Volume2Icon size={24} />}
      </IconToggle>
    </div>
  );
};

const Page = ({ children }: TChildren) => {
  const { isLeaving } = useWrappedContext();

  return <div className={isLeaving ? "wrapped-page-leave" : undefined}>{children}</div>;
};

export const WrappedShell = ({ children }: TChildren) => (
  <WrappedContextProvider>
    <div className="relative isolate min-h-dvh overflow-hidden">
      <Controls />
      <Page>{children}</Page>
      <BackgroundVideo />
    </div>
  </WrappedContextProvider>
);
