import type { RefSVGType } from "@/app/utils/qr/_context/types";

import { createSVGUrl } from "@/app/utils/qr/_utils/create-svg-url";
import { triggerDownload } from "./trigger-download";
import { serializeSVG } from "@/app/utils/qr/_utils/serialize-svg";

type Props = {
  ref: RefSVGType;
  name?: string;
};

export const downloadSVGAsSVGFile = ({ ref, name }: Props) => {
  const svgString = serializeSVG(ref);

  if (!svgString) return;

  const url = createSVGUrl({ svgString });

  if (!url) return;

  const filename = `${name || new Date().toISOString()}.svg`;

  triggerDownload({ url, filename });
};
