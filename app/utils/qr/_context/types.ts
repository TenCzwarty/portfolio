export type TRefSVG = React.RefObject<SVGSVGElement | null> | null;

type TSavedQR = { qrString: string; svgString: string };
export type TSavedQRs = Array<TSavedQR>;

export type TQRCodeGeneratorContext = {
  refSVG: TRefSVG;

  qrName: string;
  onChangeQRName: (e: React.ChangeEvent<HTMLInputElement>) => void;

  qrString: string;
  setQRString: React.Dispatch<React.SetStateAction<string>>;

  savedQRs: TSavedQRs;
  saveCurrentQR: () => void;
  removeQR: (index: number) => void;

  isQRWithBlackBorder: boolean;
  toggleIsQRWithBlackBorder: () => void;
};
