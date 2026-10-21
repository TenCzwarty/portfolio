import type { TSumoContext } from "./types";

export const init: TSumoContext = {
  isShowingFinishPreviews: true,
  toggleIsShowingFinishPreviews: () => {},

  ownedFinishes: [],
  setOwnedFinishes: () => {},
  toggleOwned: () => {},
  isOwned: () => false,
};
