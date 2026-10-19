import React from "react";

type TCommentForm = {
  onSave: (text: string) => Promise<boolean>;
};

export const CommentForm = ({ onSave }: TCommentForm) => {
  const [text, setText] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || saving) return;
    setSaving(true);
    if (await onSave(text)) setText("");
    setSaving(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <textarea
        rows={2}
        placeholder="add a comment (Ctrl+Enter sends)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSubmit(e);
        }}
        className="rounded-md bg-white p-2 text-sm focus:outline-2"
      />
      {text.trim() && (
        <button
          type="submit"
          disabled={saving}
          className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 self-start rounded-full px-4 py-1 text-sm text-white disabled:opacity-50"
        >
          {saving ? "saving…" : "add comment"}
        </button>
      )}
    </form>
  );
};
