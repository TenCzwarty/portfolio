import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daniel Wołoszyn Portfolio",
  description: "Portfolio and blog showcasing some of my projects & technical writing.",
};

export default function PortfolioPageLayout({ children }: TChildren) {
  return children;
}
