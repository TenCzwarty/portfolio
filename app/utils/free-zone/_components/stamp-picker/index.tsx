import React from "react";
import { PencilIcon } from "lucide-react";

import type { TStampIconName } from "../../_utils/stamps";
import { StampEditor } from "../stamp-editor";
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
  // which stamp's box is open: null = none, "" = a new stamp, otherwise the label being edited
  const [editing, setEditing] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* -ml-3 cancels the chip padding, so the first label lines up with the heading */}
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
              <button
                type="button"
                aria-label={`edit the ${label} stamp`}
                aria-expanded={editing === label}
                onClick={() => setEditing((e) => (e === label ? null : label))}
                className="rounded-full p-1.5 opacity-60 hover:bg-neutral-200 hover:opacity-100"
              >
                <PencilIcon className="size-3.5" />
              </button>
            )}
          </span>
        ))}

        <button
          type="button"
          aria-label="add a stamp"
          aria-expanded={editing === ""}
          onClick={() => setEditing((e) => (e === "" ? null : ""))}
          className={`${chip} border-dashed border-neutral-200 hover:bg-neutral-200`}
        >
          +
        </button>
      </div>

      {editing !== null && (
        <StampEditor
          key={editing}
          label={editing || undefined}
          icon={editing ? (icons[editing] ?? null) : null}
          canDelete={customLabels.includes(editing)}
          onSave={(label, icon) => {
            onDefine(label, icon);
            setEditing(null);
          }}
          onDelete={() => {
            onDelete(editing);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};
