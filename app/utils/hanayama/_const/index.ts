import PUZZLES_JSON from "./puzzles.json";
import type { TPuzzlesJson } from "./types";

export const getAllPuzzles = () => PUZZLES_JSON as TPuzzlesJson;

export const STORAGE_KEY_COLLECTED_PUZZLES = "collected-puzzles";
export const STORAGE_KEY_COMPLETED_PUZZLES = "completed-puzzles";
