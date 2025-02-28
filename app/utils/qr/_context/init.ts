import type { TQRCodeGeneratorContext } from "./types";

export const init = {
  refSVG: null,

  qrName: "",
  onChangeQRName: () => {},

  qrString: "",
  setQRString: () => {},

  savedQRs: [],
  saveCurrentQR: () => {},
  removeQR: () => {},

  isQRWithBlackBorder: false,
  toggleIsQRWithBlackBorder: () => {},
} satisfies TQRCodeGeneratorContext;
