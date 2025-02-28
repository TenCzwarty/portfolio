import { Trash2Icon } from "lucide-react";

import { useQRCodeGeneratorContext } from "~qr/_context";

import { TSVGCard } from "./types";

export const SVGCard = ({ svgString, index }: TSVGCard) => {
  const context = useQRCodeGeneratorContext();

  const removeQR = () => context.removeQR(index);

  return (
    <div className="group relative">
      <div dangerouslySetInnerHTML={{ __html: svgString }} />
      <button
        onClick={removeQR}
        className="absolute bottom-0 right-0 hidden rounded-md bg-accent-500 p-4 group-hover:block"
      >
        <Trash2Icon />
      </button>
    </div>
  );
};
