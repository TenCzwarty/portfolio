"use client";

import React from "react";

import { Spinner } from "~/components/spinner";

import { HanayamaTrackerContextProvider } from "~hanayama/_context";

export default function UtilsHanayamaTrackerPageLayout({
  children,
}: TChildren) {
  return (
    <HanayamaTrackerContextProvider>
      <React.Suspense fallback={<Spinner />}>{children}</React.Suspense>
    </HanayamaTrackerContextProvider>
  );
}
