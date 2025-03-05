import type { TPill } from "./types";

export const Pill = ({ children, classes }: TPill) => (
  <span
    className={`bg-primary-800 flex w-fit items-center gap-2 rounded-full px-4 py-1 text-center text-white ${classes}`}
  >
    {children}
  </span>
);
