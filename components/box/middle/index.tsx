"use client";

import React from "react";

const PAIRS = [
  ["no", "bs"],
  ["da", "bi"],
  ["da", "wo"],
  ["do", "it"],
  ["do", "nt"],
] as const;

export const BoxMiddle = () => {
  const [first, second] = React.useMemo(() => {
    const randomIndex = Math.floor(Math.random() * PAIRS.length);
    return PAIRS[randomIndex];
  }, []);

  return (
    <div className="pointer-events-none h-full select-none overflow-hidden rounded-[30%]">
      <svg viewBox="0 0 15 15" width="100%" height="100%" className="relative">
        <text
          x="50%"
          y="-5%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#fff"
        >
          {first}
        </text>
        <text
          x="50%"
          y="105%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#fff"
        >
          {second}
        </text>
      </svg>
    </div>
  );
};
