import CARDS_JSON from "./cards.json";
import RIKISHI_JSON from "./rikishi.json";
import type { TFinishEffect, TRikishiMap, TSumoSetsJson } from "./types";

export const getAllSets = () => CARDS_JSON as TSumoSetsJson;

export const getRikishi = () => RIKISHI_JSON as Partial<TRikishiMap>;

export const STORAGE_KEY_OWNED_FINISHES = "sumo-owned-finishes";

export const FINISH_EFFECTS: Array<{ effect: TFinishEffect; label: string }> = [
  { effect: "sleeve", label: "Standard" },
  { effect: "sparkle", label: "Sparkle" },
  { effect: "gold", label: "Gold foil" },
  { effect: "purple", label: "Purple foil" },
  { effect: "prismatic", label: "Prismatic 1/1" },
];
