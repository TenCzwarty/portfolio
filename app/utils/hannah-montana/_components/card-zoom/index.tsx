"use client";

import React from "react";
import { CheckIcon, MinusIcon, PlusIcon } from "lucide-react";

import { Pill } from "~/components/pill";

import type { THannahCardZoomProps } from "./types";

import { useHannahContext } from "~hannah-montana/_context";
import { FinishIcon } from "~sumo/_components/finish-icon";
import { FoilCard } from "~sumo/_components/foil-card";
import { ownedKey } from "~sumo/_context";

/**
 * The sumo zoom, pared down: a native <dialog> with the tilting card, its
 * variants (Base / Sparkle) to the right and a pill to collect the selected
 * one. Mount it only while zoomed: it opens on mount.
 */
export const HannahCardZoom = ({ card, src, onClose }: THannahCardZoomProps) => {
  const ref = React.useRef<HTMLDialogElement>(null);
  const { isOwned, toggleOwned } = useHannahContext();
  const [finishId, setFinishId] = React.useState(card.finishes[0].id);

  React.useEffect(() => {
    // Strict mode runs this twice; showModal throws on some browsers if already open
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, []);

  const selected = card.finishes.find((finish) => finish.id === finishId) ?? card.finishes[0];
  const selectedKey = ownedKey(card.id, selected.id);
  const isSelectedOwned = isOwned(selectedKey);
  const collectLabel = `${isSelectedOwned ? "Remove" : "Add"} ${selected.name} ${isSelectedOwned ? "from" : "to"} my collection`;

  const renderVariants = (direction: "row" | "column") => (
    <div
      className={`flex flex-col gap-2 ${direction === "column" ? "items-start" : "items-center"}`}
    >
      <h4 className="text-sm text-neutral-400">variants</h4>
      <div
        role="group"
        aria-label="Variants"
        className={`flex gap-2 ${direction === "column" ? "flex-col" : "flex-wrap justify-center"}`}
      >
        {card.finishes.map((finish) => {
          const isSelected = finish.id === selected.id;

          return (
            <div key={finish.id} className="relative">
              <button
                type="button"
                title={finish.name}
                aria-label={finish.name}
                aria-pressed={isSelected}
                onClick={() => setFinishId(finish.id)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isSelected ? "bg-white text-neutral-900" : "text-white hover:bg-white/10"
                }`}
              >
                <FinishIcon effect={finish.effect ?? "sleeve"} size={28} />
              </button>

              {isSelected && (
                <button
                  type="button"
                  title={collectLabel}
                  aria-label={collectLabel}
                  onClick={() => toggleOwned(selectedKey)}
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
      aria-label={`Hannah Montana card #${card.number}`}
      onClose={onClose}
      // The dialog box itself is only the padding around the card, so a click
      // that lands on it (not on its content) is a click on the backdrop
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-4">
          <FoilCard maxTilt={8} effect={selected.effect} className="rounded-2xl">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`Hannah Montana card #${card.number}`}
                className="block h-[min(75dvh,525px)] w-auto max-w-[calc(100vw-2rem)] object-contain"
              />
            ) : (
              <div className="flex aspect-[5/7] h-[min(75dvh,525px)] max-w-[calc(100vw-2rem)] flex-col items-center justify-center bg-neutral-100 text-neutral-400">
                <span className="text-6xl font-bold">#{card.number}</span>
                <span className="mt-2 text-xl">Hannah Montana</span>
              </div>
            )}
          </FoilCard>

          <div className="sm:hidden">{renderVariants("row")}</div>

          <div className="font-semibold text-white">Hannah Montana #{card.number}</div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className="group"
              onClick={() => toggleOwned(selectedKey)}
              aria-label={collectLabel}
            >
              <Pill
                classes={
                  isSelectedOwned
                    ? "bg-accent-500 text-primary-900 hover:bg-primary-900 hover:text-white"
                    : "bg-primary-900 hover:bg-accent-500 hover:text-primary-900"
                }
              >
                {isSelectedOwned ? (
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

        <div className="hidden sm:block">{renderVariants("column")}</div>
      </div>
    </dialog>
  );
};
