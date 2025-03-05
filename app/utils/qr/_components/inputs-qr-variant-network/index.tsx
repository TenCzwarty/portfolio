"use client";

import React from "react";

import { useToggle } from "~/utils/use-toggle";
import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/app/_components/accordion";
import { useQRCodeGeneratorContext } from "~qr/_context";
import { useOnChangeValue } from "~qr/_utils/use-on-change-value";
import { createQRString } from "./helpers/create-qr-string";

export const InputsQrVariantNetwork = () => {
  const { setQRString } = useQRCodeGeneratorContext();

  const [name, onChangeName] = useOnChangeValue();
  const [password, onChangePassword] = useOnChangeValue();
  const [encryption, onChangeEncryption] = useOnChangeValue("WPA");
  const [isSsidHidden, toggleIsSsidHidden] = useToggle(false);

  React.useEffect(() => {
    setQRString(createQRString({ name, password, encryption, isSsidHidden }));
  }, [name, password, encryption, isSsidHidden]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="wifi name (SSID)"
        value={name}
        onChange={onChangeName}
        className="w-full rounded-md bg-white p-4"
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
                className="w-full rounded-md bg-white p-4"
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
                <label className="flex items-center select-none hover:cursor-pointer">
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
