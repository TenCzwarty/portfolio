import React from "react";
import { PencilIcon } from "lucide-react";

type TTitleEditor = {
  title: string;
  onSave: (title: string) => void;
};

/** Jira rejects summaries longer than this */
const MAX_LENGTH = 255;

const titleClass = "text-xl font-semibold sm:text-2xl";

export const TitleEditor = ({ title, onSave }: TTitleEditor) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(title);
  const ref = React.useRef<HTMLTextAreaElement>(null);
  // closing unmounts the textarea, which may still fire a blur – that one must not save again
  const closed = React.useRef(false);

  // grow with the text, a summary can wrap over a few lines
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, editing]);

  const start = () => {
    setDraft(title);
    closed.current = false;
    setEditing(true);
  };

  const save = () => {
    if (closed.current) return;
    closed.current = true;
    const next = draft.replace(/\s+/g, " ").trim();
    setEditing(false);
    if (next && next !== title) onSave(next);
  };

  if (!editing) {
    return (
      <h2 className={titleClass}>
        <button
          type="button"
          onClick={start}
          title="kliknij, żeby zmienić tytuł"
          className="group cursor-text rounded-md text-left hover:bg-white/70"
        >
          {title}
          <PencilIcon
            size={16}
            className="ml-2 inline align-baseline opacity-0 transition-opacity group-hover:opacity-50"
          />
        </button>
      </h2>
    );
  }

  return (
    <textarea
      ref={ref}
      autoFocus
      rows={1}
      maxLength={MAX_LENGTH}
      aria-label="tytuł"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={(e) => e.target.select()}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          save();
        } else if (e.key === "Escape") {
          closed.current = true;
          setEditing(false);
        }
      }}
      className={`${titleClass} w-full resize-none overflow-hidden rounded-md bg-white p-1 focus:outline-2`}
    />
  );
};
