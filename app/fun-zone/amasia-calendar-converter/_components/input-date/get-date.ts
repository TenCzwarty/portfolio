import type {
  TDayToDateFunction,
  TDayToDateFunctionUnion,
  TResetsArray,
  TYearResetsArray,
} from "./types";

export const getDate = ({
  day,
  yearResetsArray,
  resetsArray,
  dayToDate,
}: {
  day: number;
  yearResetsArray?: TYearResetsArray;
  resetsArray?: TResetsArray;
  dayToDate: TDayToDateFunctionUnion;
}) => {
  const dayToDateFunction = dayToDate as TDayToDateFunction;

  if (yearResetsArray && resetsArray) {
    return dayToDateFunction(yearResetsArray)(resetsArray)(day);
  }

  if (resetsArray) {
    return dayToDateFunction(resetsArray)(day);
  }

  return dayToDateFunction(day);
};
