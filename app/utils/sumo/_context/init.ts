import type { TSumoContext } from "./types";

export const init: TSumoContext = {
  isShowingFinishPreviews: false,
  toggleIsShowingFinishPreviews: () => {},

  ownedFinishes: [],
  setOwnedFinishes: () => {},
  toggleOwned: () => {},
  isOwned: () => false,
};
