import { PencilIcon, PlusIcon } from "lucide-react";

import { stampIconFor, stampName, stampText } from "../../_utils/stamps";
import { StampIcon } from "../stamp-icon";

type TStampChips = {
  labels: Array<string>;
  icons: Record<string, string>;
  selected: string;
  /** label whose box is open: null = none, "" = a new stamp */
  editing: string | null;
  /** edit buttons only while the settings are open - picking stays one tap */
  showEdit: boolean;
  onSelect: (label: string) => void;
  onEdit: (label: string | null) => void;
};

// fixed height (set where used), so the text chips, the pencil and the plus line up
const chip = "flex items-center gap-1.5 rounded-full border px-3 text-sm";

/** stamps to pick from, rendered inline so they share a row with the mode pills */
export const StampChips = ({
  labels,
  icons,
  selected,
  editing,
  showEdit,
  onSelect,
  onEdit,
}: TStampChips) => (
  <div className="flex flex-wrap items-center gap-2">
    {labels.map((label) => {
      // one pencil, on the stamp you're holding - joined to it by a dashed outline around both
      const withPencil = showEdit && selected === label;
      return (
        <span
          key={label}
          // the hover lights up the whole pair, not just the pencil
          className={`flex items-center rounded-full ${withPencil ? "border border-dashed border-neutral-400 hover:bg-neutral-200" : ""}`}
        >
          <button
            type="button"
            aria-pressed={selected === label}
            aria-label={stampName(label)}
            onClick={() => onSelect(label)}
            // inside the outline everything is 2px shorter, so the pair is as tall as the rest
            className={`${chip} ${withPencil ? "h-[30px]" : "h-8"} font-semibold ${selected === label ? "border-primary-900 bg-primary-900 text-white" : "border-neutral-200 hover:bg-neutral-200"}`}
          >
            <StampIcon name={stampIconFor(label, icons)} className="size-3.5" />
            {stampText(label)}
          </button>
          {withPencil && (
            <button
              type="button"
              aria-label={`edit the ${stampName(label)} stamp`}
              aria-expanded={editing === label}
              onClick={() => onEdit(editing === label ? null : label)}
              className={`${chip} h-[30px] border-transparent`}
            >
              <PencilIcon className="size-3.5" />
            </button>
          )}
        </span>
      );
    })}

    <button
      type="button"
      aria-label="add a stamp"
      aria-expanded={editing === ""}
      onClick={() => onEdit(editing === "" ? null : "")}
      className={`${chip} h-8 border-dashed border-neutral-200 hover:bg-neutral-200`}
    >
      <PlusIcon className="size-3.5" aria-hidden="true" />
    </button>
  </div>
);
