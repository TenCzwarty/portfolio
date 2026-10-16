/**
 * How a printing catches the light. BBM's only parallel on catalogued cards
 * is kira (sparkle), in a pattern that changes per set (scripts/sumo/finishes.json):
 * sleeve = standard card (in a sleeve), sparkle = plain glitter (2025),
 * sakura = cherry blossoms (2026 S1), dots / hearts / stars = 2026 S2 tiers
 */
export type TFinishEffect = "sleeve" | "sparkle" | "sakura" | "dots" | "hearts" | "stars";

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
  theme: string;
  rankAtIssue: string | null;
  src: string | null;
  tcdbImageUrl: string | null;
  finishes: Array<TFinish>;
};

export type TSumoSet = {
  code: string;
  set: string;
  line: string;
  year: number;
  series: number | null;
  label: string | null;
  subsets: Array<string>;
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
