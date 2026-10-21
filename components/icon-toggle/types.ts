export type TIconToggle = {
  id: string;
  numberOfStates?: 2 | 3;
  initialState?: 0 | 1 | 2;
  /** controlled state, for when the owner keeps it (e.g. restored from storage) */
  state?: 0 | 1 | 2;
  title?: string;
  children: React.ReactNode;
  toggleFunction: () => void;
};
