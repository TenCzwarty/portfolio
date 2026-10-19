import type { TIssueSummary, TSprint } from "../../_types";

type TSummary = {
  issues: Array<TIssueSummary>;
  decisions: Array<{ key: string; keep: boolean; failed?: string }>;
  planned: TSprint;
  target: TSprint | null;
  site: string;
  onRetry: (key: string) => void;
  onUndo: () => void;
  onRestart: () => void;
};

export const Summary = ({
  issues,
  decisions,
  planned,
  target,
  site,
  onRetry,
  onUndo,
  onRestart,
}: TSummary) => {
  const byKey = new Map(issues.map((issue) => [issue.key, issue]));
  const kept = decisions.filter((d) => d.keep);
  const moved = decisions.filter((d) => !d.keep);

  const List = ({ items }: { items: typeof decisions }) => (
    <ul className="space-y-1 text-sm">
      {items.map((d) => (
        <li key={d.key} className="flex flex-wrap items-center gap-x-2">
          <a
            href={`https://${site}/browse/${d.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            {d.key}
          </a>
          <span>{byKey.get(d.key)?.summary}</span>
          {d.failed && (
            <>
              <span className="text-red-700">not moved: {d.failed}</span>
              <button
                type="button"
                onClick={() => onRetry(d.key)}
                className="rounded-full border border-red-300 px-2 text-xs text-red-800 hover:bg-red-50"
              >
                retry
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-neutral-200 p-4">
      <h3 className="text-lg font-semibold sm:text-xl">
        {issues.length === 0 ? `${planned.name} is empty` : "that's all"}
      </h3>

      {issues.length > 0 && (
        <>
          <section>
            <h4 className="mb-2 font-semibold">
              kept in {planned.name}: {kept.length}
            </h4>
            {kept.length ? <List items={kept} /> : <p className="text-sm opacity-60">nothing</p>}
          </section>
          <section>
            <h4 className="mb-2 font-semibold">
              moved to {target?.name ?? "the next sprint"}: {moved.length}
            </h4>
            {moved.length ? <List items={moved} /> : <p className="text-sm opacity-60">nothing</p>}
          </section>
        </>
      )}

      <div className="flex flex-wrap gap-2">
        {decisions.length > 0 && (
          <button
            type="button"
            onClick={onUndo}
            className="rounded-full border border-neutral-200 px-4 py-1 hover:bg-neutral-200"
          >
            undo last
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 rounded-full px-4 py-1 text-white"
        >
          review the sprint again
        </button>
      </div>
    </div>
  );
};
