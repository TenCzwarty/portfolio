import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "~/components/layout/components/footer";
import { Header } from "~/components/layout/components/header";
import { fontClasses } from "~/styles/font-classes";

import "~/styles/globals.css";

export { metadata } from "~/components/layout/const/metadata";

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
