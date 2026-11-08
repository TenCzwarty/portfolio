import React from "react";
import { PencilIcon, XIcon } from "lucide-react";

import { LIMITS } from "~/app/utils/free-zone/_utils/validate";
import { Pill } from "~/components/pill";

import { freeSpotFor, paperOf } from "../../_utils/notes";
import type { TBoardView } from "../../_utils/types";
import { NoteEditor } from "../note-editor";
import { NoteVotes } from "../note-votes";

/** The board as a ranking: most wanted first. Labels only mean something on the canvas. */
export const NoteList = ({ notes, votes, people, me, highlightId, actions }: TBoardView) => {
  const [text, setText] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const ranked = notes
    .filter((n) => n.kind === "note")
    .sort(
      (a, b) => (votes[b.id]?.length ?? 0) - (votes[a.id]?.length ?? 0) || a.createdAt - b.createdAt
    );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    actions.add("note", text.trim(), freeSpotFor(notes));
    setText("");
  };

  return (
    <div className="flex flex-col gap-2">
      {me && (
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input
            type="text"
            required
            maxLength={LIMITS.noteText}
            placeholder="got an idea?"
            aria-label="new idea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-w-0 flex-1 rounded-md bg-white p-4 focus:outline-2"
          />
          <button type="submit">
            <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">add</Pill>
          </button>
        </form>
      )}

      {!ranked.length && <p className="p-4 text-center">no ideas here yet</p>}

      <ul className="flex flex-col gap-2">
        {ranked.map((note) => {
          const voters = people.filter((p) => votes[note.id]?.includes(p.id));
          const author = people.find((p) => p.id === note.createdBy);
          const isDimmed = highlightId && !voters.some((p) => p.id === highlightId);

          return (
            <li
              key={note.id}
              className={`flex flex-col gap-2 rounded-md p-3 text-black transition-opacity ${isDimmed ? "opacity-25" : ""}`}
              style={{ background: paperOf(author?.color) }}
            >
              {editingId === note.id ? (
                <NoteEditor
                  initial={note.text}
                  maxLength={LIMITS.noteText}
                  placeholder="got an idea?"
                  onDone={(value) => {
                    setEditingId(null);
                    if (value && value !== note.text) actions.update(note.id, value);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <span className="break-words whitespace-pre-line">{note.text}</span>
                  {me && (
                    <span className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        aria-label="edit"
                        onClick={() => setEditingId(note.id)}
                        className="rounded-full p-1.5 hover:bg-black/10"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="delete"
                        onClick={() => actions.remove(note)}
                        className="rounded-full p-1.5 hover:bg-black/10"
                      >
                        <XIcon size={14} />
                      </button>
                    </span>
                  )}
                </div>
              )}
              <NoteVotes voters={voters} me={me} onToggle={() => actions.toggleVote(note.id)} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
