import React from "react";
import type { Metadata } from "next";

import { Spinner } from "~/components/spinner";

import { HannahContextProvider } from "~hannah-montana/_context";

export const metadata: Metadata = {
  title: "Hannah Montana Cards",
  description: "Keep track of a Hannah Montana trading card collection.",
};

export default function UtilsHannahMontanaPageLayout({ children }: TChildren) {
  return (
    <HannahContextProvider>
      <React.Suspense fallback={<Spinner />}>{children}</React.Suspense>
    </HannahContextProvider>
  );
}
