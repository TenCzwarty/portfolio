import type { BoxType, BoxesType, TransformType } from "./types";

const TRANSFORMS = {
  top: "top-0 -translate-y-0",
  mid: "top-1/2 -translate-y-1/2",
  bottom: "top-full -translate-y-full",
  left: "left-0 -translate-x-0",
  center: "left-1/2 -translate-x-1/2",
  right: "left-full -translate-x-full",
};

export const Box = ({ children, position, classes }: BoxType) => {
  const [vertical, horizontal] = position.split("-") as TransformType;

  const transform = `${TRANSFORMS[vertical]} ${TRANSFORMS[horizontal]}`;

  return (
    <div
      className={`relative aspect-square max-h-[50dvh] max-w-[50dvw] rounded-[30%] border-2 border-slate-800 shadow-lg ${transform} ${classes}`}
    >
      {children}
    </div>
  );
};

export const Boxes = ({ positions }: BoxesType) =>
  positions.map((position) => <Box key={position} position={position} />);
