import type { TFinish } from "~sumo/_const/types";

export type TCardZoomProps = {
  onClose: () => void;
  /** null: no scan, a placeholder is shown instead */
  src: string | null;
  alt: string;
  number: string;
  name: string;
  kanji: string;
  /** one line per rikishi: current name · top rank · heya */
  details: Array<string>;
  cardId: string;
  finishes: Array<TFinish>;
};
