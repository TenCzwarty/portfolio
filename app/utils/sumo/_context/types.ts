/** `${card.id}@${finish.id}`: a collection tracks finishes, not just cards */
export type TOwnedKey = string;

/** size of the cards in the set grid */
export type TCardSize = "small" | "medium" | "large";

export type TSumoContext = {
  /** zoomed card offers every finish as a preview, not only the printed ones */
  isShowingFinishPreviews: boolean;
  toggleIsShowingFinishPreviews: () => void;

  cardSize: TCardSize;
  setCardSize: (size: TCardSize) => void;

  ownedFinishes: Array<TOwnedKey>;
  setOwnedFinishes: (keys: Array<TOwnedKey>) => void;
  toggleOwned: (key: TOwnedKey) => void;
  isOwned: (key: TOwnedKey) => boolean;
};
