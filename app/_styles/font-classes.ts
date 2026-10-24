import { Geist_Mono } from "next/font/google";
import local from "next/font/local";

const whiskey = local({
  variable: "--font-whiskey",
  src: [
    {
      path: "../../public/fonts/whiskey-girls-gradital.ttf",
    },
  ],
});

const firlest = local({
  variable: "--font-firlest",
  src: [
    {
      path: "../../public/fonts/firlest-regular.otf",
    },
  ],
});

const kaleagnetta = local({
  variable: "--font-kaleagnetta",
  src: [
    {
      path: "../../public/fonts/kaleagnetta.ttf",
    },
  ],
});

const arcade = local({
  variable: "--font-arcade",
  src: [
    {
      path: "../../public/fonts/arcade.ttf",
    },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const fontClasses = `${geistMono.variable} ${whiskey.variable} ${firlest.variable} ${kaleagnetta.variable} ${arcade.variable} antialiased`;
