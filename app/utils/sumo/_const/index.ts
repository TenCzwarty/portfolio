import CARDS_JSON from "./cards.json";
import RIKISHI_JSON from "./rikishi.json";
import type { TRikishiMap, TSumoSetsJson } from "./types";

export const getAllSets = () => CARDS_JSON as TSumoSetsJson;

export const getRikishi = () => RIKISHI_JSON as Partial<TRikishiMap>;

export const STORAGE_KEY_OWNED_FINISHES = "sumo-owned-finishes";
