import type { TSumoCard } from "~sumo/_const/types";

export type TSumoCardProps = TSumoCard & {
  /** settings accordion open: a click collects the card instead of zooming */
  isSettingsOpened: boolean;
};
