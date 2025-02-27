import React from "react";

import { Pill } from "@/components/pill";

import type { QRVariantToggleProps, QRVariantType } from "./types";

export const QRVariantToggle = ({ children }: QRVariantToggleProps) => {
  const [qrVariant, setQRVariant] = React.useState<QRVariantType>("website");

  const setQRVariantWebsite = () => setQRVariant("website");
  const setQRVariantNetwork = () => setQRVariant("network");

  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="mb-4 flex space-x-4">
        <button
          onClick={setQRVariantWebsite}
          disabled={qrVariant === "website"}
          className="group disabled:cursor-not-allowed"
        >
          <Pill classes="group-disabled:bg-neutral-200 group-disabled:text-primary-900 bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
            website
          </Pill>
        </button>

        <button
          onClick={setQRVariantNetwork}
          disabled={qrVariant === "network"}
          className="group disabled:cursor-not-allowed"
        >
          <Pill classes="group-disabled:bg-neutral-200 group-disabled:text-primary-900 bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
            network
          </Pill>
        </button>
      </div>

      {children({ qrVariant })}
    </div>
  );
};
