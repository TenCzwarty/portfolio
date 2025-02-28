export type TCircle = {
  x: number;
  y: number;
  r: number;
};

export type TCircles = readonly TCircle[];

export type TCoordinates = Pick<TCircle, "x" | "y">;

export type TRef = React.RefObject<SVGSVGElement | null>;
