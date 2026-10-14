import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Fun Zone",
  description: "Not-so-serious side projects and fun things found on the web.",
};

export default function FunZonePageLayout({ children }: TChildren) {
  return children;
}
