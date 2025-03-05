"use client";

import React from "react";

import { useQRCodeGeneratorContext } from "~qr/_context";
import { useOnChangeValue } from "~qr/_utils/use-on-change-value";

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
      className="w-full rounded-md bg-white p-4"
    />
  );
};
