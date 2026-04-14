import type { TSpinWheelContext } from "./types";

export const init = {
  elements: [],
  validElements: [],
  addElement: () => {},
  removeElement: () => {},
  updateElement: () => {},
  isSpinning: false,
  setIsSpinning: () => {},
  winner: null,
  setWinner: () => {},
  spin: () => {},
} satisfies TSpinWheelContext;
