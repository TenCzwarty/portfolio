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

// pre-rename keys on purpose: renaming them would make everyone pick their name again
export const STORAGE_KEY_ME = "kalendarz:me";
export const STORAGE_KEY_SECRET = "kalendarz:secret";

export const newId = () => crypto.randomUUID();

/** names are identities: "  Ania " on a new laptop is the same person as "ania" */
export const normalizeName = (name: string) =>
  name.trim().replace(/\s+/g, " ").toLocaleLowerCase("pl");

export const findByName = <T extends { name: string }>(people: Array<T>, name: string) =>
  people.find((p) => normalizeName(p.name) === normalizeName(name));
