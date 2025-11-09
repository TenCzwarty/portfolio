import React from "react";

import { getDate } from "./get-date";
import { getDateToDayFunction } from "./get-day-to-date-function";
import type { TInputDate } from "./types";

import { useAmasiaCalendarConverterContext } from "~amasia/_context";

export const InputDate = ({
  yearResetsArray,
  resetsArray,
  dayToDate,
  dateToDay,
  unit,
}: TInputDate) => {
  const { day, setDay } = useAmasiaCalendarConverterContext();

  const date = getDate({ day, yearResetsArray, resetsArray, dayToDate });

  if (date == null) {
    return (
      <input
        disabled
        value="0"
        style={{ width: `calc(16px + 1ch)` }}
        className="[appearance:textfield] rounded-md bg-white p-2 text-center focus:outline-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    );
  }

  const dateToDayFunction = getDateToDayFunction({
    yearResetsArray,
    resetsArray,
    dateToDay,
  });

  const updateDay = (value: number) =>
    setDay(dateToDayFunction({ ...date, [unit]: value }) as number);

  return (
    <input
      type="number"
      min={1}
      value={date[unit]}
      onInput={(e) =>
        updateDay(parseInt((e.target as HTMLInputElement)?.value || "1"))
      }
      onFocus={(e) => {
        e.target.select();
      }}
      onPaste={(e) => {
        e.preventDefault();
      }}
      onKeyDown={(e) => {
        if (
          !/[0-9]/.test(e.key) &&
          e.key !== "Backspace" &&
          e.key !== "Delete" &&
          e.key !== "Tab" &&
          e.key !== "ArrowLeft" &&
          e.key !== "ArrowRight"
        ) {
          e.preventDefault();
        }
      }}
      style={{ width: `calc(16px + ${String(date[unit]).length + "ch"})` }}
      className="[appearance:textfield] rounded-md bg-white p-2 text-center focus:outline-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
};
