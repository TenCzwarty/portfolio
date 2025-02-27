"use client";

import React from "react";
import { SaveIcon } from "lucide-react";

import { Section } from "@/components/layout/components/section";
import { Pill } from "@/components/pill";

import { QRVariantToggle } from "./_components/qr-type-toggle";
import { InputsQRVariantWebsite } from "./_components/inputs-qr-variant-website";
import { InputsQrVariantNetwork } from "./_components/inputs-qr-variant-network";
import { SavedQRs } from "./_components/saved-qrs";
import { ButtonsDownloadQR } from "./_components/buttons-download-qr";
import { QRSVGPreview } from "./_components/qr-svg-preview";

import { useQRCodeGeneratorContext } from "./_context";

export default function UtilsQRCodeGeneratorPage() {
  const context = useQRCodeGeneratorContext();

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mb-8 ml-4 mt-16">
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
                className="w-full rounded-md p-4"
                onChange={context.onChangeQRName}
              />

              {context.qrName && (
                <div className="space-y-2 rounded-md border border-neutral-200 p-4">
                  <label className="flex select-none items-center hover:cursor-pointer">
                    <input
                      type="checkbox"
                      checked={context.isQRWithBlackBorder}
                      onChange={context.toggleIsQRWithBlackBorder}
                      className="mr-2"
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
