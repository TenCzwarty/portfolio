import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daniel Wołoszyn Portfolio",
  description:
    "Portfolio and blog showcasing some of my projects & technical writing.",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
} as const;
