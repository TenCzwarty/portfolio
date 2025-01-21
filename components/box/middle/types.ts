export type CircleType = {
  x: number;
  y: number;
  r: number;
};

export type CirclesType = readonly CircleType[];

export type CoordinatesType = Pick<CircleType, "x" | "y">;

export type RefType = React.RefObject<SVGSVGElement | null>;
