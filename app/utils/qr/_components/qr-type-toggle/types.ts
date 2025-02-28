export type TQRVariant = "website" | "network";

export type TQRVariantToggle = {
  children: (props: { qrVariant: TQRVariant }) => React.JSX.Element;
};
