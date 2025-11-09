export type TDateUnit = "d" | "w" | "m" | "y";
export type TDateObject = { d: number; w?: number; m: number; y?: number };

export type TYearResetsArray = Array<number> & { __brand?: "yearResets" };
export type TResetsArray = Array<number> & { __brand?: "resets" };

type TDO = (day: number) => TDateObject;
type TRDO = (resetsArray: TResetsArray) => TDO;
type TYRDO = (yearResetsArray: TYearResetsArray) => TRDO;

type TOD = (date: TDateObject) => number;
type TROD = (resetsArray: TResetsArray) => TOD;
type TYROD = (yearResetsArray: TYearResetsArray) => TROD;

export type TDayToDateFunction = TDO & TRDO & TYRDO;
export type TDayToDateFunctionUnion = TDO | TRDO | TYRDO;

export type TDateToDayFunction = TOD & TROD & TYROD;
export type TDateToDayFunctionUnion = TOD | TROD | TYROD;

export type TInputDate = {
  yearResetsArray?: TYearResetsArray;
  resetsArray?: TResetsArray;
  dayToDate: TDayToDateFunctionUnion;
  dateToDay: TDateToDayFunctionUnion;
  unit: TDateUnit;
};
