import { PillType } from "./types";

export const Pill = ({ children, classes }: PillType) => (
  <span className={`rounded-full bg-slate-800 px-4 py-1 text-white ${classes}`}>
    {children}
  </span>
);
