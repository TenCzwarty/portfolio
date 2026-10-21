"use client";

import React from "react";
import { CheckIcon, MinusIcon, PlusIcon } from "lucide-react";

import { Pill } from "~/components/pill";

import type { TCardZoomProps } from "./types";

import { FinishIcon } from "~sumo/_components/finish-icon";
import { FoilCard } from "~sumo/_components/foil-card";
import { FINISH_EFFECTS } from "~sumo/_const";
import { ownedKey, useSumoContext } from "~sumo/_context";

/**
 * Enlarged card in a native <dialog>: Esc, focus trapping and the top layer
 * come for free. Closes on Esc, the close button or a click on the backdrop.
 * Starts on the card's own finish; the variant icons switch the preview and
 * the pill adds the previewed variant to the collection.
 * Mount it only while zoomed: it opens on mount.
 */
export const CardZoom = (props: TCardZoomProps) => {
  const { onClose, src, alt, number, name, kanji, details, cardId, finishes } = props;
  const ref = React.useRef<HTMLDialogElement>(null);
  const { isShowingFinishPreviews, isOwned, toggleOwned } = useSumoContext();
  const [effect, setEffect] = React.useState(finishes[0]?.effect ?? "sleeve");

  React.useEffect(() => {
    // Strict mode runs this twice; showModal throws on some browsers if already open
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, []);

  const catalogued = new Set(finishes.map((finish) => finish.effect ?? "sleeve"));
  const options = isShowingFinishPreviews
    ? FINISH_EFFECTS
    : FINISH_EFFECTS.filter((option) => catalogued.has(option.effect));
  // Dots only make sense when previews are mixed in with printed finishes
  const isMarkingPrinted = isShowingFinishPreviews && catalogued.size > 1;
  const printedNames = finishes.map((finish) => finish.name).join(", ");

  // Only a printed finish can be collected; a preview-only one can't
  const selectedFinish = finishes.find((finish) => (finish.effect ?? "sleeve") === effect);
  const selectedKey = selectedFinish ? ownedKey(cardId, selectedFinish.id) : null;
  const isSelectedOwned = selectedKey ? isOwned(selectedKey) : false;

  const collectLabel = selectedFinish
    ? `${isSelectedOwned ? "Remove" : "Add"} ${selectedFinish.name} ${isSelectedOwned ? "from" : "to"} my collection`
    : "Not printed, can't be collected";
  const toggleSelected = () => {
    if (selectedKey) toggleOwned(selectedKey);
  };

  const renderVariants = (direction: "row" | "column") =>
    options.length > 1 && (
      <div
        className={`flex flex-col gap-2 ${direction === "column" ? "items-start" : "items-center"}`}
      >
        <h4 className="text-sm text-neutral-400">variants</h4>
        <div
          role="group"
          aria-label="Variants"
          className={`flex gap-2 ${direction === "column" ? "flex-col" : "flex-wrap justify-center"}`}
        >
          {options.map((option) => {
            const isPrinted = catalogued.has(option.effect);
            const isSelected = effect === option.effect;

            return (
              <div key={option.effect} className="relative">
                <button
                  type="button"
                  title={option.label}
                  aria-label={`${option.label}${isMarkingPrinted && isPrinted ? " (printed for this card)" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => setEffect(option.effect)}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${
                    isSelected ? "bg-white text-neutral-900" : "text-white hover:bg-white/10"
                  }`}
                >
                  <FinishIcon effect={option.effect} size={28} />
                  {isMarkingPrinted && isPrinted && (
                    <span
                      aria-hidden
                      className="bg-accent-500 absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
                    />
                  )}
                </button>

                {/* Same as the collection pill, right at the selected variant */}
                {isSelected && selectedKey && (
                  <button
                    type="button"
                    title={collectLabel}
                    aria-label={collectLabel}
                    onClick={toggleSelected}
                    className={`absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-neutral-900 ${
                      isSelectedOwned
                        ? "bg-accent-500 text-primary-900 hover:bg-primary-900 hover:text-white"
                        : "bg-primary-900 hover:bg-accent-500 hover:text-primary-900 text-white"
                    }`}
                  >
                    {isSelectedOwned ? (
                      <MinusIcon size={14} aria-hidden />
                    ) : (
                      <PlusIcon size={14} aria-hidden />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );

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
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* Card column: caption and pills stay centered under the card */}
        <div className="flex flex-col items-center gap-4">
          <FoilCard maxTilt={8} effect={effect} className="rounded-2xl">
            {src ? (
              <>
                {/* Local scans, already small: next/image would only re-encode them */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="block h-[min(75dvh,525px)] w-auto max-w-[calc(100vw-2rem)] object-contain"
                />
              </>
            ) : (
              <div className="flex aspect-[5/7] h-[min(75dvh,525px)] max-w-[calc(100vw-2rem)] flex-col items-center justify-center bg-neutral-100 text-neutral-400">
                <span className="text-6xl font-bold">#{number}</span>
                <span className="mt-2 text-xl">{name}</span>
              </div>
            )}
          </FoilCard>

          {/* Narrow screens: variants as a row right under the card */}
          <div className="sm:hidden">{renderVariants("row")}</div>

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
            <p className="mx-auto mt-1 max-w-xs text-xs text-neutral-400">
              {catalogued.size === 1
                ? isShowingFinishPreviews
                  ? "Printed in the standard version only; the other variants are previews."
                  : "Printed in the standard version only."
                : isShowingFinishPreviews
                  ? `Printed as ${printedNames} (•); the rest are previews.`
                  : `Printed as ${printedNames}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className="group"
              disabled={!selectedKey}
              onClick={toggleSelected}
              aria-label={collectLabel}
            >
              <Pill
                classes={
                  !selectedKey
                    ? "bg-neutral-500 group-disabled:cursor-not-allowed"
                    : isSelectedOwned
                      ? "bg-accent-500 text-primary-900 hover:bg-primary-900 hover:text-white"
                      : "bg-primary-900 hover:bg-accent-500 hover:text-primary-900"
                }
              >
                {!selectedKey ? (
                  "not printed"
                ) : isSelectedOwned ? (
                  <>
                    <CheckIcon size={16} aria-hidden /> in my collection
                  </>
                ) : (
                  <>
                    <PlusIcon size={16} aria-hidden /> add to my collection
                  </>
                )}
              </Pill>
            </button>

            <button type="button" className="group" onClick={onClose}>
              <Pill classes="bg-transparent border border-white/30 hover:bg-white/10">close</Pill>
            </button>
          </div>
        </div>

        {/* Wider screens: variants in a column to the right of the card */}
        <div className="hidden sm:block">{renderVariants("column")}</div>
      </div>
    </dialog>
  );
};
