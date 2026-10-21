import type { TSumoSetsJson } from "~sumo/_const/types";
import type { TOwnedKey } from "~sumo/_context/types";

// ?c=1.26s2.AAPw_8.25s1.gA
// version, then pairs of set code + base64url bitmap. Every finish of every
// card in the set is one bit, in cards.json order (card, then its finishes),
// so a whole set fits in ~50 characters. Bump VERSION if that order changes.
export const PARAM = "c";
const VERSION = "1";

const slotsOf = (set: TSumoSetsJson[number]) =>
  set.cards.flatMap((card) => card.finishes.map((finish) => `${card.id}@${finish.id}`));

const toBase64Url = (bytes: Array<number>) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (text: string) => {
  try {
    return Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  } catch {
    return [];
  }
};

export const encode = (sets: TSumoSetsJson, owned: Array<TOwnedKey>) => {
  const ownedSet = new Set(owned);
  const parts: Array<string> = [];

  for (const set of sets) {
    const bytes: Array<number> = [];
    slotsOf(set).forEach((key, i) => {
      if (!ownedSet.has(key)) return;
      bytes[i >> 3] = (bytes[i >> 3] ?? 0) | (1 << (i & 7));
    });
    if (bytes.length) parts.push(set.code, toBase64Url(Array.from(bytes, (b) => b ?? 0)));
  }

  return parts.length ? [VERSION, ...parts].join(".") : "";
};

export const decode = (sets: TSumoSetsJson, value: string): Array<TOwnedKey> => {
  const [version, ...parts] = value.split(".");
  if (version !== VERSION) return [];

  const owned: Array<TOwnedKey> = [];
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const set = sets.find((s) => s.code === parts[i]);
    if (!set) continue;

    const bytes = fromBase64Url(parts[i + 1]);
    slotsOf(set).forEach((key, slot) => {
      if ((bytes[slot >> 3] ?? 0) & (1 << (slot & 7))) owned.push(key);
    });
  }

  return owned;
};
