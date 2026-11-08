import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas Zone",
  description: "Shared sticky notes for collecting ideas.",
};

export default function UtilsIdeasZoneLayout({ children }: TChildren) {
  return children;
}
