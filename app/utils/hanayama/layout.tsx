"use client";

import React from "react";

import { HanayamaTrackerContextProvider } from "~hanayama/_context";

export default function UtilsHanayamaTrackerPageLayout({
  children,
}: TChildren) {
  return (
    <HanayamaTrackerContextProvider>
      <React.Suspense fallback={<></>}>{children}</React.Suspense>
    </HanayamaTrackerContextProvider>
  );
}
