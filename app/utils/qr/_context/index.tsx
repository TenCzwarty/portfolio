import React from "react";

import { useLocalStorage } from "~/utils/use-local-storage";
import { useToggle } from "~/utils/use-toggle";

import { init } from "./init";
import type { TQRCodeGeneratorContext, TSavedQRs } from "./types";

import { serializeSVG } from "~qr/_utils/serialize-svg";
import { useOnChangeValue } from "~qr/_utils/use-on-change-value";

const QRCodeGeneratorContext =
  React.createContext<TQRCodeGeneratorContext>(init);

export const QRCodeGeneratorContextProvider = ({ children }: TChildren) => {
  const refSVG = React.useRef(null);

  const [storedQRs, setStoredQRs] = useLocalStorage("QRs", []);

  const [qrName, onChangeQRName] = useOnChangeValue("");
  const [qrString, setQRString] = React.useState("");
  const [isQRWithBlackBorder, toggleIsQRWithBlackBorder] = useToggle(false);
  const [savedQRs, setSavedQRs] = React.useState<TSavedQRs>([]);

  React.useEffect(() => setSavedQRs(storedQRs), []);
  React.useEffect(() => setStoredQRs(savedQRs), [savedQRs]);

  const saveCurrentQR = () => {
    const svgString = serializeSVG(refSVG);

    if (!svgString) return;

    setSavedQRs([...savedQRs, { qrString, svgString }]);
  };

  const removeQR = (index: number) =>
    setSavedQRs((prevQRs) => prevQRs.filter((_, i) => i !== index));

  const value = {
    refSVG,

    qrName,
    onChangeQRName,

    qrString,
    setQRString,

    isQRWithBlackBorder,
    toggleIsQRWithBlackBorder,

    savedQRs,
    saveCurrentQR,
    removeQR,
  };

  return (
    <QRCodeGeneratorContext.Provider value={value}>
      {children}
    </QRCodeGeneratorContext.Provider>
  );
};

export const useQRCodeGeneratorContext = () =>
  React.useContext(QRCodeGeneratorContext);
