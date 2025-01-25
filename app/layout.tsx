import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Logo } from "@/components/logo";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daniel Wołoszyn Portfolio",
  description:
    "Portfolio and blog showcasing some of my  projects & technical writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        <header className="absolute z-10 m-4">
          <a
            href="#my-work"
            className="scale-[25%]"
            aria-label="Go to my work section"
          >
            <Logo />
          </a>
        </header>

        {children}

        <footer className="bg-primary-900 text-white">
          <div className="mx-auto flex flex-col gap-4 px-8 py-4 sm:max-w-[calc(200dvw/3)] sm:flex-row sm:gap-6 sm:px-4">
            <Link href="#top" aria-label="Back to top">
              back to top
            </Link>
            <Link href="#my-work" aria-label="Go to my work section">
              my work
            </Link>
            <Link href="#my-writing" aria-label="Go to my writing section">
              my writing
            </Link>
            {/* <Link href="/utils" aria-label="Go to the utils page">
              utils
            </Link> */}
            {/* <Link href="/fun-zone" aria-label="Go to the 'fun zone' page">
              fun zone
            </Link> */}
          </div>
        </footer>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
