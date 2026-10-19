import React from "react";

type TLabelsEditor = {
  labels: Array<string>;
  /** labels that already exist in Jira – new ones cannot be created here; null = loading */
  available: Array<string> | null;
  onChange: (labels: Array<string>) => void;
};

const MAX_SUGGESTIONS = 8;

export const LabelsEditor = ({ labels, available, onChange }: TLabelsEditor) => {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);
  const listId = React.useId();

  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return (available ?? [])
      .filter((label) => !labels.includes(label) && label.toLowerCase().includes(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [available, labels, query]);

  const add = (label: string) => {
    onChange([...labels, label]);
    setQuery("");
    setHighlight(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    else if (e.key === "ArrowUp") setHighlight((h) => Math.max(h - 1, 0));
    else if (e.key === "Enter" && suggestions[highlight]) add(suggestions[highlight]);
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Backspace" && !query && labels.length) onChange(labels.slice(0, -1));
    else return;
    e.preventDefault();
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
            aria-label={`remove label ${label}`}
            className="rounded-full px-1.5 hover:bg-white"
          >
            ×
          </button>
        </span>
      ))}

      <div className="relative">
        <input
          placeholder="+ label"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-28 rounded-full bg-transparent px-2.5 py-0.5 focus:bg-white focus:outline-2"
        />
        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-60 w-56 overflow-auto rounded-xl border border-neutral-200 bg-white p-1 shadow-lg"
          >
            {suggestions.map((label, i) => (
              <li key={label} role="option" aria-selected={i === highlight}>
                <button
                  type="button"
                  // mousedown, so the input does not blur and close the list first
                  onMouseDown={(e) => {
                    e.preventDefault();
                    add(label);
                  }}
                  className={`w-full rounded-md p-1.5 text-left ${i === highlight ? "bg-neutral-100" : "hover:bg-neutral-100"}`}
                >
                  {label}
                </button>
              </li>
            ))}
            {suggestions.length === 0 && (
              <li className="p-1.5 opacity-60">
                {available ? "no such label in Jira" : "loading labels…"}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
