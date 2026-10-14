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

/** FNV-1a: tiny, stable across browsers - everyone sees a stamp in the same spot */
const hash = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// spots (% of the cell) a stamp can land on: away from the day number in the top-left corner
const SLOTS = [
  { x: 72, y: 28 },
  { x: 44, y: 50 },
  { x: 74, y: 52 },
  { x: 44, y: 70 },
  { x: 74, y: 72 },
];

export type TStampPlacement = { x: number; y: number; rotation: number };

/**
 * "Random" but deterministic spot and tilt for every stamp in one cell, derived from the stamps
 * themselves, so they don't jump around on refresh and everyone sees the same thing. Each stamp
 * prefers the slot its hash points at and takes the next free one if it's taken, so stamps on a
 * busy day don't pile up on top of each other (until the slots run out).
 */
export const placeStamps = (stamps: Array<TStamp>) => {
  const taken = new Set<number>();
  const placements = new Map<string, TStampPlacement>();

  for (const key of stamps.map(serializeStamp).sort()) {
    const h = hash(key);
    const preferred = h % SLOTS.length;
    let slot = -1;
    for (let i = 0; i < SLOTS.length; i++) {
      const candidate = (preferred + i) % SLOTS.length;
      if (!taken.has(candidate)) {
        slot = candidate;
        break;
      }
    }

    const base = slot === -1 ? SLOTS[preferred] : SLOTS[slot];
    if (slot !== -1) taken.add(slot);

    placements.set(key, {
      x: base.x + (((h >>> 8) % 11) - 5), // ±5%
      y: base.y + (((h >>> 12) % 9) - 4), // ±4%
      rotation: ((h >>> 16) % 41) - 20, // -20deg .. 20deg
    });
  }

  return placements;
};
