/** "YYYY-MM-DD", always a local calendar date, never a timestamp */
export type TDay = string;

export type TPerson = {
  id: string;
  name: string;
  color: string;
};

export type TPlan = {
  id: string;
  title: string;
  description?: string;
  start: TDay;
  end: TDay;
  createdBy: string;
};

export type TCalendarData = {
  people: Array<TPerson>;
  plans: Array<TPlan>;
  /** person id -> days that person is free */
  availability: Record<string, Array<TDay>>;
  /** where people are on a given day - independent of availability, several per day allowed */
  stamps: Array<TStamp>;
  /** labels added by the group on top of DEFAULT_STAMPS */
  customStamps: Array<string>;
};

export type TStamp = {
  day: TDay;
  personId: string;
  label: string;
};

export type TCalendarAction =
  | { type: "person"; person: TPerson }
  | { type: "availability"; personId: string; day: TDay; available: boolean }
  | { type: "plan-add"; plan: TPlan }
  | { type: "plan-delete"; id: string }
  | { type: "plan-update"; id: string; title: string; description?: string }
  | { type: "stamp"; stamp: TStamp; on: boolean }
  | { type: "stamp-label-add"; label: string }
  | { type: "stamp-label-delete"; label: string };
