"use client";

import { QRCodeGeneratorContextProvider } from "~qr/_context";

export default function UtilsQRCodeGeneratorPageLayout({ children }: Children) {
  return (
    <QRCodeGeneratorContextProvider>{children}</QRCodeGeneratorContextProvider>
  );
}
