import type { TRefSVG } from "~qr/_context/types";

export const serializeSVG = (ref: TRefSVG) => {
  if (!ref) return;
  if (!ref.current) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(ref.current);

  return svgString;
};
