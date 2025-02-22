"use client";

import React from "react";
import { Settings } from "lucide-react";

import { Input } from "../input";
import type { QrNetworkProps } from "./types";

const onChange =
  (setStateValue: (stateValue: string) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) =>
    setStateValue(e.target.value);

export const QrNetwork = ({ setValue }: QrNetworkProps) => {
  const [isSettingsOpened, setIsSettingsOpened] = React.useState(false);

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [encryption, setEncryption] = React.useState("WPA");
  const [isHidden, setIsHidden] = React.useState(false);

  React.useEffect(() => {
    setValue(
      `WIFI:S:${name};T:${encryption};P:${password};H:${isHidden ? "true" : ""};;`,
    );
  }, [name, password, encryption, isHidden]);

  const onChangeName = onChange(setName);
  const onChangeisHidden = onChange(() => setIsHidden(!isHidden));
  const onChangePassword = onChange(setPassword);
  const onChangeEncryption = onChange(setEncryption);

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="wifi name (SSID)"
        value={name}
        onChange={onChangeName}
      />
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="password"
          value={password}
          onChange={onChangePassword}
        />
        <button
          onClick={() => setIsSettingsOpened(!isSettingsOpened)}
          aria-expanded={isSettingsOpened}
          className="spin px-4"
        >
          <Settings />
        </button>
      </div>

      <div className={`space-y-4 ${isSettingsOpened ? "" : "hidden"}`}>
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
        <div className="space-y-2 rounded-md border border-neutral-200 p-4">
          <label className="flex select-none items-center hover:cursor-pointer">
            <Input
              type="checkbox"
              checked={isHidden}
              onChange={onChangeisHidden}
              classes="w-auto mr-2"
            />
            hidden SSID
          </label>
        </div>
      </div>
    </div>
  );
};
