export type TSpinWheelContext = {
  elements: string[];
  validElements: string[];
  addElement: () => void;
  removeElement: (index: number) => void;
  updateElement: (index: number, value: string) => void;
  isSpinning: boolean;
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  winner: string | null;
  setWinner: React.Dispatch<React.SetStateAction<string | null>>;
  spin: () => void;
};
