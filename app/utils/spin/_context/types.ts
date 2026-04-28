export type TSpinElement = {
  label: string;
  weight?: number;
};

export type TSpinWheelContext = {
  elements: TSpinElement[];
  validElements: TSpinElement[];
  addElement: () => void;
  removeElement: (index: number) => void;
  updateElement: (index: number, element: TSpinElement) => void;
  isSpinning: boolean;
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  winner: string | null;
  setWinner: React.Dispatch<React.SetStateAction<string | null>>;
  spin: () => void;
};
