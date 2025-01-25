import { PillType } from "./types";

export const Pill = ({ children, classes }: PillType) => (
  <span
    className={`flex w-fit items-center gap-2 rounded-full bg-primary-800 px-4 py-1 text-center text-white ${classes}`}
  >
    {children}
  </span>
);
