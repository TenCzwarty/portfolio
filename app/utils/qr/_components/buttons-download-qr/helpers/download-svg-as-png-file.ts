import { triggerDownload } from "~qr/_components/buttons-download-qr/helpers/trigger-download";
import type { TRefSVG } from "~qr/_context/types.ts";
import { convertSVGToPNG } from "~qr/_utils/convert-svg-to-png";
import { serializeSVG } from "~qr/_utils/serialize-svg";

type TParameters = {
  ref: TRefSVG;
  name?: string;
};

export const downloadSVGAsPNGFile = async ({ ref, name }: TParameters) => {
  const svgString = serializeSVG(ref);

  if (!svgString) return;

  const url = await convertSVGToPNG({ svgString });

  if (!url) return;

  const filename = `${name || new Date().toISOString()}.png`;

  triggerDownload({ url, filename });
};
