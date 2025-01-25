import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Header } from "@/components/layout/components/header";
import { Footer } from "@/components/layout/components/footer";

import { fontClasses } from "@/components/layout/helpers/font-classes";

import "./globals.css";

export const metadata: Metadata = {
  title: "Daniel Wołoszyn Portfolio",
  description:
    "Portfolio and blog showcasing some of my projects & technical writing.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={fontClasses}>
        <Header />
        {children}
        <Footer />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
