import { getSegmentColors } from "~spin/_utils/wheel";

/** fallback when the theme colors can't be read */
export const PALETTE = [
  "#e11d48",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0d9488",
  "#0284c7",
  "#4f46e5",
  "#9333ea",
  "#db2777",
  "#57534e",
];

const PALETTE_SIZE = 8;

const rgbToHex = (rgb: string) => {
  const parts = rgb.match(/\d+/g);
  return parts?.length === 3
    ? `#${parts.map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`
    : null;
};

/**
 * Swatches from the site's current theme, the same primary -> accent range as the /spin wheel.
 * Browser only - it reads CSS variables. Colors already picked are stored as hex, so they stay
 * put when the theme changes.
 */
export const themePalette = () => {
  const colors = getSegmentColors(PALETTE_SIZE)
    .map(rgbToHex)
    .filter((c): c is string => c !== null);
  const unique = [...new Set(colors)];
  return unique.length === PALETTE_SIZE ? unique : PALETTE;
};

// pre-rename keys on purpose: renaming them would make everyone pick their name again
export const STORAGE_KEY_ME = "kalendarz:me";
export const STORAGE_KEY_SECRET = "kalendarz:secret";

export const newId = () => crypto.randomUUID();

/** names are identities: "  Ania " on a new laptop is the same person as "ania" */
export const normalizeName = (name: string) =>
  name.trim().replace(/\s+/g, " ").toLocaleLowerCase("pl");

export const findByName = <T extends { name: string }>(people: Array<T>, name: string) =>
  people.find((p) => normalizeName(p.name) === normalizeName(name));
