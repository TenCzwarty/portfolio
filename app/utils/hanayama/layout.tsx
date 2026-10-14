import React from "react";
import type { Metadata } from "next";

import { Spinner } from "~/components/spinner";

import { HanayamaTrackerContextProvider } from "~hanayama/_context";

export const metadata: Metadata = {
  title: "Hanayama Tracker",
  description: "Track your Hanayama metal puzzle collection.",
};

export default function UtilsHanayamaTrackerPageLayout({
  children,
}: TChildren) {
  return (
    <HanayamaTrackerContextProvider>
      <React.Suspense fallback={<Spinner />}>{children}</React.Suspense>
    </HanayamaTrackerContextProvider>
  );
}
