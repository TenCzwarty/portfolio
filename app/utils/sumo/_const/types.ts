/**
 * How a printing catches the light, mapped to the BBM finishes:
 * sleeve = standard card (in a sleeve), sparkle = Sparkle / Glitter parallel,
 * gold = gold foil (金箔), purple = purple foil (紫箔), prismatic = 1-of-1 rainbow
 */
export type TFinishEffect = "sleeve" | "sparkle" | "gold" | "purple" | "prismatic";

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
