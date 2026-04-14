"use client";

import React from "react";

import { SpinWheelContextProvider } from "~spin/_context";

export default function UtilsSpinWheelPageLayout({ children }: TChildren) {
  return (
    <React.Suspense>
      <SpinWheelContextProvider>{children}</SpinWheelContextProvider>
    </React.Suspense>
  );
}
