export type TIconToggle = {
  id: string;
  numberOfStates?: 2 | 3;
  initialState?: 0 | 1 | 2;
  title?: string;
  children: React.ReactNode;
  toggleFunction: () => void;
};
