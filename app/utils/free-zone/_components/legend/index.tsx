import type { TPerson } from "../../_types";
import { textColorOn } from "../../_utils/colors";

type TLegend = {
  people: Array<TPerson>;
  me: TPerson | null;
  /** your own pill opens the name / color editor */
  onEditMe?: () => void;
};

const pill = "flex w-fit items-center rounded-full px-4 py-1 text-sm";

export const Legend = ({ people, me, onEditMe }: TLegend) => {
  if (!people.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {people.map((p) => {
        const style = { background: p.color, color: textColorOn(p.color) };
        return (
          <li key={p.id}>
            {p.id === me?.id && onEditMe ? (
              <button
                type="button"
                onClick={onEditMe}
                title="change your name or color"
                className={`${pill} font-semibold hover:brightness-110`}
                style={style}
              >
                {p.name}
              </button>
            ) : (
              <span className={pill} style={style}>
                {p.name}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
