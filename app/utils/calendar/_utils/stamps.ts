import type { TStamp } from "../_types";

export const DEFAULT_STAMPS = ["?", "NC", "WRO", "WAW"];

export const STAMP_MAX_LENGTH = 4;

// short and loud on purpose: it has to fit a 50px cell next to other people's stamps.
// No ".", so no label can look like a float that Upstash would auto-parse ("1.50" -> 1.5)
const RE_STAMP = new RegExp(`^[A-Z0-9ĄĆĘŁŃÓŚŹŻ?!]{1,${STAMP_MAX_LENGTH}}$`);

export const normalizeStamp = (label: string) => label.trim().toLocaleUpperCase("pl");

export const isStampLabel = (v: unknown): v is string => typeof v === "string" && RE_STAMP.test(v);

/** Redis set member - "|" cannot appear in a day, an id or a label */
export const serializeStamp = ({ day, personId, label }: TStamp) => `${day}|${personId}|${label}`;

export const parseStamp = (member: string): TStamp | null => {
  const [day, personId, label] = member.split("|");
  return day && personId && label ? { day, personId, label } : null;
};

export const sameStamp = (a: TStamp, b: TStamp) =>
  a.day === b.day && a.personId === b.personId && a.label === b.label;

/** people pick any color, so the label text has to pick its own contrast */
export const textColorOn = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.6 ? "#000000" : "#ffffff";
};
