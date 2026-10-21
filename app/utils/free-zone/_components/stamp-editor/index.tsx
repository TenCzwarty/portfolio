import React from "react";

import { Pill } from "~/components/pill";

import { loadAllIcons } from "../../_utils/all-icons";
import {
  iconOnlyLabel,
  isStampLabel,
  LUCIDE_PREFIX,
  normalizeStamp,
  STAMP_ICON_NAMES,
  STAMP_MAX_LENGTH,
  stampName,
  stampText,
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

  // a new stamp needs a name or an icon - without a name, the icon alone is the stamp
  const finalLabel = !isNew
    ? label
    : name.trim()
      ? normalizeStamp(name)
      : picked
        ? iconOnlyLabel(picked)
        : "";
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
  const text = stampText(finalLabel);

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
      // -ml-4 lets the box stick out by its padding, so its text lines up with the page text
      className="-ml-4 flex flex-col gap-4 rounded-xl border border-neutral-200 p-4"
    >
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold sm:text-xl">{isNew ? "new stamp" : "edit stamp"}</h3>
        {(text || picked) && (
          <span className="flex items-center gap-1.5 rounded-md border-2 px-2 py-0.5 text-sm font-bold tracking-wider sm:text-base">
            <StampIcon name={picked ?? undefined} className="size-4 sm:size-5" />
            {text}
          </span>
        )}
      </div>

      {/* same field size and placeholders as the name field and the inputs on /qr */}
      {isNew && (
        <input
          autoFocus
          type="text"
          value={name.toLocaleUpperCase("pl")}
          maxLength={STAMP_MAX_LENGTH}
          placeholder="name"
          aria-label="name - optional when the stamp has an icon"
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md bg-white p-4 font-semibold focus:outline-2"
        />
      )}

      {/* the icons sit next to their search field once there's room */}
      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="icon"
          aria-label="search icons, e.g. plane, góry, party"
          className="w-full rounded-md bg-white p-4 focus:outline-2"
        />

        <div className="flex flex-col gap-1 text-sm">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1">
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
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="submit" disabled={!isValid} className="disabled:opacity-40">
          <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
            {isNew ? "add" : "save"}
          </Pill>
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
              if (
                window.confirm(
                  `Remove "${stampName(finalLabel)}" from the list? Stamps already placed stay.`
                )
              ) {
                onDelete();
              }
            }}
            className="ml-auto"
          >
            <Pill classes="bg-primary-900 hover:bg-red-700">delete stamp</Pill>
          </button>
        )}
      </div>
    </form>
  );
};
