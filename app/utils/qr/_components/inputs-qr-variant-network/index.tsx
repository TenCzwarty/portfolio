"use client";

import React from "react";

import { useToggle } from "@/utils/use-toggle";

import {
  AccordionController,
  Accordion,
  AccordionExtraSettingsToggle,
} from "@/app/utils/qr/_components/accordion";
import { useOnChangeValue } from "@/app/utils/qr/_utils/use-on-change-value";
import { useQRCodeGeneratorContext } from "@/app/utils/qr/_context";

import { CreateQrStringProps } from "./types";

const createQrString = ({
  name,
  password,
  encryption,
  isSsidHidden,
}: CreateQrStringProps) =>
  `WIFI:S:${name};T:${encryption};P:${password};H:${isSsidHidden ? "true" : ""};;`;

export const InputsQrVariantNetwork = () => {
  const { setQRString } = useQRCodeGeneratorContext();

  const [name, onChangeName] = useOnChangeValue();
  const [password, onChangePassword] = useOnChangeValue();
  const [encryption, onChangeEncryption] = useOnChangeValue("WPA");
  const [isSsidHidden, toggleIsSsidHidden] = useToggle(false);

  React.useEffect(() => {
    setQRString(createQrString({ name, password, encryption, isSsidHidden }));
  }, [name, password, encryption, isSsidHidden]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="wifi name (SSID)"
        value={name}
        onChange={onChangeName}
        className="w-full rounded-md p-4"
      />

      <AccordionController>
        {(accordionProps) => (
          <>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="password"
                value={password}
                onChange={onChangePassword}
                className="w-full rounded-md p-4"
              />
              <div className="flex items-center px-4">
                <AccordionExtraSettingsToggle {...accordionProps} />
              </div>
            </div>

            <Accordion {...accordionProps}>
              <div className="space-y-2 rounded-md border border-neutral-200 p-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="encryption"
                    value="WPA"
                    checked={encryption === "WPA"}
                    onChange={onChangeEncryption}
                    className="mr-2"
                  />
                  WPA/WPA2
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="encryption"
                    value="WEP"
                    checked={encryption === "WEP"}
                    onChange={onChangeEncryption}
                    className="mr-2"
                  />
                  WEP
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="encryption"
                    value="nopass"
                    checked={encryption === "nopass"}
                    onChange={onChangeEncryption}
                    className="mr-2"
                  />
                  open network
                </label>
              </div>

              <div className="mt-4 space-y-2 rounded-md border border-neutral-200 p-4">
                <label className="flex select-none items-center hover:cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSsidHidden}
                    onChange={toggleIsSsidHidden}
                    className="mr-2"
                  />
                  hidden SSID
                </label>
              </div>
            </Accordion>
          </>
        )}
      </AccordionController>
    </div>
  );
};
