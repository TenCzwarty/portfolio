import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podaj kod",
  description: "Podaj kod, zanim skończy się czas.",
  robots: { index: false, follow: false },
};

export default function BirthdayCodeLayout({ children }: TChildren) {
  return children;
}
