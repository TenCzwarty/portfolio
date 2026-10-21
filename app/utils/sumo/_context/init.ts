import type { TSumoContext } from "./types";

export const init: TSumoContext = {
  isShowingFinishPreviews: false,
  toggleIsShowingFinishPreviews: () => {},

  cardSize: "medium",
  setCardSize: () => {},

  ownedFinishes: [],
  setOwnedFinishes: () => {},
  toggleOwned: () => {},
  isOwned: () => false,
};
