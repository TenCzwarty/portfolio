import React from "react";

import { loadAllIcons } from "../../_utils/all-icons";
import {
  isStampLabel,
  LUCIDE_PREFIX,
  normalizeStamp,
  STAMP_ICON_NAMES,
  STAMP_MAX_LENGTH,
} from "../../_utils/stamps";
import { CURATED_LUCIDE_NAMES, STAMP_ICONS, StampIcon } from "../stamp-icon";

// enough to browse, few enough that each result's icon file can load without a stampede
const MAX_EXTRA_RESULTS = 60;

type TStampEditor = {
  /** undefined = creating a new stamp */
  label?: string;
  icon: string | null;
  canDelete: boolean;
  onSave: (label: string, icon: string | null) => void;
  onDelete: () => void;
  onCancel: () => void;
};

/** Everything about one stamp in one box: name (when new), icon, save / delete */
export const StampEditor = ({
  label,
  icon,
  canDelete,
  onSave,
  onDelete,
  onCancel,
}: TStampEditor) => {
  const isNew = label === undefined;
  const [name, setName] = React.useState("");
  const [picked, setPicked] = React.useState<string | null>(icon);
  // names of every Lucide icon, fetched on the first search
  const [allNames, setAllNames] = React.useState<Array<string> | null>(null);
  const [query, setQuery] = React.useState("");

  const finalLabel = isNew ? normalizeStamp(name) : label;
  const isValid = isStampLabel(finalLabel);

  const q = query.trim().toLocaleLowerCase("pl");
  const matches = STAMP_ICON_NAMES.filter(
    (n) => !q || n.includes(q) || STAMP_ICONS[n].keywords.includes(q)
  );

  React.useEffect(() => {
    if (!q || allNames) return;
    let cancelled = false;
    loadAllIcons()
      .then((all) => !cancelled && setAllNames([...all.keys()]))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [q, allNames]);

  const extraAll = q
    ? (allNames ?? []).filter(
        (n) => n.includes(q.replace(/\s+/g, "-")) && !CURATED_LUCIDE_NAMES.has(n)
      )
    : [];
  const extra = extraAll.slice(0, MAX_EXTRA_RESULTS);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSave(finalLabel, picked);
  };

  const cell = "flex aspect-square items-center justify-center rounded-md text-xs";

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
      // -ml-4 lets the box stick out by its padding, so its text lines up with the page text
      className="-ml-4 flex flex-col gap-3 rounded-xl border border-neutral-200 p-4"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold sm:text-xl">{isNew ? "new stamp" : "edit stamp"}</h3>
        {(finalLabel || picked) && (
          <span className="flex items-center gap-1 rounded-md border-2 px-1.5 text-xs font-bold tracking-wider">
            <StampIcon name={picked ?? undefined} className="size-3" />
            {finalLabel || "…"}
          </span>
        )}
      </div>

      {isNew && (
        <label className="flex flex-col gap-1 text-sm">
          name
          <input
            autoFocus
            value={name.toLocaleUpperCase("pl")}
            maxLength={STAMP_MAX_LENGTH}
            placeholder="KRAKÓW"
            onChange={(e) => setName(e.target.value)}
            className="w-[18ch] rounded-md bg-white p-2 text-base font-semibold focus:outline-2"
          />
        </label>
      )}

      <div className="flex flex-col gap-1 text-sm">
        icon
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search: plane, góry, party…"
          aria-label="search icons"
          className="w-full max-w-xs rounded-md bg-white p-2 focus:outline-2"
        />
        <div className="mt-1 grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1">
          <button
            type="button"
            aria-pressed={picked === null}
            onClick={() => setPicked(null)}
            className={`${cell} ${picked === null ? "bg-primary-900 text-white" : "hover:bg-neutral-200"}`}
          >
            none
          </button>
          {matches.map((n) => (
            <button
              key={n}
              type="button"
              title={STAMP_ICONS[n].lucide}
              aria-label={n}
              aria-pressed={picked === n}
              onClick={() => setPicked(n)}
              className={`${cell} ${picked === n ? "bg-primary-900 text-white" : "hover:bg-neutral-200"}`}
            >
              <StampIcon name={n} className="size-4" />
            </button>
          ))}
          {extra.map((n) => {
            const value = `${LUCIDE_PREFIX}${n}`;
            return (
              <button
                key={n}
                type="button"
                title={n}
                aria-label={n}
                aria-pressed={picked === value}
                onClick={() => setPicked(value)}
                className={`${cell} ${picked === value ? "bg-primary-900 text-white" : "hover:bg-neutral-200"}`}
              >
                <StampIcon name={value} className="size-4" />
              </button>
            );
          })}
        </div>
        {extraAll.length > extra.length && (
          <p className="opacity-60">
            {extraAll.length - extra.length} more — type a bit more to narrow it down
          </p>
        )}
        {q && allNames === null && <p className="opacity-60">searching all icons…</p>}
        {q && allNames && !matches.length && !extra.length && (
          <p className="opacity-60">nothing found</p>
        )}
      </div>

      {/* -ml-4 cancels the button padding, so the labels line up with the text above */}
      <div className="-ml-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={!isValid}
          className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 rounded-full px-4 py-1 text-white disabled:opacity-40"
        >
          {isNew ? "add" : "save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-1 hover:bg-neutral-200"
        >
          cancel
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remove "${label}" from the list? Stamps already placed stay.`)) {
                onDelete();
              }
            }}
            className="ml-auto rounded-full px-4 py-1 text-sm text-red-700 hover:bg-red-100"
          >
            delete stamp
          </button>
        )}
      </div>
    </form>
  );
};
