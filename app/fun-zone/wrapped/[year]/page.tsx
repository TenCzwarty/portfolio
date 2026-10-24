import { notFound } from "next/navigation";

import { Year2022 } from "~wrapped/_components/year-2022";
import { YearPlaceholder } from "~wrapped/_components/year-placeholder";
import { YEARS } from "~wrapped/_const";

export const dynamicParams = false;

export const generateStaticParams = () => YEARS.map(({ year }) => ({ year }));

export default async function FunZoneWrappedYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const entry = YEARS.find((item) => item.year === year);

  if (!entry) notFound();

  return year === "2022" ? <Year2022 entry={entry} /> : <YearPlaceholder entry={entry} />;
}
