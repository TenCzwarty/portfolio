import type { TDay, TPerson, TPlan } from "../../_types";
import { addDays, formatRange } from "../../_utils/dates";

type TPlanDetails = {
  plan: TPlan;
  people: Array<TPerson>;
  availability: Record<string, Array<TDay>>;
  canEdit: boolean;
  onDelete: () => void;
  onClose: () => void;
};

export const PlanDetails = ({
  plan,
  people,
  availability,
  canEdit,
  onDelete,
  onClose,
}: TPlanDetails) => {
  const author = people.find((p) => p.id === plan.createdBy);

  const days: Array<TDay> = [];
  for (let d = plan.start; d <= plan.end; d = addDays(d, 1)) days.push(d);

  const freeAllDays = people.filter((p) => days.every((d) => availability[p.id]?.includes(d)));

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold sm:text-xl">{plan.title}</h3>
          <p className="text-sm">
            {formatRange(plan.start, plan.end)}
            {author && (
              <>
                {" · added by "}
                <span style={{ color: author.color }}>{author.name}</span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="rounded-full px-2 hover:bg-neutral-200"
        >
          ×
        </button>
      </div>

      <p className="text-sm">
        free the whole time:{" "}
        {freeAllDays.length ? (
          freeAllDays.map((p, i) => (
            <span key={p.id} style={{ color: p.color }}>
              {p.name}
              {i < freeAllDays.length - 1 ? ", " : ""}
            </span>
          ))
        ) : (
          <span className="opacity-60">nobody (yet)</span>
        )}
      </p>

      {canEdit && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${plan.title}"?`)) onDelete();
          }}
          className="w-fit rounded-full px-4 py-1 text-sm text-red-700 hover:bg-red-100"
        >
          delete plan
        </button>
      )}
    </div>
  );
};
