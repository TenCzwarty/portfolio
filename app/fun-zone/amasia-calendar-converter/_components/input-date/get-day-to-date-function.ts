import type {
  TDateToDayFunction,
  TDateToDayFunctionUnion,
  TResetsArray,
  TYearResetsArray,
} from "./types";

export const getDateToDayFunction = ({
  yearResetsArray,
  resetsArray,
  dateToDay,
}: {
  yearResetsArray?: TYearResetsArray;
  resetsArray?: TResetsArray;
  dateToDay: TDateToDayFunctionUnion;
}) => {
  const dateToDayFunction = dateToDay as TDateToDayFunction;

  if (yearResetsArray && resetsArray) {
    return dateToDayFunction(yearResetsArray)(resetsArray);
  }

  if (resetsArray) {
    return dateToDayFunction(resetsArray);
  }

  return dateToDayFunction;
};
