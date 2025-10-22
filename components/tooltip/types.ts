import type { ITooltip } from "react-tooltip";

export type TTooltip = {
  id: string;
  children: React.ReactNode;
} & ITooltip;
