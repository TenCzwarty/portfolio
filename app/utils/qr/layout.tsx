"use client";

import { QRCodeGeneratorContextProvider } from "./_context";

export default function UtilsQRCodeGeneratorPageLayout({ children }: Children) {
  return (
    <QRCodeGeneratorContextProvider>{children}</QRCodeGeneratorContextProvider>
  );
}
