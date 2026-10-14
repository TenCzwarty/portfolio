import type { Metadata } from "next";

import { QRCodeGeneratorContextProvider } from "~qr/_context";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description:
    "Quickly create QR codes for websites and Wi-Fi networks, no bs.",
};

export default function UtilsQRCodeGeneratorPageLayout({
  children,
}: TChildren) {
  return (
    <QRCodeGeneratorContextProvider>{children}</QRCodeGeneratorContextProvider>
  );
}
