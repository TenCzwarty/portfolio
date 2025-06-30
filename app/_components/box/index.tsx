import type { TBox, TBoxes, TTransform } from "./types";

const TRANSFORMS = {
  top: "top-0 -translate-y-0",
  mid: "top-1/2 -translate-y-1/2",
  bottom: "top-full -translate-y-full",
  left: "left-0 -translate-x-0",
  center: "left-1/2 -translate-x-1/2",
  right: "left-full -translate-x-full",
};

export const Box = ({ children, position, classes }: TBox) => {
  const [vertical, horizontal] = position.split("-") as TTransform;

  const transform = `${TRANSFORMS[vertical]} ${TRANSFORMS[horizontal]}`;

  return (
    <div
      className={`border-primary-900 relative aspect-square max-h-[50dvh] max-w-[50dvw] rounded-[30%] border-2 shadow-xl duration-[2s] ${transform} ${classes}`}
    >
      {children}
    </div>
  );
};

export const Boxes = ({ positions }: TBoxes) =>
  positions.map((position) => <Box key={position} position={position} />);
