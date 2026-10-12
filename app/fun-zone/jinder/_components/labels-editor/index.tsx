import React from "react";

type TLabelsEditor = {
  labels: Array<string>;
  onChange: (labels: Array<string>) => void;
};

export const LabelsEditor = ({ labels, onChange }: TLabelsEditor) => {
  const [draft, setDraft] = React.useState("");

  const add = () => {
    // Jira labels cannot contain spaces
    const label = draft.trim().replace(/\s+/g, "-");
    setDraft("");
    if (label && !labels.includes(label)) onChange([...labels, label]);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      {labels.map((label) => (
        <span
          key={label}
          className="flex items-center gap-1 rounded-full bg-neutral-200 py-0.5 pr-1 pl-2.5"
        >
          {label}
          <button
            type="button"
            onClick={() => onChange(labels.filter((l) => l !== label))}
            aria-label={`usuń label ${label}`}
            className="rounded-full px-1.5 hover:bg-white"
          >
            ×
          </button>
        </span>
      ))}
      <input
        placeholder="+ label"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        className="w-24 rounded-full bg-transparent px-2.5 py-0.5 focus:bg-white focus:outline-2"
      />
    </div>
  );
};
