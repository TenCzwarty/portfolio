import React from "react";

import type { TPerson, TStamp } from "../../_types";
import { placeStamps, serializeStamp, stampName, stampText } from "../../_utils/stamps";
import { StampIcon } from "../stamp-icon";

export type TStampItem = { stamp: TStamp; person: TPerson; icon?: string };

type TStampLayer = {
  items: Array<TStampItem>;
  style: React.CSSProperties;
};

/**
 * Stamps of one day cell. New stamps get pressed in, removed ones peel off - but only for
 * changes after the cell appeared, so opening the page or switching months stays calm.
 */
export const StampLayer = ({ items, style }: TStampLayer) => {
  const isMountedRef = React.useRef(false);
  const previousRef = React.useRef(items);
  const enteringRef = React.useRef(new Set<string>());
  const [leaving, setLeaving] = React.useState<Array<TStampItem>>([]);

  const previousKeys = new Set(previousRef.current.map((i) => serializeStamp(i.stamp)));
  const currentKeys = new Set(items.map((i) => serializeStamp(i.stamp)));

  if (isMountedRef.current) {
    for (const key of currentKeys) if (!previousKeys.has(key)) enteringRef.current.add(key);
  }

  // layout effect: the peeling copy is in place before the browser paints the removal
  React.useLayoutEffect(() => {
    if (isMountedRef.current) {
      const gone = previousRef.current.filter((i) => !currentKeys.has(serializeStamp(i.stamp)));
      if (gone.length) setLeaving((l) => [...l, ...gone]);
    }
    isMountedRef.current = true;
    previousRef.current = items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const shown = [
    ...items.map((item) => ({ item, phase: "stay" as const })),
    ...leaving
      .filter((i) => !currentKeys.has(serializeStamp(i.stamp)))
      .map((item) => ({ item, phase: "leave" as const })),
  ];

  if (!shown.length) return null;

  // leaving stamps keep their slot while they peel off
  const placements = placeStamps(shown.map(({ item }) => item.stamp));

  return (
    <div className="pointer-events-none relative overflow-hidden" style={style}>
      {shown.map(({ item: { stamp, person, icon }, phase }) => {
        const key = serializeStamp(stamp);
        const { x, y, rotation } = placements.get(key)!;
        const animation =
          phase === "leave" ? "stamp-leave" : enteringRef.current.has(key) ? "stamp-enter" : "";

        return (
          <span
            key={`${key}|${phase}`}
            title={`${person.name}: ${stampName(stamp.label)}`}
            onAnimationEnd={() => {
              if (phase === "leave")
                setLeaving((l) => l.filter((i) => serializeStamp(i.stamp) !== key));
              else enteringRef.current.delete(key);
            }}
            className={`stamp ${animation} absolute flex max-w-[90%] items-center gap-0.5 rounded border bg-white/50 px-0.5 text-[0.5rem] leading-2.5 font-bold tracking-wide whitespace-nowrap sm:gap-1 sm:rounded-md sm:border-2 sm:px-1.5 sm:text-xs sm:leading-4 sm:tracking-wider`}
            style={
              {
                left: `${x}%`,
                top: `${y}%`,
                color: person.color,
                borderColor: person.color,
                "--rotation": `${rotation}deg`,
              } as React.CSSProperties
            }
          >
            <StampIcon name={icon} className="size-2 shrink-0 sm:size-3" />
            {stampText(stamp.label) && <span className="truncate">{stamp.label}</span>}
          </span>
        );
      })}
    </div>
  );
};
