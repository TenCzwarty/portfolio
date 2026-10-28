/**
 * How a printing catches the light. BBM's only parallel on catalogued cards
 * is kira (sparkle), in a pattern that changes per set (scripts/sumo/finishes.json):
 * sleeve = standard card (in a sleeve), sparkle = plain glitter (2025),
 * sakura = cherry blossoms (2026 S1), dots / hearts / stars = 2026 S2 tiers,
 * starburst = holo firework print (Hannah Montana sparkle, starburst.css there)
 */
export type TFinishEffect =
  | "sleeve"
  | "sparkle"
  | "sakura"
  | "dots"
  | "hearts"
  | "stars"
  | "starburst";

export type TFinish = {
  id: string;
  name: string;
  printRun: number | null;
  chase?: boolean;
  /** missing = sleeve */
  effect?: TFinishEffect;
};

export type TSumoCard = {
  id: string;
  number: string;
  subset: string;
  rikishi: Array<string>;
  title: string;
  /** id of the set's theme (base-set chapter) the card belongs to */
  theme: string;
  rankAtIssue: string | null;
  src: string | null;
  tcdbImageUrl: string | null;
  finishes: Array<TFinish>;
};

/** A base-set chapter from BBM's checklist, e.g. "Smile!" or 縁起物 */
export type TSumoTheme = {
  id: string;
  name: string;
  nameJa: string;
};

export type TSumoSet = {
  code: string;
  set: string;
  line: string;
  year: number;
  series: number | null;
  label: string | null;
  subsets: Array<string>;
  /** in checklist order (scripts/sumo/subsets.json) */
  themes: Array<TSumoTheme>;
  cards: Array<TSumoCard>;
};

export type TSumoSetsJson = Array<TSumoSet>;

export type TRikishi = {
  sumoApiId: number;
  shikona: string;
  kanji: string | null;
  topRank: string | null;
  heya: string | null;
  country: string | null;
  retired: boolean;
};

export type TRikishiMap = Record<string, TRikishi>;
