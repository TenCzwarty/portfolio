import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jinder",
  description:
    "Sprint planning as a dating app: swipe right to keep a Jira task, left to ghost it into the next sprint.",
};

export default function FunZoneJinderPageLayout({ children }: TChildren) {
  return children;
}
