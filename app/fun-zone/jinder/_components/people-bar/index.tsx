import type { TUser } from "../../_types";
import { Avatar } from "../avatar";

/** accountId, or NOBODY for unassigned issues */
export type TPersonFilter = string | null;
export const NOBODY = "__nobody__";

export type TPersonStats = {
  id: string;
  user: TUser | null;
  /** decided to stay in the sprint */
  kept: number;
  /** not decided yet – still in the sprint until someone swipes left */
  pending: number;
};

type TPeopleBar = {
  people: Array<TPersonStats>;
  filter: TPersonFilter;
  onFilter: (filter: TPersonFilter) => void;
  loadImage: (url: string) => Promise<string | null>;
};

const firstName = (stats: TPersonStats) => stats.user?.displayName.split(/\s+/)[0] ?? "nikt";

export const PeopleBar = ({ people, filter, onFilter, loadImage }: TPeopleBar) => (
  <div className="flex gap-3 overflow-x-auto pb-1" role="toolbar" aria-label="filtruj po osobie">
    {people.map((stats) => {
      const active = filter === stats.id;
      const dimmed = filter !== null && !active;
      return (
        <button
          key={stats.id}
          type="button"
          onClick={() => onFilter(active ? null : stats.id)}
          aria-pressed={active}
          title={`${stats.user?.displayName ?? "nieprzypisane"}: zostaje ${stats.kept}, do przejrzenia ${stats.pending}`}
          className={`flex w-16 shrink-0 flex-col items-center gap-1 rounded-xl p-1.5 text-xs transition-opacity ${active ? "bg-neutral-200" : "hover:bg-neutral-200"} ${dimmed ? "opacity-40" : ""}`}
        >
          <span className="relative">
            <Avatar user={stats.user} loadImage={loadImage} size="size-10" />
            <span
              className={`absolute -top-1 -right-2 min-w-5 rounded-full px-1 text-center text-[11px] leading-5 font-semibold ${stats.kept ? "bg-green-600 text-white" : "bg-neutral-200"}`}
            >
              {stats.kept}
            </span>
          </span>
          <span className="w-full truncate text-center">{firstName(stats)}</span>
          <span className="opacity-60">{stats.pending ? `+${stats.pending}` : "✓"}</span>
        </button>
      );
    })}
  </div>
);
