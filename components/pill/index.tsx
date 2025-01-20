import { PillType } from "./types";

export const Pill = ({ children, classes }: PillType) => (
  <span
    className={`bg-primary-800 rounded-full px-4 py-1 text-white ${classes}`}
  >
    {children}
  </span>
);
