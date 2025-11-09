"use client";

import { AmasiaCalendarConverterContextProvider } from "./_context";

export default function FunZoneAmasiaCalendarConverterPageLayout({
  children,
}: TChildren) {
  return (
    <AmasiaCalendarConverterContextProvider>
      {children}
    </AmasiaCalendarConverterContextProvider>
  );
}
