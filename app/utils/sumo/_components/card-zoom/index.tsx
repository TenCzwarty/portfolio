"use client";

import React from "react";

import type { TCardZoomProps } from "./types";

import { FoilCard } from "~sumo/_components/foil-card";
import { FINISH_EFFECTS } from "~sumo/_const";

/**
 * Enlarged card in a native <dialog>: Esc, focus trapping and the top layer
 * come for free. Closes on Esc, the close button or a click on the backdrop.
 * Starts on the card's own finish; the buttons preview it in any finish.
 * Mount it only while zoomed: it opens on mount.
 */
export const CardZoom = (props: TCardZoomProps) => {
  const { onClose, src, alt, number, name, kanji, details, finishes } = props;
  const ref = React.useRef<HTMLDialogElement>(null);
  const [effect, setEffect] = React.useState(finishes[0]?.effect ?? "sleeve");

  React.useEffect(() => {
    // Strict mode runs this twice; showModal throws on some browsers if already open
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, []);

  const catalogued = new Set(finishes.map((finish) => finish.effect ?? "sleeve"));

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
        <FoilCard maxTilt={8} effect={effect} className="rounded-2xl">
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

        <div className="flex flex-col items-center gap-2">
          <div
            role="group"
            aria-label="Preview finish"
            className="flex flex-wrap justify-center gap-1"
          >
            {FINISH_EFFECTS.map((option) => (
              <button
                key={option.effect}
                type="button"
                aria-pressed={effect === option.effect}
                onClick={() => setEffect(option.effect)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  effect === option.effect
                    ? "bg-white text-neutral-900"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {option.label}
                {catalogued.size > 1 && catalogued.has(option.effect) && (
                  <>
                    <span aria-hidden className="ml-1">
                      •
                    </span>
                    <span className="sr-only"> (printed for this card)</span>
                  </>
                )}
              </button>
            ))}
          </div>
          <p className="max-w-xs text-center text-xs text-neutral-400">
            {catalogued.size > 1
              ? "• printed for this card, the rest are previews."
              : "Preview only: which versions this card was printed in isn't catalogued yet."}
          </p>
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
