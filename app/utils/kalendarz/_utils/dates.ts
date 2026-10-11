import type { TDay } from "../_types";

export const WEEKDAYS = ["pon", "wt", "śr", "czw", "pt", "sob", "nd"];

const MONTH_FORMAT = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" });

const pad = (n: number) => String(n).padStart(2, "0");

export const toDay = (date: Date): TDay =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const fromDay = (day: TDay) => {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (day: TDay, n: number) => {
  const date = fromDay(day);
  date.setDate(date.getDate() + n);
  return toDay(date);
};

export const formatMonth = (year: number, month: number) =>
  MONTH_FORMAT.format(new Date(year, month, 1));

export const formatRange = (start: TDay, end: TDay) => {
  const f = (day: TDay) =>
    fromDay(day).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
  return start === end ? f(start) : `${f(start)} – ${f(end)}`;
};

/** Monday-first weeks covering the whole month, each week = 7 days */
export const getMonthWeeks = (year: number, month: number): Array<Array<TDay>> => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  let cursor = toDay(new Date(year, month, 1 - offset));
  const lastDay = toDay(new Date(year, month + 1, 0));

  const weeks: Array<Array<TDay>> = [];
  while (weeks.length === 0 || cursor <= lastDay) {
    const week: Array<TDay> = [];
    for (let i = 0; i < 7; i++) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
};
