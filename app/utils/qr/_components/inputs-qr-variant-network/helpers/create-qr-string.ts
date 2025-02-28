export type TParameters = {
  name: string;
  password: string;
  encryption: string;
  isSsidHidden: boolean;
};

export const createQRString = ({
  name,
  password,
  encryption,
  isSsidHidden,
}: TParameters) =>
  `WIFI:S:${name};T:${encryption};P:${password};H:${isSsidHidden ? "true" : ""};;`;
