import React from "react";
import { ArrowLeftIcon, ArrowRightIcon, Undo2Icon } from "lucide-react";

import type { TJiraClient, TPriority } from "../../_types";
import { type TPlan, useDeck } from "../../_utils/use-deck";
import { useSwipe } from "../../_utils/use-swipe";
import { IssueCard } from "../issue-card";
import { Summary } from "../summary";

type TDeck = {
  client: TJiraClient;
  plan: TPlan;
  onChangePlan: () => void;
};

const FLY_MS = 220;

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export const Deck = ({ client, plan, onChangePlan }: TDeck) => {
  const deck = useDeck(client, plan);
  const [priorities, setPriorities] = React.useState<Array<TPriority>>([]);
  const [leaving, setLeaving] = React.useState<"left" | "right" | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    client.priorities().then(setPriorities, () => {});
  }, [client]);

  const currentKey = deck.current?.key;
  const searchUsers = React.useCallback(
    (query: string) => (currentKey ? client.assignable(currentKey, query) : Promise.resolve([])),
    [client, currentKey]
  );

  const swipe = useSwipe((keep) => decide(keep), !leaving && !!deck.current);

  const decide = (keep: boolean) => {
    if (leaving || !deck.current) return;
    if (!keep && !plan.target) {
      swipe.reset();
      return;
    }
    setLeaving(keep ? "right" : "left");
    window.setTimeout(() => {
      deck.decide(keep);
      setLeaving(null);
      swipe.reset();
      cardRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, FLY_MS);
  };

  const undo = () => {
    if (leaving) return;
    deck.undo();
  };

  // ← / → decide, z cofa, o otwiera w Jirze
  const keyHandler = React.useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandler.current = (e) => {
    if (isTyping(e.target) || e.altKey || e.metaKey) return;
    if (e.key === "ArrowRight") decide(true);
    else if (e.key === "ArrowLeft") decide(false);
    else if (e.key === "z") undo();
    else if (e.key === "o" && deck.current) {
      window.open(`https://${client.site}/browse/${deck.current.key}`, "_blank", "noopener");
    } else return;
    e.preventDefault();
  };
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const kept = deck.decisions.filter((d) => d.keep).length;
  const moved = deck.decisions.length - kept;

  const offset = swipe.offset;
  const x = leaving ? (leaving === "right" ? "150%" : "-150%") : `${offset}px`;
  const rotation = leaving ? (leaving === "right" ? 12 : -12) : offset / 25;
  const stamp = leaving ? 1 : Math.min(1, Math.abs(offset) / swipe.threshold);
  const goingRight = leaving ? leaving === "right" : offset > 0;

  return (
    <div className="flex flex-col gap-4">
      {deck.errorMessage && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {deck.errorMessage}
          <button type="button" onClick={deck.clearError} aria-label="zamknij" className="px-2">
            ×
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div>
          <span className="font-semibold">{plan.planned.name}</span>
          {deck.status === "ready" && deck.issues.length > 0 && (
            <span className="opacity-70">
              {" "}
              · {Math.min(deck.index + 1, deck.issues.length)} / {deck.issues.length} · zostaje{" "}
              {kept} · wyleciało {moved}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onChangePlan}
          className="underline opacity-60 hover:opacity-100"
        >
          zmień sprint
        </button>
      </div>

      {deck.status === "loading" && (
        <div className="h-80 animate-pulse rounded-xl bg-neutral-200/60" />
      )}

      {deck.status === "error" && (
        <button
          type="button"
          onClick={deck.reload}
          className="self-start rounded-full border border-neutral-200 px-4 py-1 hover:bg-neutral-200"
        >
          spróbuj jeszcze raz
        </button>
      )}

      {deck.done && (
        <Summary
          issues={deck.issues}
          decisions={deck.decisions}
          planned={plan.planned}
          target={plan.target}
          site={client.site}
          onRetry={deck.retry}
          onUndo={undo}
          onRestart={deck.reload}
        />
      )}

      {deck.current && (
        <>
          <div ref={cardRef} className="relative overflow-x-clip py-2">
            <div
              {...swipe.handlers}
              style={{
                transform: `translateX(${x}) rotate(${rotation}deg)`,
                transition: swipe.dragging ? "none" : `transform ${FLY_MS}ms ease-out`,
                touchAction: "pan-y",
              }}
              className={`relative rounded-xl border border-neutral-200 bg-neutral-100 p-4 shadow-sm sm:p-6 ${swipe.dragging ? "cursor-grabbing select-none" : ""}`}
            >
              <div
                aria-hidden="true"
                style={{ opacity: stamp }}
                className={`pointer-events-none absolute top-4 z-10 rounded-md border-4 bg-neutral-100/90 px-3 py-1 text-xl font-bold uppercase ${goingRight ? "left-4 -rotate-12 border-green-600 text-green-700" : "right-4 rotate-12 border-red-600 text-red-700"}`}
              >
                {goingRight ? "zostaje" : (plan.target?.name ?? "brak n+2")}
              </div>

              <IssueCard
                key={deck.current.key}
                issue={deck.current}
                details={deck.currentDetails}
                site={client.site}
                priorities={priorities}
                searchUsers={searchUsers}
                onUpdate={(update) => deck.update(deck.current!.key, update)}
                onComment={(text) => deck.comment(deck.current!.key, text)}
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-10 -mx-2 flex items-center justify-between gap-2 bg-neutral-100/90 px-2 py-3 backdrop-blur">
            <button
              type="button"
              onClick={() => decide(false)}
              disabled={!plan.target}
              title={plan.target ? `przenieś do ${plan.target.name} (←)` : "nie ma sprintu n+2"}
              className="flex items-center gap-1.5 rounded-full border-2 border-red-600 px-4 py-2 text-red-700 hover:bg-red-50 disabled:opacity-40"
            >
              <ArrowLeftIcon size={18} />
              <span className="hidden sm:inline">{plan.target?.name ?? "brak n+2"}</span>
            </button>
            <button
              type="button"
              onClick={undo}
              disabled={deck.decisions.length === 0}
              title="cofnij (z)"
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm hover:bg-neutral-200 disabled:opacity-40"
            >
              <Undo2Icon size={16} /> cofnij
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              title={`zostaje w ${plan.planned.name} (→)`}
              className="flex items-center gap-1.5 rounded-full border-2 border-green-600 px-4 py-2 text-green-700 hover:bg-green-50"
            >
              <span className="hidden sm:inline">zostaje</span>
              <ArrowRightIcon size={18} />
            </button>
          </div>
          <p className="hidden text-center text-xs opacity-60 sm:block">
            ← / → decyzja · z cofa · o otwiera w Jirze · albo przeciągnij kartę
          </p>
        </>
      )}
    </div>
  );
};
