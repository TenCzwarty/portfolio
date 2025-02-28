"use client";

import { QRCodeGeneratorContextProvider } from "~qr/_context";

export default function UtilsQRCodeGeneratorPageLayout({
  children,
}: TChildren) {
  return (
    <QRCodeGeneratorContextProvider>{children}</QRCodeGeneratorContextProvider>
  );
}
