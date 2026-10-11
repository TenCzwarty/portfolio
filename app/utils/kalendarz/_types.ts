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
  start: TDay;
  end: TDay;
  createdBy: string;
};

export type TCalendarData = {
  people: Array<TPerson>;
  plans: Array<TPlan>;
  /** person id -> days that person is free */
  availability: Record<string, Array<TDay>>;
};

export type TCalendarAction =
  | { type: "person"; person: TPerson }
  | { type: "availability"; personId: string; day: TDay; available: boolean }
  | { type: "plan-add"; plan: TPlan }
  | { type: "plan-delete"; id: string };
