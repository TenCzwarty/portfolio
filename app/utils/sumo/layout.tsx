import React from "react";
import type { Metadata } from "next";

import { Spinner } from "~/components/spinner";

import { SumoContextProvider } from "~sumo/_context";

export const metadata: Metadata = {
  title: "Sumo Card Tracker",
  description: "Browse the BBM sumo trading card catalog from the Reiwa era.",
};

export default function UtilsSumoTrackerPageLayout({ children }: TChildren) {
  return (
    <SumoContextProvider>
      <React.Suspense fallback={<Spinner />}>{children}</React.Suspense>
    </SumoContextProvider>
  );
}
