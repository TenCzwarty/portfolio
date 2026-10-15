import type { TFinish } from "~sumo/_const/types";

export type TCardZoomProps = {
  onClose: () => void;
  src: string;
  alt: string;
  number: string;
  name: string;
  kanji: string;
  /** one line per rikishi: current name · top rank · heya */
  details: Array<string>;
  finishes: Array<TFinish>;
};
