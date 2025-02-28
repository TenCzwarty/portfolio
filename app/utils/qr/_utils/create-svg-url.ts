type TParameters = { svgString: string };

export const createSVGUrl = ({ svgString }: TParameters) => {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(blob);

  return svgUrl;
};
