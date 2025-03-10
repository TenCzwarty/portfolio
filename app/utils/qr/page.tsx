"use client";

import { SaveIcon } from "lucide-react";

import { Pill } from "~/components/pill";
import { Section } from "~/components/section";

import { ButtonsDownloadQR } from "~qr/_components/buttons-download-qr";
import { InputsQrVariantNetwork } from "~qr/_components/inputs-qr-variant-network";
import { InputsQRVariantWebsite } from "~qr/_components/inputs-qr-variant-website";
import { QRSVGPreview } from "~qr/_components/qr-svg-preview";
import { QRVariantToggle } from "~qr/_components/qr-type-toggle";
import { SavedQRs } from "~qr/_components/saved-qrs";
import { useQRCodeGeneratorContext } from "~qr/_context";

export default function UtilsQRCodeGeneratorPage() {
  const context = useQRCodeGeneratorContext();

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mt-16 mb-8 ml-4">
          <h1 className="text-xl font-semibold sm:text-3xl">
            QR Code Generator
          </h1>
          <p>quickly create qr codes, no bs</p>
        </div>

        <div className="flex gap-4">
          <div className="w-full space-y-4">
            <QRVariantToggle>
              {({ qrVariant }) => (
                <>
                  <div className={qrVariant === "website" ? "" : "hidden"}>
                    <InputsQRVariantWebsite />
                  </div>

                  <div className={qrVariant === "network" ? "" : "hidden"}>
                    <InputsQrVariantNetwork />
                  </div>
                </>
              )}
            </QRVariantToggle>

            <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-4">
              <input
                type="text"
                placeholder="name"
                className="w-full rounded-md bg-white p-4"
                onChange={context.onChangeQRName}
              />

              {context.qrName && (
                <div className="space-y-2 rounded-md border border-neutral-200 p-4">
                  <label className="flex cursor-pointer items-center select-none">
                    <input
                      type="checkbox"
                      checked={context.isQRWithBlackBorder}
                      onChange={context.toggleIsQRWithBlackBorder}
                      className="mr-2 cursor-pointer"
                    />
                    with black border
                  </label>
                </div>
              )}

              {context.qrName && (
                <button onClick={context.saveCurrentQR}>
                  <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                    save <SaveIcon size={16} className="inline" />
                  </Pill>
                </button>
              )}
            </div>

            <SavedQRs />
          </div>

          <div className="space-y-4">
            <div className="h-min rounded-xl border border-neutral-200 p-4">
              <QRSVGPreview />
            </div>

            <ButtonsDownloadQR />
          </div>
        </div>
      </Section>
    </main>
  );
}
