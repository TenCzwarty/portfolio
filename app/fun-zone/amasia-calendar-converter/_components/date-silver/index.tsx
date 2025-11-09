import { InputDate } from "~amasia/_components/input-date";
import type {
  TDateObject,
  TResetsArray,
  TYearResetsArray,
} from "~amasia/_components/input-date/types";
import { SEPARATOR } from "~amasia/_const";
import AMASIA_LG_RESETS from "~amasia/_const/amasia-lg-resets.json";
import AMASIA_MD_RESETS from "~amasia/_const/amasia-md-resets.json";
import AMASIA_SM_RESETS from "~amasia/_const/amasia-sm-resets.json";
import AMASIA_YEARS_INANIS from "~amasia/_const/amasia-years-inanis.json";
import AMASIA_YEARS_TRIFECTAS from "~amasia/_const/amasia-years-trifectas.json";
import { bisect } from "~amasia/_utils/bisect";

export const dayToDateSilver =
  (yearResetsArray: TYearResetsArray) =>
  (monthResetsArray: TResetsArray) =>
  (day: number) => {
    const year_id = bisect(yearResetsArray)(day);
    const y = year_id + 1;

    const id = bisect(monthResetsArray)(day);
    const d = day - monthResetsArray[id] + 1;

    const id_of_first_month_in_this_year = bisect(monthResetsArray)(
      yearResetsArray[year_id],
    );

    const m = id + 1 - id_of_first_month_in_this_year;

    return { d, m, y };
  };

const dateSilverToDay =
  (yearResetsArray: TYearResetsArray) =>
  (resetsArray: TResetsArray) =>
  ({ d, m, y }: TDateObject) => {
    const year_id = y! - 1;
    const year_start = yearResetsArray[year_id];

    const id_of_first_month_in_this_year = bisect(resetsArray)(year_start);

    const id = m - 1 + id_of_first_month_in_this_year;

    return resetsArray[id] + (d - 1);
  };

/* eslint-disable react/display-name */
const getSilverDateInputs =
  (yearResetsArray: TYearResetsArray) => (resetsArray: TResetsArray) => () => (
    <>
      <InputDate
        resetsArray={resetsArray}
        dayToDate={dayToDateSilver(yearResetsArray)}
        dateToDay={dateSilverToDay(yearResetsArray)}
        unit="d"
      />
      {SEPARATOR}
      <InputDate
        resetsArray={resetsArray}
        dayToDate={dayToDateSilver(yearResetsArray)}
        dateToDay={dateSilverToDay(yearResetsArray)}
        unit="m"
      />
      {SEPARATOR}
      <InputDate
        resetsArray={resetsArray}
        dayToDate={dayToDateSilver(yearResetsArray)}
        dateToDay={dateSilverToDay(yearResetsArray)}
        unit="y"
      />
    </>
  );

export const SilverDateInputs = {
  light: {
    sm: getSilverDateInputs(AMASIA_YEARS_TRIFECTAS)(AMASIA_SM_RESETS),
    md: getSilverDateInputs(AMASIA_YEARS_TRIFECTAS)(AMASIA_MD_RESETS),
    lg: getSilverDateInputs(AMASIA_YEARS_TRIFECTAS)(AMASIA_LG_RESETS),
  },
  dark: {
    sm: getSilverDateInputs(AMASIA_YEARS_INANIS)(AMASIA_SM_RESETS),
    md: getSilverDateInputs(AMASIA_YEARS_INANIS)(AMASIA_MD_RESETS),
    lg: getSilverDateInputs(AMASIA_YEARS_INANIS)(AMASIA_LG_RESETS),
  },
};
