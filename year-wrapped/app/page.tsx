"use client";

import React from "react";
import Link from "next/link";

import { useBackgroundVideo } from "@/src/components/background-video/use-background-video";
import { usePageTransitionExpandingCircle } from "@/src/components/page-transition-expanding-circle/use-page-transition-expanding-circle";

const Card = ({ children }) => {
  return (
    <div className="relative backdrop-blur-md bg-white/30 rounded-lg p-4">
      {children}
    </div>
  );
};

export default function Home() {
  const ref = usePageTransitionExpandingCircle();

  useBackgroundVideo("https://www.youtube.com/watch?v=LML6SoNE7xE");

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center h-screen relative overflow-hidden"
    >
      <div className="grid grid-cols-2 gap-4 justify-items-center relative z-10">
        <Link href={`/2022`} className="font-[Arcade] text-8xl line-height-1">
          <Card>2022</Card>
        </Link>

        <Link href="/x">
          <l-ping size="25" speed="2" color="black"></l-ping>
        </Link>
      </div>
    </div>
  );
}
