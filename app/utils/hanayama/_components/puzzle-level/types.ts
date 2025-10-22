import { TPuzzle } from "~hanayama/_components/puzzle/types";

export type TPuzzleLevel = {
  level: string;
  puzzles: Array<TPuzzle>;
  isSettingsOpened: boolean;
};
