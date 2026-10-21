import type { TPerson } from "../../_types";
import { textColorOn } from "../../_utils/colors";

type TLegend = {
  people: Array<TPerson>;
  me: TPerson | null;
  /** person whose things stay bright on the calendar, everything else fades */
  highlightId: string | null;
  onHighlight: (personId: string | null) => void;
  /** your own pill opens the name / color editor */
  onEditMe?: () => void;
};

const pill = "flex w-fit items-center rounded-full px-4 py-1 text-sm transition-opacity";

export const Legend = ({ people, me, highlightId, onHighlight, onEditMe }: TLegend) => {
  if (!people.length) return null;

  return (
    <ul className="flex flex-wrap gap-2" onMouseLeave={() => onHighlight(null)}>
      {people.map((p) => {
        const isMine = p.id === me?.id && onEditMe;
        return (
          <li key={p.id}>
            <button
              type="button"
              // hover highlights on desktop; a tap does it on phones, where there's no hover
              onMouseEnter={() => onHighlight(p.id)}
              onFocus={() => onHighlight(p.id)}
              onBlur={() => onHighlight(null)}
              onClick={() =>
                isMine ? onEditMe() : onHighlight(highlightId === p.id ? null : p.id)
              }
              aria-pressed={isMine ? undefined : highlightId === p.id}
              title={isMine ? "change your name or color" : `show only ${p.name}`}
              className={`${pill} ${isMine ? "font-semibold" : ""} ${highlightId && highlightId !== p.id ? "opacity-30" : ""}`}
              style={{ background: p.color, color: textColorOn(p.color) }}
            >
              {p.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
