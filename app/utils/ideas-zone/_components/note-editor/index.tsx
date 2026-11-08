import React from "react";

type TNoteEditor = {
  initial?: string;
  maxLength: number;
  placeholder: string;
  className?: string;
  /** called with the trimmed text, empty when there's nothing to keep */
  onDone: (text: string) => void;
  onCancel: () => void;
};

/** Enter or clicking away saves, Shift+Enter breaks the line, Escape gives up. */
export const NoteEditor = ({
  initial = "",
  maxLength,
  placeholder,
  className = "",
  onDone,
  onCancel,
}: TNoteEditor) => {
  const [text, setText] = React.useState(initial);
  // Enter closes the editor and the removed textarea can still report a blur: only one may count
  const finishedRef = React.useRef(false);

  const finish = (save: boolean) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (save) onDone(text.trim());
    else onCancel();
  };

  return (
    <textarea
      autoFocus
      rows={3}
      maxLength={maxLength}
      placeholder={placeholder}
      aria-label={placeholder}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onFocus={(e) => e.target.setSelectionRange(text.length, text.length)}
      onBlur={() => finish(true)}
      onKeyDown={(e) => {
        if (e.key === "Escape") finish(false);
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          finish(true);
        }
      }}
      className={`w-full resize-none bg-transparent outline-none ${className}`}
    />
  );
};
