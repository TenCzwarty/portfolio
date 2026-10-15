export type TCardZoomProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  number: string;
  name: string;
  kanji: string;
  /** one line per rikishi: current name · top rank · heya */
  details: Array<string>;
};
