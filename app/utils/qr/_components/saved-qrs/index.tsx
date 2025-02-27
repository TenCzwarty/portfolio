import { jsPDF } from "jspdf";
import { DownloadIcon } from "lucide-react";

import { Pill } from "~/components/pill";
import { useQRCodeGeneratorContext } from "~qr/_context";
import { convertSVGToPNG } from "~qr/_utils/convert-svg-to-png";

import {
  Accordion,
  AccordionController,
  AccordionToggleMoreInfo,
} from "../accordion";
import { SVGCard } from "./components/svg-card";

const IMAGES_PER_ROW = 4;
const IMAGES_PER_COL = 4;
const IMAGE_WIDTH = 45;
const IMAGE_HEIGHT = 45;
const MARGIN = 5;

export const SavedQRs = () => {
  const { savedQRs } = useQRCodeGeneratorContext();

  if (!savedQRs?.length) return;

  const generatePdf = async () => {
    const pdf = new jsPDF();

    for (const [i, { svgString }] of savedQRs.entries()) {
      const image = await convertSVGToPNG({ svgString });

      if (image) {
        const x = (i % IMAGES_PER_ROW) * (IMAGE_WIDTH + MARGIN) + MARGIN;
        const y =
          Math.floor(i / IMAGES_PER_ROW) * (IMAGE_HEIGHT + MARGIN) + MARGIN;

        if (i > 0 && i % (IMAGES_PER_ROW * IMAGES_PER_COL) === 0) {
          pdf.addPage();
        }

        pdf.addImage(image, "PNG", x, y, IMAGE_WIDTH, IMAGE_HEIGHT);
      }
    }

    pdf.save("qrs.pdf");
  };

  return (
    <AccordionController>
      {(accordionProps) => (
        <>
          <div className="mt-4 rounded-xl border border-neutral-200 p-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <AccordionToggleMoreInfo name="saved qrs" {...accordionProps} />
              </div>

              <div className="flex items-center gap-4">
                <button onClick={generatePdf}>
                  <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                    pdf
                    <DownloadIcon size={16} className="inline" />
                  </Pill>
                </button>
              </div>
            </div>

            <Accordion {...accordionProps}>
              <div className="mt-4 flex w-full flex-wrap items-center gap-4">
                {savedQRs.map(({ qrString, svgString }, i) => (
                  <SVGCard
                    key={qrString + " " + i}
                    svgString={svgString}
                    index={i}
                  />
                ))}
              </div>
            </Accordion>
          </div>
        </>
      )}
    </AccordionController>
  );
};
