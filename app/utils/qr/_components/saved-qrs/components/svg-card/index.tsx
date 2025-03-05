import { Trash2Icon } from "lucide-react";

import type { TSVGCard } from "./types";

import { useQRCodeGeneratorContext } from "~qr/_context";

export const SVGCard = ({ svgString, index }: TSVGCard) => {
  const context = useQRCodeGeneratorContext();

  const removeQR = () => context.removeQR(index);

  return (
    <div className="group relative">
      <div dangerouslySetInnerHTML={{ __html: svgString }} />
      <button
        onClick={removeQR}
        className="bg-accent-500 absolute right-0 bottom-0 hidden rounded-md p-4 group-hover:block"
      >
        <Trash2Icon />
      </button>
    </div>
  );
};
