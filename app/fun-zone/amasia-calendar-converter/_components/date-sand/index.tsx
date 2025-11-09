import { InputDate } from "~amasia/_components/input-date";
import type {
  TDateObject,
  TResetsArray,
} from "~amasia/_components/input-date/types";
import {
  DAYS_IN_ONE_SAND_YEAR,
  DAYS_IN_ONE_YEAR,
  FIRST_SAND_YEAR,
  SEPARATOR,
} from "~amasia/_const";
import AMASIA_LG_RESETS from "~amasia/_const/amasia-lg-resets.json";
import AMASIA_MD_RESETS from "~amasia/_const/amasia-md-resets.json";
import AMASIA_SM_RESETS from "~amasia/_const/amasia-sm-resets.json";
import { bisect } from "~amasia/_utils/bisect";

// TODO: highlight holidays
// TODO: highlight last week

export const dayToDateSand = (resetsArray: TResetsArray) => (day: number) => {
  // the first day of the Sand Calendar is Ema`araxx 1569 (1/1/1/1569)
  if (day < FIRST_SAND_YEAR * DAYS_IN_ONE_YEAR) {
    return { d: 0, m: 0, y: 0 };
  }

  const new_day = day - FIRST_SAND_YEAR * DAYS_IN_ONE_YEAR;

  const year = Math.ceil(new_day / DAYS_IN_ONE_SAND_YEAR);

  const id = bisect(resetsArray)(new_day);

  const d = new_day - resetsArray[id] + 1;

  const id_of_first_month_in_this_year =
    bisect(resetsArray)((year - 1) * DAYS_IN_ONE_SAND_YEAR) + 1;

  const is_last_week = new_day < resetsArray[id_of_first_month_in_this_year];

  const m = id + 1 - (is_last_week ? 0 : id_of_first_month_in_this_year);
  const y = is_last_week ? year - 1 : year;

  return { d, m, y };
};

const dateSandToDay =
  (resetsArray: TResetsArray) =>
  ({ d, m, y }: TDateObject) => {
    const offset = FIRST_SAND_YEAR * DAYS_IN_ONE_YEAR;

    const yearStart = (y! - 1) * DAYS_IN_ONE_SAND_YEAR;

    const id_of_first_month_in_this_year = bisect(resetsArray)(yearStart) + 1;

    let id = m - 1 + id_of_first_month_in_this_year;

    // last week of the year
    if (id >= resetsArray.length || resetsArray[id] < yearStart) {
      id = m - 1;
    }

    const new_day = resetsArray[id] + (d - 1);

    return offset + new_day;
  };

// eslint-disable-next-line react/display-name
const getSandDateInputs = (resetsArray: TResetsArray) => () => (
  <>
    <InputDate
      resetsArray={resetsArray}
      dayToDate={dayToDateSand}
      dateToDay={dateSandToDay}
      unit="d"
    />
    {SEPARATOR}
    <InputDate
      resetsArray={resetsArray}
      dayToDate={dayToDateSand}
      dateToDay={dateSandToDay}
      unit="m"
    />
    {SEPARATOR}
    <InputDate
      resetsArray={resetsArray}
      dayToDate={dayToDateSand}
      dateToDay={dateSandToDay}
      unit="y"
    />
  </>
);

export const SandDateInputs = {
  sm: getSandDateInputs(AMASIA_SM_RESETS),
  md: getSandDateInputs(AMASIA_MD_RESETS),
  lg: getSandDateInputs(AMASIA_LG_RESETS),
};
