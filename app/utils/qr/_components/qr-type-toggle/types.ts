export type QRVariantType = "website" | "network";

export type QRVariantToggleProps = {
  children: (props: { qrVariant: QRVariantType }) => React.JSX.Element;
};
