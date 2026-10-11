import type { TDay, TPerson } from "../../_types";

type TLegend = {
  people: Array<TPerson>;
  availability: Record<string, Array<TDay>>;
  monthDays: Array<TDay>;
  me: TPerson | null;
};

export const Legend = ({ people, availability, monthDays, me }: TLegend) => {
  if (!people.length) return null;

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {people.map((p) => {
        const count = monthDays.filter((d) => availability[p.id]?.includes(d)).length;
        return (
          <li key={p.id} className="flex items-center gap-1.5">
            <span className="size-3 rounded-full" style={{ background: p.color }} />
            <span className={p.id === me?.id ? "font-semibold" : ""}>{p.name}</span>
            <span className="opacity-60">({count} dni)</span>
          </li>
        );
      })}
    </ul>
  );
};
