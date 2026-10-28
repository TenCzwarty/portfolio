import type { THannahContext } from "./types";

export const init: THannahContext = {
  cardSize: "medium",
  setCardSize: () => {},

  ownedFinishes: [],
  setOwnedFinishes: () => {},
  toggleOwned: () => {},
  isOwned: () => false,
};
