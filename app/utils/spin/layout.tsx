import React from "react";
import type { Metadata } from "next";

import { SpinWheelContextProvider } from "~spin/_context";

export const metadata: Metadata = {
  title: "Spin The Wheel",
  description: "Pick a random element from a list.",
};

export default function UtilsSpinWheelPageLayout({ children }: TChildren) {
  return (
    <React.Suspense>
      <SpinWheelContextProvider>{children}</SpinWheelContextProvider>
    </React.Suspense>
  );
}
