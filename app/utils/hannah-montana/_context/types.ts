import type { TCardSize, TOwnedKey } from "~sumo/_context/types";

export type THannahContext = {
  cardSize: TCardSize;
  setCardSize: (size: TCardSize) => void;

  ownedFinishes: Array<TOwnedKey>;
  setOwnedFinishes: (keys: Array<TOwnedKey>) => void;
  toggleOwned: (key: TOwnedKey) => void;
  isOwned: (key: TOwnedKey) => boolean;
};
