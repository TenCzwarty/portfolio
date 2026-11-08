"use client";

import React from "react";
import { LayoutListIcon, StickyNoteIcon } from "lucide-react";

import { IdentityForm } from "~/app/utils/free-zone/_components/identity-form";
import { Legend } from "~/app/utils/free-zone/_components/legend";
import { Modal } from "~/app/utils/free-zone/_components/modal";
import { newId } from "~/app/utils/free-zone/_utils/identity";
import { useCalendar } from "~/app/utils/free-zone/_utils/use-calendar";
import { Pill } from "~/components/pill";
import { Section } from "~/components/section";
import { Spinner } from "~/components/spinner";
import { toast, ToastContainer } from "~/components/toast";

import { BoardCanvas } from "./_components/board-canvas";
import { NoteList } from "./_components/note-list";
import type { TBoardView, TNoteActions } from "./_utils/types";

type TLayout = "canvas" | "list";

const LAYOUTS: Array<{ value: TLayout; label: string; Icon: typeof StickyNoteIcon }> = [
  { value: "canvas", label: "board", Icon: StickyNoteIcon },
  { value: "list", label: "ranking", Icon: LayoutListIcon },
];

export default function UtilsIdeasZonePage() {
  const { data, status, errorMessage, clearError, me, setMe, hydrated, send, forgetSecret } =
    useCalendar({ withNotes: true });

  // phones start on the ranking: a canvas on a small screen is mostly panning around
  const [layout, setLayout] = React.useState<TLayout | null>(null);
  React.useEffect(() => {
    setLayout(window.matchMedia("(max-width: 639px)").matches ? "list" : "canvas");
  }, []);

  const [editingMe, setEditingMe] = React.useState(false);
  const [highlightId, setHighlightId] = React.useState<string | null>(null);

  const people = React.useMemo(
    () => [...data.people].sort((a, b) => a.name.localeCompare(b.name)),
    [data.people]
  );

  const actions: TNoteActions = {
    add: (kind, text, { x, y }) => {
      if (!me) return;
      const note = { id: newId(), kind, text, x, y, createdBy: me.id, createdAt: Date.now() };
      send({ type: "note-add", note });
    },
    update: (id, text) => send({ type: "note-update", id, text }),
    move: (id, x, y) => send({ type: "note-move", id, x, y }),
    remove: (note) => {
      send({ type: "note-delete", id: note.id });
      toast(`deleted "${note.text}"`, { undo: () => send({ type: "note-add", note }) });
    },
    toggleVote: (id) => {
      if (!me) return;
      const on = !data.noteVotes[id]?.includes(me.id);
      send({ type: "note-vote", noteId: id, personId: me.id, on });
    },
  };

  const boardProps: TBoardView = {
    notes: data.notes,
    votes: data.noteVotes,
    people,
    me,
    highlightId,
    actions,
  };

  const isLoading = !hydrated || status === "loading" || !layout;

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <ToastContainer />
      <Section>
        <div className="mt-16 ml-4">
          <h1 className="text-xl font-semibold sm:text-3xl">Ideas Zone</h1>
          <p>shared sticky notes for collecting ideas</p>
        </div>
      </Section>

      <div className="space-y-4 px-4 pb-8 sm:px-8">
        {errorMessage && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            {errorMessage}
            <button type="button" onClick={clearError} aria-label="close" className="px-2">
              ×
            </button>
          </div>
        )}

        {status === "locked" ? (
          <div className="rounded-xl border border-neutral-200 p-4">
            this board is private — open it with the secret link
          </div>
        ) : (
          <>
            {hydrated && status === "ready" && !me && (
              <IdentityForm me={null} people={people} onSave={setMe} />
            )}

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1">
                {LAYOUTS.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={layout === value}
                    onClick={() => setLayout(value)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${layout === value ? "bg-neutral-200" : "hover:bg-neutral-200"}`}
                  >
                    <Icon size={14} aria-hidden="true" /> {label}
                  </button>
                ))}
              </div>
              <Legend
                people={people}
                me={me}
                highlightId={highlightId}
                onHighlight={setHighlightId}
                onEditMe={() => setEditingMe(true)}
              />
            </div>

            {isLoading ? (
              <div className="h-[70dvh] rounded-xl border border-neutral-200">
                <Spinner className="h-full" />
              </div>
            ) : layout === "canvas" ? (
              <BoardCanvas {...boardProps} />
            ) : (
              <NoteList {...boardProps} />
            )}

            {editingMe && me && (
              <Modal title="edit" onClose={() => setEditingMe(false)}>
                <IdentityForm
                  key={me.id}
                  me={me}
                  people={people}
                  embedded
                  onSave={(person) => {
                    setMe(person);
                    setEditingMe(false);
                  }}
                  onCancel={() => setEditingMe(false)}
                  extraActions={
                    <button type="button" onClick={forgetSecret} className="ml-auto">
                      <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
                        forget the secret link on this device
                      </Pill>
                    </button>
                  }
                />
              </Modal>
            )}
          </>
        )}
      </div>
    </main>
  );
}
