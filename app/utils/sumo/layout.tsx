"use client";

import React from "react";

import { Spinner } from "~/components/spinner";

import { SumoContextProvider } from "~sumo/_context";

export default function UtilsSumoTrackerPageLayout({ children }: TChildren) {
  return (
    <SumoContextProvider>
      <React.Suspense fallback={<Spinner />}>{children}</React.Suspense>
    </SumoContextProvider>
  );
}
