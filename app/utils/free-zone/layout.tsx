import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Zone",
  description: "Shared calendar of plans and who is free when.",
};

export default function UtilsFreeZonePageLayout({ children }: TChildren) {
  return children;
}
