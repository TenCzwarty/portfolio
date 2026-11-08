import React from "react";
import { MaximizeIcon, MinusIcon, PencilIcon, PlusIcon, TypeIcon, XIcon } from "lucide-react";

import type { TNote, TNoteKind } from "../../../_types";
import { LIMITS } from "../../../_utils/validate";
import {
  boundsOf,
  clampPosition,
  NOTE_WIDTH,
  paperOf,
  rotationOf,
  scaleOf,
} from "../../_utils/notes";
import type { TBoardView } from "../../_utils/types";
import { NoteEditor } from "../note-editor";
import { NoteVotes } from "../note-votes";

type TDraft = { kind: TNoteKind; x: number; y: number };

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.6;
const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));

const toolButton =
  "flex items-center gap-1 rounded-full bg-primary-900 px-3 py-1 text-sm text-white hover:bg-accent-500 hover:text-primary-900";
const zoomButton = "rounded-full p-1 hover:bg-neutral-200";
const cornerButton =
  "flex size-6 items-center justify-center rounded-full bg-primary-900 text-white hover:bg-accent-500 hover:text-primary-900";

/** follows the pointer from the window, so a drag survives leaving the note under it */
const trackPointer = (
  e: React.PointerEvent,
  onMove: (dx: number, dy: number) => void,
  onEnd: (moved: boolean) => void
) => {
  const { clientX: startX, clientY: startY } = e;
  let moved = false;

  const move = (ev: PointerEvent) => {
    const [dx, dy] = [ev.clientX - startX, ev.clientY - startY];
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    if (moved) onMove(dx, dy);
  };
  const end = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointercancel", end);
    onEnd(moved);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
};

export const BoardCanvas = ({ notes, votes, people, me, highlightId, actions }: TBoardView) => {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [view, setView] = React.useState({ x: 0, y: 0, z: 1 });
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<TDraft | null>(null);
  // kept apart from the data, so a refresh in the middle of a drag can't yank the note away
  const [dragged, setDragged] = React.useState<{ id: string; x: number; y: number } | null>(null);
  // what was touched last lies on top; only on this screen, nobody else's board gets reshuffled
  const [raised, setRaised] = React.useState<Record<string, number>>({});
  const raiseCounter = React.useRef(0);

  const fit = React.useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { width, height } = stage.getBoundingClientRect();
    const bounds = boundsOf(notes);
    if (!bounds) {
      setView({ x: width / 2 - NOTE_WIDTH / 2, y: height / 3, z: 1 });
      return;
    }
    const z = clampZoom(Math.min(1, width / (bounds.width + 80), height / (bounds.height + 80)));
    setView({
      x: width / 2 - (bounds.x + bounds.width / 2) * z,
      y: height / 2 - (bounds.y + bounds.height / 2) * z,
      z,
    });
  }, [notes]);

  const fittedRef = React.useRef(false);
  React.useLayoutEffect(() => {
    if (fittedRef.current) return;
    fittedRef.current = true;
    fit();
  }, [fit]);

  const zoomAround = React.useCallback((nextZ: (z: number) => number, cx?: number, cy?: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const [px, py] = [cx ?? rect.width / 2, cy ?? rect.height / 2];
    setView(({ x, y, z }) => {
      const next = clampZoom(nextZ(z));
      return { x: px - ((px - x) * next) / z, y: py - ((py - y) * next) / z, z: next };
    });
  }, []);

  // Ctrl + wheel and trackpad pinch zoom; a plain wheel still scrolls the page.
  // Attached by hand because React's wheel listeners are passive and can't stop the browser zoom.
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      zoomAround((z) => z * (1 - e.deltaY * 0.01), e.clientX - rect.left, e.clientY - rect.top);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoomAround]);

  const toWorld = (clientX: number, clientY: number) => {
    const rect = stageRef.current!.getBoundingClientRect();
    return {
      x: (clientX - rect.left - view.x) / view.z,
      y: (clientY - rect.top - view.y) / view.z,
    };
  };

  const startDraft = (kind: TNoteKind, world?: { x: number; y: number }) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const { x, y } = world ?? toWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setSelectedId(null);
    setEditingId(null);
    setDraft({ kind, x: clampPosition(x - NOTE_WIDTH / 2), y: clampPosition(y - 40) });
  };

  const onStagePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const start = view;
    trackPointer(
      e,
      (dx, dy) => setView({ ...start, x: start.x + dx, y: start.y + dy }),
      (moved) => !moved && setSelectedId(null)
    );
  };

  const onNotePointerDown = (note: TNote, e: React.PointerEvent) => {
    // without a name you can look around, so a press on a note just pans
    if (!me || e.button !== 0) return;
    e.stopPropagation();
    if ((e.target as HTMLElement).closest("button, textarea")) return;

    setRaised((r) => ({ ...r, [note.id]: ++raiseCounter.current }));
    const { z } = view;
    let last = { x: note.x, y: note.y };

    trackPointer(
      e,
      (dx, dy) => {
        last = { x: clampPosition(note.x + dx / z), y: clampPosition(note.y + dy / z) };
        setDragged({ id: note.id, ...last });
      },
      (moved) => {
        setDragged(null);
        if (moved) actions.move(note.id, last.x, last.y);
        else setSelectedId(note.id);
      }
    );
  };

  const startEditing = (note: TNote) => {
    setSelectedId(note.id);
    setEditingId(note.id);
  };

  const renderEditor = (
    kind: TNoteKind,
    initial: string | undefined,
    onDone: (t: string) => void,
    onCancel: () => void
  ) => (
    <NoteEditor
      initial={initial}
      maxLength={kind === "label" ? LIMITS.labelText : LIMITS.noteText}
      placeholder={kind === "label" ? "e.g. Tokyo" : "what do you want to see?"}
      className={kind === "label" ? "text-lg font-semibold" : "text-sm text-black"}
      onDone={onDone}
      onCancel={onCancel}
    />
  );

  return (
    <div
      ref={stageRef}
      onPointerDown={onStagePointerDown}
      onDoubleClick={(e) => me && startDraft("note", toWorld(e.clientX, e.clientY))}
      className="relative isolate h-[70dvh] min-h-[420px] cursor-grab touch-none overflow-hidden rounded-xl border border-neutral-200 select-none"
      style={{
        backgroundImage: "radial-gradient(var(--color-neutral-200) 1px, transparent 1px)",
        backgroundSize: `${24 * view.z}px ${24 * view.z}px`,
        backgroundPosition: `${view.x}px ${view.y}px`,
      }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})` }}
      >
        {notes.map((note, index) => {
          const isLabel = note.kind === "label";
          const voters = people.filter((p) => votes[note.id]?.includes(p.id));
          const author = people.find((p) => p.id === note.createdBy);
          const position = dragged?.id === note.id ? dragged : note;
          const isSelected = selectedId === note.id;
          const isEditing = editingId === note.id;
          const isDimmed = highlightId && !isLabel && !voters.some((p) => p.id === highlightId);

          return (
            <div
              key={note.id}
              onPointerDown={(e) => onNotePointerDown(note, e)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (me) startEditing(note);
              }}
              title={author && !isLabel ? `added by ${author.name}` : undefined}
              className={`absolute transition-opacity ${me ? "cursor-move" : ""} ${isDimmed ? "opacity-25" : ""} ${isSelected ? "outline-primary-900 outline-2" : ""} ${
                isLabel
                  ? "rounded-md px-1 text-lg font-semibold whitespace-nowrap"
                  : "flex min-h-28 w-36 flex-col justify-between gap-2 p-2.5 text-black"
              }`}
              style={{
                left: position.x,
                top: position.y,
                zIndex: raised[note.id] ? notes.length + raised[note.id] : index + 1,
                ...(isLabel
                  ? {}
                  : {
                      background: paperOf(author?.color),
                      transform: `rotate(${rotationOf(note.id)}deg) scale(${scaleOf(voters.length)})`,
                    }),
              }}
            >
              {isEditing ? (
                renderEditor(
                  note.kind,
                  note.text,
                  (text) => {
                    setEditingId(null);
                    // emptied by accident: deleting has its own button, with undo
                    if (text && text !== note.text) actions.update(note.id, text);
                  },
                  () => setEditingId(null)
                )
              ) : (
                <div className={isLabel ? "" : "text-sm break-words whitespace-pre-line"}>
                  {note.text}
                </div>
              )}

              {!isLabel && (
                <NoteVotes voters={voters} me={me} onToggle={() => actions.toggleVote(note.id)} />
              )}

              {isSelected && !isEditing && me && (
                <div className="absolute -top-3 -right-3 flex gap-1">
                  <button
                    type="button"
                    aria-label="edit"
                    onClick={() => setEditingId(note.id)}
                    className={cornerButton}
                  >
                    <PencilIcon size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label="delete"
                    onClick={() => {
                      setSelectedId(null);
                      actions.remove(note);
                    }}
                    className={cornerButton}
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {draft && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            className={`absolute ${draft.kind === "label" ? "w-60" : "min-h-28 w-36 p-2.5"}`}
            style={{
              left: draft.x,
              top: draft.y,
              zIndex: notes.length + raiseCounter.current + 1,
              ...(draft.kind === "note" ? { background: paperOf(me?.color) } : {}),
            }}
          >
            {renderEditor(
              draft.kind,
              undefined,
              (text) => {
                setDraft(null);
                if (text) actions.add(draft.kind, text, draft);
              },
              () => setDraft(null)
            )}
          </div>
        )}
      </div>

      <div
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        className="absolute top-2 left-2 z-[100000] flex gap-2"
      >
        {me && (
          <>
            <button type="button" onClick={() => startDraft("note")} className={toolButton}>
              <PlusIcon size={14} /> note
            </button>
            <button type="button" onClick={() => startDraft("label")} className={toolButton}>
              <TypeIcon size={14} /> label
            </button>
          </>
        )}
      </div>

      <div
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        className="absolute right-2 bottom-2 z-[100000] flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-1 text-sm"
      >
        <button
          type="button"
          aria-label="zoom out"
          onClick={() => zoomAround((z) => z - 0.2)}
          className={zoomButton}
        >
          <MinusIcon size={16} />
        </button>
        <span className="w-10 text-center">{Math.round(view.z * 100)}%</span>
        <button
          type="button"
          aria-label="zoom in"
          onClick={() => zoomAround((z) => z + 0.2)}
          className={zoomButton}
        >
          <PlusIcon size={16} />
        </button>
        <button type="button" aria-label="show everything" onClick={fit} className={zoomButton}>
          <MaximizeIcon size={16} />
        </button>
      </div>

      {!notes.length && !draft && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-center">
          {me ? "double-click anywhere to add the first idea" : "no ideas here yet"}
        </p>
      )}
    </div>
  );
};
