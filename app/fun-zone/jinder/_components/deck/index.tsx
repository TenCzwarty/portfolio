import React from "react";
import { ArrowLeftIcon, ArrowRightIcon, Undo2Icon } from "lucide-react";

import type { TEpic, TJiraClient, TPriority } from "../../_types";
import { type TPlan, useDeck } from "../../_utils/use-deck";
import { useSwipe } from "../../_utils/use-swipe";
import { IssueCard, type TCardOptions } from "../issue-card";
import { PeopleBar, type TPersonFilter } from "../people-bar";
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
  const [filter, setFilter] = React.useState<TPersonFilter>(null);
  const deck = useDeck(client, plan, filter);
  const [priorities, setPriorities] = React.useState<Array<TPriority>>([]);
  const [labels, setLabels] = React.useState<Array<string> | null>(null);
  const [epics, setEpics] = React.useState<Array<TEpic>>([]);
  const [leaving, setLeaving] = React.useState<"left" | "right" | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // picker contents – a failure only means an emptier dropdown
  React.useEffect(() => {
    client.priorities().then(setPriorities, () => {});
    client.labels().then(setLabels, () => setLabels([]));
  }, [client]);

  React.useEffect(() => {
    client.epics(plan.boardId).then(setEpics, () => {});
  }, [client, plan.boardId]);

  const currentKey = deck.current?.key;
  const searchUsers = React.useCallback(
    (query: string) => (currentKey ? client.assignable(currentKey, query) : Promise.resolve([])),
    [client, currentKey]
  );

  const loadImage = React.useCallback((url: string) => client.image(url), [client]);

  const options: TCardOptions = {
    site: client.site,
    priorities,
    labels,
    epics,
    searchUsers,
    loadImage,
  };

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

  // ← / → decide, z undoes, o opens in Jira
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
  const filteredName =
    filter && deck.people.find((p) => p.id === filter)?.user?.displayName.split(/\s+/)[0];

  const offset = swipe.offset;
  const x = leaving ? (leaving === "right" ? "150%" : "-150%") : `${offset}px`;
  const rotation = leaving ? (leaving === "right" ? 12 : -12) : offset / 25;
  const glow = leaving ? 1 : Math.min(1, Math.abs(offset) / swipe.threshold);
  const goingRight = leaving ? leaving === "right" : offset > 0;

  return (
    <div className="flex flex-col gap-4">
      {deck.errorMessage && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {deck.errorMessage}
          <button type="button" onClick={deck.clearError} aria-label="close" className="px-2">
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
              · reviewed {deck.decisions.length} / {deck.issues.length} · kept {kept} · moved{" "}
              {moved}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onChangePlan}
          className="underline opacity-60 hover:opacity-100"
        >
          change sprint
        </button>
      </div>

      {deck.status === "ready" && deck.people.length > 0 && (
        <PeopleBar
          people={deck.people}
          filter={filter}
          onFilter={setFilter}
          loadImage={loadImage}
        />
      )}

      {!deck.done && !deck.current && filter && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-200 p-4">
          <span>{filteredName ? `${filteredName} has` : "there are"} no more issues to review</span>
          <button
            type="button"
            onClick={() => setFilter(null)}
            className="rounded-full border border-neutral-200 px-4 py-1 hover:bg-neutral-200"
          >
            show everyone
          </button>
        </div>
      )}

      {deck.status === "loading" && (
        <div className="h-80 animate-pulse rounded-xl bg-neutral-200/60" />
      )}

      {deck.status === "error" && (
        <button
          type="button"
          onClick={deck.reload}
          className="self-start rounded-full border border-neutral-200 px-4 py-1 hover:bg-neutral-200"
        >
          try again
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
          {/* screen edges light up in the direction of the swipe, behind the moving card */}
          <div
            aria-hidden="true"
            style={{ opacity: goingRight ? 0 : glow }}
            className={`pointer-events-none fixed inset-y-0 left-0 z-20 w-1/3 bg-linear-to-r from-red-500/60 to-transparent ${swipe.dragging ? "" : "transition-opacity duration-200"}`}
          />
          <div
            aria-hidden="true"
            style={{ opacity: goingRight ? glow : 0 }}
            className={`pointer-events-none fixed inset-y-0 right-0 z-20 w-1/3 bg-linear-to-l from-green-500/60 to-transparent ${swipe.dragging ? "" : "transition-opacity duration-200"}`}
          />

          <div ref={cardRef} className="relative py-2">
            <div
              {...swipe.handlers}
              style={{
                transform: `translateX(${x}) rotate(${rotation}deg)`,
                transition: swipe.dragging ? "none" : `transform ${FLY_MS}ms ease-out`,
                touchAction: "pan-y",
              }}
              className={`relative rounded-xl border border-neutral-200 bg-neutral-100 p-4 shadow-sm sm:p-6 ${swipe.dragging ? "z-30 cursor-grabbing shadow-xl select-none" : leaving ? "z-30" : "cursor-grab"}`}
            >
              <IssueCard
                key={deck.current.key}
                issue={deck.current}
                details={deck.currentDetails}
                options={options}
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
              title={plan.target ? `move to ${plan.target.name} (←)` : "there is no sprint n+2"}
              className="flex items-center gap-1.5 rounded-full border-2 border-red-600 px-4 py-2 text-red-700 hover:bg-red-50 disabled:opacity-40"
            >
              <ArrowLeftIcon size={18} />
              <span className="hidden sm:inline">{plan.target?.name ?? "no n+2"}</span>
            </button>
            <button
              type="button"
              onClick={undo}
              disabled={deck.decisions.length === 0}
              title="undo (z)"
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm hover:bg-neutral-200 disabled:opacity-40"
            >
              <Undo2Icon size={16} /> undo
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              title={`keep in ${plan.planned.name} (→)`}
              className="flex items-center gap-1.5 rounded-full border-2 border-green-600 px-4 py-2 text-green-700 hover:bg-green-50"
            >
              <span className="hidden sm:inline">keep</span>
              <ArrowRightIcon size={18} />
            </button>
          </div>
          <p className="hidden text-center text-xs opacity-60 sm:block">
            ← / → decide · z undo · o open in Jira · or drag the card
          </p>
        </>
      )}
    </div>
  );
};
