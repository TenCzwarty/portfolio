import React from "react";

import { isStampLabel, normalizeStamp, STAMP_MAX_LENGTH } from "../../_utils/stamps";

type TStampPicker = {
  labels: Array<string>;
  customLabels: Array<string>;
  selected: string;
  onSelect: (label: string) => void;
  onAdd: (label: string) => void;
  onDelete: (label: string) => void;
};

const chip = "rounded-full border px-3 py-1 text-sm";

export const StampPicker = ({
  labels,
  customLabels,
  selected,
  onSelect,
  onAdd,
  onDelete,
}: TStampPicker) => {
  const [draft, setDraft] = React.useState<string | null>(null);
  const normalized = normalizeStamp(draft ?? "");
  const isValid = isStampLabel(normalized);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onAdd(normalized);
    setDraft(null);
  };

  return (
    // -ml-3 cancels the chip padding, so the first label lines up with the heading
    <div className="-ml-3 flex flex-wrap items-center gap-2">
      {labels.map((label) => (
        <span key={label} className="flex items-center">
          <button
            type="button"
            aria-pressed={selected === label}
            onClick={() => onSelect(label)}
            className={`${chip} font-semibold ${selected === label ? "border-primary-900 bg-primary-900 text-white" : "border-neutral-200 hover:bg-neutral-200"}`}
          >
            {label}
          </button>
          {customLabels.includes(label) && selected === label && (
            <button
              type="button"
              aria-label={`remove the ${label} stamp from the list`}
              onClick={() => {
                if (
                  window.confirm(`Remove "${label}" from the list? Stamps already placed stay.`)
                ) {
                  onDelete(label);
                }
              }}
              className="px-1.5 text-sm opacity-60 hover:opacity-100"
            >
              ×
            </button>
          )}
        </span>
      ))}

      {draft === null ? (
        <button
          type="button"
          aria-label="add a stamp"
          onClick={() => setDraft("")}
          className={`${chip} border-dashed border-neutral-200 hover:bg-neutral-200`}
        >
          +
        </button>
      ) : (
        <form onSubmit={onSubmit} className="flex items-center gap-1">
          <input
            autoFocus
            value={normalized}
            maxLength={STAMP_MAX_LENGTH}
            placeholder="KRK"
            aria-label="new stamp"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setDraft(null)}
            className={`${chip} w-[7ch] border-neutral-200 bg-white font-semibold focus:outline-2`}
          />
          <button
            type="submit"
            disabled={!isValid}
            className="rounded-full px-2 py-1 text-sm hover:bg-neutral-200 disabled:opacity-40"
          >
            add
          </button>
        </form>
      )}
    </div>
  );
};
