import type { TPerson } from "../../../_types";
import { textColorOn } from "../../../_utils/colors";

type TNoteVotes = {
  voters: Array<TPerson>;
  me: TPerson | null;
  onToggle: () => void;
};

const MAX_DOTS = 5;

export const NoteVotes = ({ voters, me, onToggle }: TNoteVotes) => {
  const iWant = voters.some((p) => p.id === me?.id);
  const hidden = voters.length - MAX_DOTS;

  return (
    <div className="flex items-center justify-between gap-2">
      {me ? (
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={iWant}
          aria-label={iWant ? "take back your +1" : "+1, I want this too"}
          className={`rounded-full border border-black px-2 text-xs leading-5 ${iWant ? "bg-black text-white" : "text-black hover:bg-black/10"}`}
        >
          +1
        </button>
      ) : (
        <span />
      )}

      <span className="flex pl-1">
        {voters.slice(0, MAX_DOTS).map((p) => (
          <span
            key={p.id}
            title={p.name}
            className="-ml-1 flex size-5 items-center justify-center rounded-full text-[11px] uppercase"
            style={{ background: p.color, color: textColorOn(p.color) }}
          >
            {p.name[0]}
          </span>
        ))}
        {hidden > 0 && (
          <span className="-ml-1 flex size-5 items-center justify-center rounded-full bg-black text-[11px] text-white">
            +{hidden}
          </span>
        )}
      </span>
    </div>
  );
};
