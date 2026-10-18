/** `${card.id}@${finish.id}`: a collection tracks finishes, not just cards */
export type TOwnedKey = string;

export type TSumoContext = {
  /** zoomed card offers every finish as a preview, not only the printed ones */
  isShowingFinishPreviews: boolean;
  toggleIsShowingFinishPreviews: () => void;

  ownedFinishes: Array<TOwnedKey>;
  setOwnedFinishes: (keys: Array<TOwnedKey>) => void;
  toggleOwned: (key: TOwnedKey) => void;
  isOwned: (key: TOwnedKey) => boolean;
};
