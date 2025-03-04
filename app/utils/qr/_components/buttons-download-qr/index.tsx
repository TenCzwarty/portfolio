import { DownloadIcon } from "lucide-react";

import { Pill } from "~/components/pill";
import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/app/_components/accordion";
import { useQRCodeGeneratorContext } from "~qr/_context";

import { downloadSVGAsPNGFile } from "./helpers/download-svg-as-png-file";
import { downloadSVGAsSVGFile } from "./helpers/download-svg-as-svg-file";

export const ButtonsDownloadQR = () => {
  const { refSVG: ref, qrName: name } = useQRCodeGeneratorContext();

  const downloadAsSVG = () => downloadSVGAsSVGFile({ ref, name });
  const donwloadAsPNG = () => downloadSVGAsPNGFile({ ref, name });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4">
      <AccordionController>
        {(accordionProps) => (
          <>
            <div className="flex justify-between gap-4">
              <button onClick={donwloadAsPNG}>
                <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                  png <DownloadIcon size={16} className="inline" />
                </Pill>
              </button>

              <AccordionExtraSettingsToggle {...accordionProps} />
            </div>

            <Accordion {...accordionProps}>
              <button onClick={downloadAsSVG}>
                <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                  svg <DownloadIcon size={16} className="inline" />
                </Pill>
              </button>
            </Accordion>
          </>
        )}
      </AccordionController>
    </div>
  );
};
