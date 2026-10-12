import React from "react";
import { RefreshCwIcon, TriangleAlertIcon } from "lucide-react";

import type { TBoard, TJiraClient, TSprint } from "../../_types";
import { readStorage, STORAGE, writeStorage } from "../../_utils/storage";
import type { TPlan } from "../../_utils/use-deck";

type TSprintSetup = {
  client: TJiraClient;
  onStart: (plan: TPlan) => void;
  onError: (message: string) => void;
};

const selectClass = "rounded-md bg-white p-2 focus:outline-2";

const Warning = ({ children }: TChildren) => (
  <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
    <TriangleAlertIcon size={16} className="mt-0.5 shrink-0" />
    <div>{children}</div>
  </div>
);

export const SprintSetup = ({ client, onStart, onError }: TSprintSetup) => {
  const [query, setQuery] = React.useState("");
  const [boards, setBoards] = React.useState<Array<TBoard>>([]);
  const [boardId, setBoardId] = React.useState(() => Number(readStorage(STORAGE.board)) || 0);
  const [sprints, setSprints] = React.useState<Array<TSprint> | null>(null);
  const [plannedId, setPlannedId] = React.useState(0);
  const [targetId, setTargetId] = React.useState(0);
  const [spilledFirst, setSpilledFirst] = React.useState(true);

  React.useEffect(() => {
    let stale = false;
    const timeout = window.setTimeout(async () => {
      try {
        const list = await client.boards(query.trim());
        if (stale) return;
        setBoards(list);
        if (list.length === 1) setBoardId(list[0].id);
      } catch (e) {
        if (!stale) onError(e instanceof Error ? e.message : "Nie udało się pobrać boardów");
      }
    }, 300);
    return () => {
      stale = true;
      window.clearTimeout(timeout);
    };
  }, [client, query, onError]);

  const loadSprints = React.useCallback(async () => {
    if (!boardId) return;
    setSprints(null);
    try {
      const list = await client.sprints(boardId);
      setSprints(list);
      // after closing sprint n, the first future sprint is n+1 and the one after it n+2
      const futureIndex = list.findIndex((s) => s.state === "future");
      const planned = list[futureIndex === -1 ? list.length - 1 : futureIndex];
      const target = planned ? list[list.indexOf(planned) + 1] : undefined;
      setPlannedId(planned?.id ?? 0);
      setTargetId(target?.id ?? 0);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Nie udało się pobrać sprintów");
    }
  }, [client, boardId, onError]);

  React.useEffect(() => {
    if (boardId) writeStorage(STORAGE.board, String(boardId));
    loadSprints();
  }, [boardId, loadSprints]);

  const planned = sprints?.find((s) => s.id === plannedId) ?? null;
  const target = sprints?.find((s) => s.id === targetId && s.id !== plannedId) ?? null;
  const stillActive = sprints?.find((s) => s.state === "active" && s.id !== plannedId);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4">
      <h3 className="text-lg font-semibold sm:text-xl">co planujemy?</h3>

      <label className="flex flex-col gap-1 text-sm">
        board
        <div className="flex flex-col gap-2 sm:flex-row">
          {!client.demo && (
            <input
              placeholder="filtruj po nazwie"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${selectClass} sm:w-48`}
            />
          )}
          <select
            value={boardId}
            onChange={(e) => setBoardId(Number(e.target.value))}
            className={`${selectClass} flex-1`}
          >
            <option value={0}>— wybierz board —</option>
            {/* keep the remembered board selectable even when the filter hides it */}
            {boardId > 0 && !boards.some((b) => b.id === boardId) && (
              <option value={boardId}>board #{boardId}</option>
            )}
            {boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
                {b.projectKey ? ` (${b.projectKey})` : ""}
              </option>
            ))}
          </select>
        </div>
      </label>

      {boardId > 0 && !sprints && (
        <div className="h-24 animate-pulse rounded-xl bg-neutral-200/60" />
      )}

      {sprints && sprints.length === 0 && (
        <Warning>Ten board nie ma aktywnych ani przyszłych sprintów.</Warning>
      )}

      {sprints && sprints.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              przeglądamy sprint (n+1)
              <select
                value={plannedId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setPlannedId(id);
                  setTargetId(sprints[sprints.findIndex((s) => s.id === id) + 1]?.id ?? 0);
                }}
                className={selectClass}
              >
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.state === "active" ? " (aktywny)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              swipe w lewo przenosi do (n+2)
              <select
                value={target ? targetId : 0}
                onChange={(e) => setTargetId(Number(e.target.value))}
                className={selectClass}
              >
                <option value={0}>— brak —</option>
                {sprints
                  .filter((s) => s.id !== plannedId)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          {stillActive && planned?.state === "future" && (
            <Warning>
              {stillActive.name} jest nadal aktywny. Zamknij go najpierw w Jirze i przenieś
              niedokończone taski do {planned.name}, inaczej nie pojawią się w talii.
            </Warning>
          )}

          {!target && (
            <Warning>
              <p>
                Nie ma sprintu po {planned?.name ?? "wybranym"}, więc swipe w lewo nie będzie
                działał. Utwórz go w Jirze (Backlog → Create sprint) i odśwież listę.
              </p>
              <button
                type="button"
                onClick={loadSprints}
                className="mt-2 flex items-center gap-1 rounded-full border border-amber-300 px-3 py-0.5 hover:bg-amber-100"
              >
                <RefreshCwIcon size={14} /> odśwież sprinty
              </button>
            </Warning>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={spilledFirst}
              onChange={(e) => setSpilledFirst(e.target.checked)}
            />
            najpierw taski, które spadły z poprzedniego sprintu
          </label>

          <button
            type="button"
            disabled={!planned}
            onClick={() => planned && onStart({ boardId, planned, target, spilledFirst })}
            className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 self-start rounded-full px-4 py-1 text-white disabled:opacity-50"
          >
            zaczynamy
          </button>
        </>
      )}
    </div>
  );
};
