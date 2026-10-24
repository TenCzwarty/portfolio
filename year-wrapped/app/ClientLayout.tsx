"use client";

import React from "react";
import Link from "next/link";

import { useBackgroundVideoVolume } from "@/src/components/background-video/use-background-video-volume";
import { ButtonMute } from "@/src/components/background-video/button-mute";
import { BackgroundVideo } from "@/src/components/background-video";
import { PageAnimatePresence } from "@/src/components/page-transition-fade-in-out/page-animate-presence";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { volume, isMuted, toggleIsMuted, mute, unmute } =
    useBackgroundVideoVolume();

  return (
    <>
      <div className="absolute flex items-center gap-4 top-10 right-10 bg-violet-500 z-50">
        <Link href="/" aria-label="Back to Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
        <ButtonMute isMuted={isMuted} toggleIsMuted={toggleIsMuted} />
      </div>

      <PageAnimatePresence>{children}</PageAnimatePresence>

      {typeof window !== "undefined" && (
        <BackgroundVideo volume={volume} mute={mute} unmute={unmute} />
      )}
    </>
  );
}
