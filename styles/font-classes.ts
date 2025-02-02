import local from "next/font/local";

import { Geist_Mono } from "next/font/google";

const whiskey = local({
  variable: "--font-whiskey",
  src: [
    {
      path: "../public/fonts/whiskey-girls-gradital.ttf",
    },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const fontClasses = `${geistMono.variable} ${whiskey.variable} antialiased`;
