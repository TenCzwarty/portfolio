"use client";

import React from "react";

import { useConfetti } from "~/app/utils/meeple-circus/_utils/use-confetti";
import { useSpinWheelContext } from "~spin/_context";

export const SpinResult = () => {
  const { winner } = useSpinWheelContext();

  const triggerConfetti = useConfetti();

  React.useEffect(() => {
    if (!winner) {
      return;
    }

    triggerConfetti();
  }, [winner, triggerConfetti]);

  if (!winner) {
    return null;
  }

  return (
    <button
      className="rounded-xl border border-neutral-200 p-4 text-center"
      onClick={() => triggerConfetti()}
    >
      <p className="text-sm text-neutral-500">winner</p>
      <p className="text-2xl font-semibold sm:text-3xl">{winner}</p>
    </button>
  );
};
