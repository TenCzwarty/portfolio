export type TPuzzleRarity = "basic" | "rare";
export type TPuzzleSeries =
  | "chess"
  | "disney"
  | "pokemon"
  | "sea"
  | "ultraman"
  | "zelda";
export type TPuzzleStatus = "completed" | "collected";

export type TPuzzle = {
  code: string;
  id: string;
  src: string;

  name: string;
  "alt-names"?: string;
  author?: string;
  notes?: string;
  year?: number;
  tags?: Array<TPuzzleSeries>;
  rare?: boolean;
};

export type TPuzzleProps = TPuzzle & {
  isSettingsOpened: boolean;
};
