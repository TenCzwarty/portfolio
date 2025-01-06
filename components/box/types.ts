type PositionType =
  | "top-left"
  | "top-center"
  | "top-right"
  | "mid-left"
  | "mid-center"
  | "mid-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type BoxType = {
  children?: React.ReactNode;
  position: PositionType;
  classes?: string;
};

export type BoxesType = { positions: PositionType[] };

type PositionVerticalType = "top" | "mid" | "bottom";
type PositionHorizontalType = "left" | "center" | "right";

export type TransformType = [PositionVerticalType, PositionHorizontalType];
