export type RefSVGType = React.RefObject<SVGSVGElement | null> | null;

type SavedQRType = { qrString: string; svgString: string };
export type SavedQRsType = Array<SavedQRType>;

export type QRCodeGeneratorContextType = {
  refSVG: RefSVGType;

  qrName: string;
  onChangeQRName: (e: React.ChangeEvent<HTMLInputElement>) => void;

  qrString: string;
  setQRString: React.Dispatch<React.SetStateAction<string>>;

  savedQRs: SavedQRsType;
  saveCurrentQR: () => void;
  removeQR: (index: number) => void;

  isQRWithBlackBorder: boolean;
  toggleIsQRWithBlackBorder: () => void;
};
