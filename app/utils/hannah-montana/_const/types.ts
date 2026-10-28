import type { TFinish } from "~sumo/_const/types";

export type THannahCard = {
  id: string;
  number: string;
  /** file in /images/utils/hannah-montana/, null until there's a photo */
  src: string | null;
  finishes: Array<TFinish>;
};

/** One unnamed box, so a single "set" — the shape the shared URL codec expects */
export type THannahSet = {
  code: string;
  cards: Array<THannahCard>;
};
