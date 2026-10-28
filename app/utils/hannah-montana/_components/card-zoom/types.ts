import type { THannahCard } from "~hannah-montana/_const/types";

export type THannahCardZoomProps = {
  card: THannahCard;
  /** null: no photo yet, a placeholder is shown instead */
  src: string | null;
  onClose: () => void;
};
