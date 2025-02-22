import type { InputType } from "./types";

export const Input = ({ classes, ...props }: InputType) => (
  <input className={`w-full rounded-md p-4 ${classes}`} {...props} />
);
