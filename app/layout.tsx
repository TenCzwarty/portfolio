import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Link from "next/link";
import { Logo } from "../components/logo";

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

        <footer className="bg-slate-900 text-white">
          <div className="mx-auto flex max-w-[calc(200dvw/3)] gap-6 py-4">
            <Link href="#top" className="ml-4" aria-label="Back to top">
              back to top
            </Link>
            <Link href="#my-work" aria-label="Go to my work section">
              my work
            </Link>
            <Link href="#my-writing" aria-label="Go to my writing section">
              my writing
            </Link>
          </div>
        </footer>

        <SpeedInsights />
      </body>
    </html>
  );
}
