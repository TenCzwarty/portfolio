import { TPuzzle } from "../_components/puzzle/types";

export type TPuzzlesJson = Array<{
  code: string;
  level: string;
  puzzles: Array<TPuzzle>;
}>;
