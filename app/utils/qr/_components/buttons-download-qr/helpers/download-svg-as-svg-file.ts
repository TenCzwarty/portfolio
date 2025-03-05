import { triggerDownload } from "./trigger-download";

import type { TRefSVG } from "~qr/_context/types";
import { createSVGUrl } from "~qr/_utils/create-svg-url";
import { serializeSVG } from "~qr/_utils/serialize-svg";

type TParameters = {
  ref: TRefSVG;
  name?: string;
};

export const downloadSVGAsSVGFile = ({ ref, name }: TParameters) => {
  const svgString = serializeSVG(ref);

  if (!svgString) return;

  const url = createSVGUrl({ svgString });

  if (!url) return;

  const filename = `${name || new Date().toISOString()}.svg`;

  triggerDownload({ url, filename });
};
