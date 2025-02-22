"use client";

import React from "react";
import { Download } from "lucide-react";

import { Section } from "@/components/layout/components/section";
import { Pill } from "@/components/pill";
import { QrWebsite } from "./_components/qr-website";
import { QrNetwork } from "./_components/qr-network";
import { Input } from "./_components/input";
import { QrCodeSVG } from "./_components/qr-code-svg";
import { useSVGDownload } from "./_helpers/useSVGDownload";

export default function QR() {
  const [type, setType] = React.useState("website");
  const [name, setName] = React.useState("");
  const [value, setValue] = React.useState("");

  const { ref, downloadAsSVG, donwloadAsPNG } = useSVGDownload({ name });

  const setTypeWebsite = () => setType("website");
  const setTypeNetwork = () => setType("network");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mb-8 ml-4 mt-16">
          <h1 className="text-xl font-semibold sm:text-3xl">
            QR Code Generator
          </h1>
          <p>quickly create qr codes, no bs</p>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4 rounded-xl border border-neutral-200 p-4">
            <button
              onClick={setTypeWebsite}
              disabled={type === "website"}
              className="group disabled:cursor-not-allowed"
            >
              <Pill classes="group-disabled:bg-neutral-200 group-disabled:text-primary-900 bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                website
              </Pill>
            </button>
            <button
              onClick={setTypeNetwork}
              disabled={type === "network"}
              className="group disabled:cursor-not-allowed"
            >
              <Pill classes="group-disabled:bg-neutral-200 group-disabled:text-primary-900 bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                network
              </Pill>
            </button>
          </div>

          <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
            <div className={`${type === "website" ? "" : "hidden"}`}>
              <QrWebsite setValue={setValue} />
            </div>
            <div className={`${type === "network" ? "" : "hidden"}`}>
              <QrNetwork setValue={setValue} />
            </div>
          </div>

          <div className="flex justify-center space-y-4 rounded-xl border border-neutral-200 p-4">
            <QrCodeSVG ref={ref} value={value} name={name} />
          </div>

          <div className="flex flex-col space-y-4 rounded-xl border border-neutral-200 p-4">
            <Input type="text" placeholder="name" onChange={onChange} />
            <div className="space-x-4">
              <button onClick={downloadAsSVG}>
                <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                  download svg <Download size={16} className="inline" />
                </Pill>
              </button>
              <button onClick={donwloadAsPNG}>
                <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                  download png <Download size={16} className="inline" />
                </Pill>
              </button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
