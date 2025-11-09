import { InputDate } from "~amasia/_components/input-date";
import type { TDateObject } from "~amasia/_components/input-date/types";
import {
  DAYS_IN_ONE_IRON_MONTH,
  DAYS_IN_ONE_IRON_WEEK,
  DAYS_IN_ONE_YEAR,
  IRON_DATE_NAMES,
  SEPARATOR,
} from "~amasia/_const";

export const dayToDateIronName = (day: number) => {
  const { d, w, m, y } = dayToDateIron(day);

  return `${IRON_DATE_NAMES.pre[d - 1]}${IRON_DATE_NAMES.mid[w - 1]}${IRON_DATE_NAMES.suf[m - 1]} of ${y}`;
};

export const dayToDateIron = (day: number) => {
  const y = Math.ceil(day / DAYS_IN_ONE_YEAR);

  const left_d = ((day - 1) % DAYS_IN_ONE_YEAR) + 1;

  const m = Math.ceil(left_d / DAYS_IN_ONE_IRON_MONTH);
  const left_m = ((left_d - 1) % DAYS_IN_ONE_IRON_MONTH) + 1;

  const w = Math.ceil(left_m / DAYS_IN_ONE_IRON_WEEK);
  const d = ((left_d - 1) % DAYS_IN_ONE_IRON_WEEK) + 1;

  return { d, w, m, y };
};

export const dateIronToDay = ({ d, w, m, y }: TDateObject) => {
  const left_m = (w! - 1) * DAYS_IN_ONE_IRON_WEEK + d;
  const left_d = (m - 1) * DAYS_IN_ONE_IRON_MONTH + left_m;
  return (y! - 1) * DAYS_IN_ONE_YEAR + left_d;
};

export const DateIronInput = () => (
  <>
    <InputDate dayToDate={dayToDateIron} dateToDay={dateIronToDay} unit="d" />
    {SEPARATOR}
    <InputDate dayToDate={dayToDateIron} dateToDay={dateIronToDay} unit="w" />
    {SEPARATOR}
    <InputDate dayToDate={dayToDateIron} dateToDay={dateIronToDay} unit="m" />
    {SEPARATOR}
    <InputDate dayToDate={dayToDateIron} dateToDay={dateIronToDay} unit="y" />
  </>
);
