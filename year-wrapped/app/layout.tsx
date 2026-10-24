"use client";

import React from "react";
import dynamic from "next/dynamic";

import { BackgroundVideoContextProvider } from "@/src/components/background-video/background-video-context";
import { ClientLayout } from "./ClientLayout";

import "./globals.css";

const Cursor = dynamic(
  () => import("@/src/components/cursor").then((mod) => mod.Cursor),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackgroundVideoContextProvider>
      <html lang="en">
        <head>
          <style jsx global>{`
            @font-face {
              font-family: "Arcade";
              src: url("/fonts/Arcade.ttf") format("truetype");
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `}</style>
        </head>

        <body>
          <script
            type="module"
            defer
            src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/bouncy.js"
          ></script>
          <script
            type="module"
            defer
            src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/ping.js"
          ></script>
          {/* <Cursor /> */}
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </BackgroundVideoContextProvider>
  );
}
