import type { Metadata } from "next";

import { AmasiaCalendarConverterContextProvider } from "./_context";

export const metadata: Metadata = {
  title: "Amasia Calendar Converter",
  description: "Quickly convert dates in Amasia.",
};

export default function FunZoneAmasiaCalendarConverterPageLayout({
  children,
}: TChildren) {
  return (
    <AmasiaCalendarConverterContextProvider>
      {children}
    </AmasiaCalendarConverterContextProvider>
  );
}
