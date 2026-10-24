import type { Metadata } from "next";

import { WrappedShell } from "./_components/wrapped-shell";

export const metadata: Metadata = {
  title: "Year Wrapped",
  description: "Our year, wrapped.",
  robots: { index: false, follow: false },
};

export default function FunZoneWrappedPageLayout({ children }: TChildren) {
  return <WrappedShell>{children}</WrappedShell>;
}
