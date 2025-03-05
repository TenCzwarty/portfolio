type TPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "mid-left"
  | "mid-center"
  | "mid-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type TBox = {
  children?: React.ReactNode;
  position: TPosition;
  classes?: string;
};

export type TBoxes = { positions: TPosition[] };

type TPositionVertical = "top" | "mid" | "bottom";
type TPositionHorizontal = "left" | "center" | "right";

export type TTransform = [TPositionVertical, TPositionHorizontal];
