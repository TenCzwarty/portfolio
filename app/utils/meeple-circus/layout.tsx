import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meeple Circus",
  description: "Music timer for the Meeple Circus board game.",
};

export default function UtilsMeepleCircusPageLayout({ children }: TChildren) {
  return children;
}
