import { InputDate } from "~amasia/_components/input-date";
import type {
  TDateObject,
  TResetsArray,
} from "~amasia/_components/input-date/types";
import { SEPARATOR } from "~amasia/_const";
import AMASIA_LG_RESETS from "~amasia/_const/amasia-lg-resets.json";
import AMASIA_MD_RESETS from "~amasia/_const/amasia-md-resets.json";
import AMASIA_SM_RESETS from "~amasia/_const/amasia-sm-resets.json";
import { bisect } from "~amasia/_utils/bisect";

const globalDayToSimpleDate = (resetsArray: TResetsArray) => (day: number) => {
  const id = bisect(resetsArray)(day);

  const d = day - resetsArray[id] + 1;
  const m = id + 1;

  return { d, m };
};

const simpleDateToGlobalDay =
  (resetsArray: TResetsArray) =>
  ({ d, m }: TDateObject) =>
    resetsArray[m - 1] + (d - 1);

// eslint-disable-next-line react/display-name
const getSimpleDateInputs = (resetsArray: TResetsArray) => () => (
  <>
    <InputDate
      resetsArray={resetsArray}
      dayToDate={globalDayToSimpleDate}
      dateToDay={simpleDateToGlobalDay}
      unit="d"
    />
    {SEPARATOR}
    <InputDate
      resetsArray={resetsArray}
      dayToDate={globalDayToSimpleDate}
      dateToDay={simpleDateToGlobalDay}
      unit="m"
    />
  </>
);

export const SimpleDateInputs = {
  sm: getSimpleDateInputs(AMASIA_SM_RESETS),
  md: getSimpleDateInputs(AMASIA_MD_RESETS),
  lg: getSimpleDateInputs(AMASIA_LG_RESETS),
};
