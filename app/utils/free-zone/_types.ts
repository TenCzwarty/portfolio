/** "YYYY-MM-DD", always a local calendar date, never a timestamp */
export type TDay = string;

export type TPerson = {
  id: string;
  name: string;
  color: string;
};

export const RSVP_ANSWERS = ["yes", "maybe", "no"] as const;
export type TRsvp = (typeof RSVP_ANSWERS)[number];

export type TPlan = {
  id: string;
  title: string;
  description?: string;
  start: TDay;
  end: TDay;
  createdBy: string;
  /** person id -> whether they're in */
  rsvp?: Record<string, TRsvp>;
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
  /** label -> icon name, for default and custom stamps alike */
  stampIcons: Record<string, string>;
};

export type TStamp = {
  day: TDay;
  personId: string;
  label: string;
  /** random per placement, so each stamp lands its own way - absent on stamps from before */
  seed?: string;
};

export type TCalendarAction =
  | { type: "person"; person: TPerson }
  | { type: "availability"; personId: string; day: TDay; available: boolean }
  | { type: "plan-add"; plan: TPlan }
  | { type: "plan-delete"; id: string }
  | { type: "plan-update"; id: string; title: string; description?: string }
  /** null takes the answer back */
  | { type: "plan-rsvp"; id: string; personId: string; answer: TRsvp | null }
  | { type: "stamp"; stamp: TStamp; on: boolean }
  /** adds a custom stamp and/or sets its icon (null removes the icon) */
  | { type: "stamp-def"; label: string; icon: string | null }
  | { type: "stamp-label-delete"; label: string };
