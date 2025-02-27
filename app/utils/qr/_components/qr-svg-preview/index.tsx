"use client";

import { QRCodeSVG as QRCodeSVGReact } from "qrcode.react";

import { useQRCodeGeneratorContext } from "~qr/_context";

const BORDER = 6; // black border width
const PADDING = 10; // white padding around the qr code
const QR_CODE_SIZE = 128;
const NAME_HEIGHT = 24;

export const QRSVGPreview = () => {
  const { refSVG, qrName, qrString, isQRWithBlackBorder } =
    useQRCodeGeneratorContext();

  if (!qrName) return <QRCodeSVGReact ref={refSVG} value={qrString} />;

  const offset = PADDING + (isQRWithBlackBorder ? BORDER : 0);
  const size = QR_CODE_SIZE + offset * 2;
  const height = size + NAME_HEIGHT + (isQRWithBlackBorder ? BORDER : PADDING);

  return (
    <svg
      ref={refSVG}
      height={height}
      width={size}
      viewBox={`0 0 ${size} ${height}`}
      role="img"
    >
      <rect
        width="100%"
        height="100%"
        rx="0.75rem"
        ry="0.75rem"
        fill={isQRWithBlackBorder ? "black" : "white"}
      />

      {isQRWithBlackBorder && (
        <rect
          x={BORDER}
          y={BORDER}
          width={QR_CODE_SIZE + PADDING * 2}
          height={QR_CODE_SIZE + PADDING * 2}
          fill="white"
          rx="0.5rem"
          ry="0.5rem"
        />
      )}

      <text
        x={size / 2}
        y={QR_CODE_SIZE + offset * 2 + NAME_HEIGHT / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight={600}
        fill={isQRWithBlackBorder ? "white" : "black"}
      >
        {qrName}
      </text>

      <QRCodeSVGReact x={offset} y={offset} value={qrString} />
    </svg>
  );
};
