"use client";

import React from "react";
import { QRCodeSVG as QRCodeSVGReact } from "qrcode.react";
import type { QrCodeSVGProps } from "./types";

const MARGIN = 10;
const QR_CODE_SIZE = 128;
const NAME_HEIGHT = 24;

export const QrCodeSVG = ({ ref, name, value }: QrCodeSVGProps) => {
  if (!name) return <QRCodeSVGReact ref={ref} value={value} />;

  const size = QR_CODE_SIZE + MARGIN * 2;
  const height = size + NAME_HEIGHT + MARGIN;

  return (
    <svg
      ref={ref}
      height={height}
      width={size}
      viewBox={`0 0 ${size} ${height}`}
      role="img"
    >
      <rect width="100%" height="100%" fill="white" rx="10" ry="10" />
      <text
        x={size / 2}
        y={size + NAME_HEIGHT / 2}
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight={600}
      >
        {name}
      </text>
      <QRCodeSVGReact x={MARGIN} y={MARGIN} value={value} />
    </svg>
  );
};
