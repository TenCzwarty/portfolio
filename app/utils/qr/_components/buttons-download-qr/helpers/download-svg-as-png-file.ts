import type { RefSVGType } from "@/app/utils/qr/_context/types";

import { triggerDownload } from "@/app/utils/qr/_components/buttons-download-qr/helpers/trigger-download";
import { convertSVGToPNG } from "@/app/utils/qr/_utils/convert-svg-to-png";
import { serializeSVG } from "@/app/utils/qr/_utils/serialize-svg";

type Props = {
  ref: RefSVGType;
  name?: string;
};

export const downloadSVGAsPNGFile = async ({ ref, name }: Props) => {
  const svgString = serializeSVG(ref);

  if (!svgString) return;

  const url = await convertSVGToPNG({ svgString });

  if (!url) return;

  const filename = `${name || new Date().toISOString()}.png`;

  triggerDownload({ url, filename });
};
