import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "~/app/_components/footer";
import { Header } from "~/app/_components/header";
import { fontClasses } from "~/app/_styles/font-classes";

import "~/app/_styles/globals.css";

export { metadata } from "~/app/_const/metadata";

export default function RootLayout({ children }: TChildren) {
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
