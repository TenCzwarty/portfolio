import React from "react";

import {
  isStampLabel,
  normalizeStamp,
  STAMP_MAX_LENGTH,
  type TStampIconName,
} from "../../_utils/stamps";
import { IconPicker } from "../icon-picker";
import { StampIcon } from "../stamp-icon";

type TStampPicker = {
  labels: Array<string>;
  customLabels: Array<string>;
  icons: Record<string, string>;
  selected: string;
  onSelect: (label: string) => void;
  onDefine: (label: string, icon: TStampIconName | null) => void;
  onDelete: (label: string) => void;
};

const chip = "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm";

export const StampPicker = ({
  labels,
  customLabels,
  icons,
  selected,
  onSelect,
  onDefine,
  onDelete,
}: TStampPicker) => {
  const [draft, setDraft] = React.useState<string | null>(null);
  const [draftIcon, setDraftIcon] = React.useState<TStampIconName | null>(null);
  const normalized = normalizeStamp(draft ?? "");
  const isValid = isStampLabel(normalized);

  const closeDraft = () => {
    setDraft(null);
    setDraftIcon(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onDefine(normalized, draftIcon);
    closeDraft();
  };

  return (
    // -ml-3 cancels the chip padding, so the first label lines up with the heading
    <div className="-ml-3 flex flex-wrap items-center gap-2">
      {labels.map((label) => (
        <span key={label} className="flex items-center gap-1">
          <button
            type="button"
            aria-pressed={selected === label}
            onClick={() => onSelect(label)}
            className={`${chip} font-semibold ${selected === label ? "border-primary-900 bg-primary-900 text-white" : "border-neutral-200 hover:bg-neutral-200"}`}
          >
            <StampIcon name={icons[label]} className="size-3.5" />
            {label}
          </button>

          {selected === label && (
            <>
              <IconPicker
                value={icons[label] ?? null}
                onChange={(icon) => onDefine(label, icon)}
                label={`icon for the ${label} stamp`}
              />
              {customLabels.includes(label) && (
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
            </>
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
          <IconPicker value={draftIcon} onChange={setDraftIcon} label="icon for the new stamp" />
          <input
            autoFocus
            // shown as typed (upper-cased) - trimming here would eat the space before the next word
            value={(draft ?? "").toLocaleUpperCase("pl")}
            maxLength={STAMP_MAX_LENGTH}
            placeholder="KRAKÓW"
            aria-label="new stamp name"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && closeDraft()}
            className={`${chip} w-[15ch] border-neutral-200 bg-white font-semibold focus:outline-2`}
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
