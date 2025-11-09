import { InputDate } from "~amasia/_components/input-date";
import type {
  TDateObject,
  TResetsArray,
} from "~amasia/_components/input-date/types";
import { DAYS_IN_ONE_YEAR, SEPARATOR } from "~amasia/_const";
import AMASIA_LG_RESETS from "~amasia/_const/amasia-lg-resets.json";
import AMASIA_MD_RESETS from "~amasia/_const/amasia-md-resets.json";
import AMASIA_SM_RESETS from "~amasia/_const/amasia-sm-resets.json";
import { bisect } from "~amasia/_utils/bisect";

// TODO: highlight holidays
// TODO: highlight last week

const globalDayToGoldenDate = (resetsArray: TResetsArray) => (day: number) => {
  const year = Math.ceil(day / DAYS_IN_ONE_YEAR);

  const id_of_first_month_in_this_year =
    bisect(resetsArray)((year - 1) * DAYS_IN_ONE_YEAR) + 1;

  const is_last_week = day < resetsArray[id_of_first_month_in_this_year];

  const id = bisect(resetsArray)(day);

  const d = day - resetsArray[id] + 1;
  const m = id + 1 - (is_last_week ? 0 : id_of_first_month_in_this_year);
  const y = is_last_week ? year - 1 : year;

  return { d, m, y };
};

const goldenDateToGlobalDay =
  (resetsArray: TResetsArray) =>
  ({ d, m, y }: TDateObject) => {
    const offset = (y! - 1) * DAYS_IN_ONE_YEAR;

    const id_of_first_month_in_this_year = bisect(resetsArray)(offset) + 1;

    let id = m - 1 + id_of_first_month_in_this_year;

    // last week of the year
    if (id >= resetsArray.length || resetsArray[id] < offset) {
      id = m - 1;
    }

    return resetsArray[id] + (d - 1);
  };

// eslint-disable-next-line react/display-name
const getGoldenDateInputs = (resetsArray: TResetsArray) => () => (
  <>
    <InputDate
      resetsArray={resetsArray}
      dayToDate={globalDayToGoldenDate}
      dateToDay={goldenDateToGlobalDay}
      unit="d"
    />
    {SEPARATOR}
    <InputDate
      resetsArray={resetsArray}
      dayToDate={globalDayToGoldenDate}
      dateToDay={goldenDateToGlobalDay}
      unit="m"
    />
    {SEPARATOR}
    <InputDate
      resetsArray={resetsArray}
      dayToDate={globalDayToGoldenDate}
      dateToDay={goldenDateToGlobalDay}
      unit="y"
    />
  </>
);

export const GoldenDateInputs = {
  sm: getGoldenDateInputs(AMASIA_SM_RESETS),
  md: getGoldenDateInputs(AMASIA_MD_RESETS),
  lg: getGoldenDateInputs(AMASIA_LG_RESETS),
};
