"use client";

import React from "react";

import type { TCardZoomProps } from "./types";

import { FoilCard } from "~sumo/_components/foil-card";

/**
 * Enlarged card in a native <dialog>: Esc, focus trapping and the top layer
 * come for free. Closes on Esc, the close button or a click on the backdrop.
 */
export const CardZoom = (props: TCardZoomProps) => {
  const { open, onClose, src, alt, number, name, kanji, details } = props;
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sumo-zoom m-auto overflow-visible bg-transparent p-4 backdrop:bg-transparent"
      aria-label={`#${number} ${name}`}
      onClose={onClose}
      // The dialog box itself is only the padding around the card, so a click
      // that lands on it (not on its content) is a click on the backdrop
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex flex-col items-center gap-4">
        <FoilCard maxTilt={8} className="rounded-2xl">
          {/* Local scans, already small: next/image would only re-encode them */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="block h-[min(75dvh,525px)] w-auto max-w-[calc(100vw-2rem)] object-contain"
          />
        </FoilCard>

        <div className="text-center text-white">
          <div className="font-semibold">
            #{number} {name}
            {kanji && <span className="ml-2 font-normal text-neutral-300">{kanji}</span>}
          </div>
          {details.map((line) => (
            <div key={line} className="text-sm text-neutral-300">
              {line}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/30 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          close
        </button>
      </div>
    </dialog>
  );
};
