import type { TStamp } from "../_types";

export const DEFAULT_STAMPS = ["NC", "WRO", "WAW"];

export const STAMP_MAX_LENGTH = 12;

// letters (any alphabet), digits, spaces and a little punctuation - never "|", the separator
const RE_STAMP = new RegExp(`^[\\p{L}\\p{N}?!&'+\\- ]{1,${STAMP_MAX_LENGTH}}$`, "u");

export const normalizeStamp = (label: string) =>
  label.trim().replace(/\s+/g, " ").toLocaleUpperCase("pl");

/** names of the icons a stamp can carry, see _components/stamp-icon for the drawings */
export const STAMP_ICON_NAMES = [
  "help",
  "plane",
  "train",
  "car",
  "bus",
  "bike",
  "ship",
  "home",
  "bed",
  "work",
  "laptop",
  "school",
  "mountain",
  "trees",
  "tent",
  "beach",
  "sun",
  "snow",
  "party",
  "beer",
  "wine",
  "coffee",
  "food",
  "cake",
  "gift",
  "music",
  "ticket",
  "game",
  "sport",
  "heart",
  "baby",
  "dog",
  "doctor",
  "star",
  "pin",
] as const;

export type TStampIconName = (typeof STAMP_ICON_NAMES)[number];

/** any other Lucide icon, by its kebab-case name: "l:mountain-snow" */
export const LUCIDE_PREFIX = "l:";
const RE_LUCIDE_ICON = /^l:[a-z0-9]+(-[a-z0-9]+)*$/;

export const isCuratedIcon = (v: string): v is TStampIconName =>
  (STAMP_ICON_NAMES as ReadonlyArray<string>).includes(v);

export const isStampIcon = (v: unknown): v is string =>
  typeof v === "string" && v.length <= 64 && (isCuratedIcon(v) || RE_LUCIDE_ICON.test(v));

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
    // a long label would hang off the side of the cell from an edge slot - keep those centred
    const isLong = (key.split("|")[2] ?? "").length > 5;

    placements.set(key, {
      x: (isLong ? 50 : base.x) + (((h >>> 8) % 11) - 5), // ±5%
      y: base.y + (((h >>> 12) % 9) - 4), // ±4%
      rotation: ((h >>> 16) % 41) - 20, // -20deg .. 20deg
    });
  }

  return placements;
};
