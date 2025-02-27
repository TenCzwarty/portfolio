type Type = { svgString: string };

export const createSVGUrl = ({ svgString }: Type) => {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(blob);

  return svgUrl;
};
