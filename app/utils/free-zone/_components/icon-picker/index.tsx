import React from "react";

import { STAMP_ICON_NAMES, type TStampIconName } from "../../_utils/stamps";
import { STAMP_ICONS, StampIcon } from "../stamp-icon";

type TIconPicker = {
  value: string | null;
  onChange: (icon: TStampIconName | null) => void;
  label: string;
};

export const IconPicker = ({ value, onChange, label }: TIconPicker) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const q = query.trim().toLocaleLowerCase("pl");
  const matches = STAMP_ICON_NAMES.filter(
    (name) => !q || name.includes(q) || STAMP_ICONS[name].keywords.includes(q)
  );

  const pick = (icon: TStampIconName | null) => {
    onChange(icon);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-8 min-w-8 items-center justify-center rounded-full border border-neutral-200 px-2 text-sm hover:bg-neutral-200"
      >
        {value ? <StampIcon name={value} className="size-4" /> : "icon"}
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-30 mt-1 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search: plane, góry, party…"
            aria-label="search icons"
            className="mb-2 w-full rounded-md border border-neutral-200 p-1.5 text-sm focus:outline-2"
          />
          <div className="grid grid-cols-7 gap-1">
            {matches.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                aria-label={name}
                aria-pressed={value === name}
                onClick={() => pick(name)}
                className={`flex aspect-square items-center justify-center rounded-md hover:bg-neutral-200 ${value === name ? "bg-primary-900 hover:bg-primary-900 text-white" : ""}`}
              >
                <StampIcon name={name} className="size-4" />
              </button>
            ))}
          </div>
          {!matches.length && <p className="p-1 text-sm opacity-60">nothing found</p>}
          {value && (
            <button
              type="button"
              onClick={() => pick(null)}
              className="mt-2 w-full rounded-md p-1 text-sm hover:bg-neutral-200"
            >
              no icon
            </button>
          )}
        </div>
      )}
    </div>
  );
};
