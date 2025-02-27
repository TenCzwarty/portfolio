"use client";

import React from "react";

import { useOnChangeValue } from "@/app/utils/qr/_utils/use-on-change-value";
import { useQRCodeGeneratorContext } from "@/app/utils/qr/_context";

export const InputsQRVariantWebsite = () => {
  const { setQRString } = useQRCodeGeneratorContext();

  const [url, onChangeUrl] = useOnChangeValue();

  React.useEffect(() => {
    setQRString(url);
  }, [url]);

  return (
    <input
      type="text"
      placeholder="url"
      value={url}
      onChange={onChangeUrl}
      className="w-full rounded-md p-4"
    />
  );
};
