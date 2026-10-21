import { Pill } from "~/components/pill";

import { RSVP_ANSWERS, type TPerson, type TPlan, type TRsvp } from "../../_types";
import { textColorOn } from "../../_utils/colors";
import { formatRange } from "../../_utils/dates";
import { RSVP_LABELS } from "../../_utils/rsvp";
import { Modal } from "../modal";

type TPlanDetails = {
  plan: TPlan;
  people: Array<TPerson>;
  canEdit: boolean;
  me: TPerson | null;
  onRsvp: (answer: TRsvp | null) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export const PlanDetails = ({
  plan,
  people,
  canEdit,
  me,
  onRsvp,
  onEdit,
  onDelete,
  onClose,
}: TPlanDetails) => {
  const author = people.find((p) => p.id === plan.createdBy);
  const myAnswer = me ? plan.rsvp?.[me.id] : undefined;

  const answered = RSVP_ANSWERS.map((answer) => ({
    answer,
    who: people.filter((p) => plan.rsvp?.[p.id] === answer),
  })).filter(({ who }) => who.length);

  return (
    <Modal title={plan.title} onClose={onClose}>
      <div>
        {formatRange(plan.start, plan.end)}
        {author && (
          <>
            {" · added by "}
            <span style={{ color: author.color }}>{author.name}</span>
          </>
        )}
      </div>

      {plan.description && (
        // whitespace-pre-line keeps the line breaks people typed, text stays plain (no HTML)
        <p className="break-words whitespace-pre-line">{plan.description}</p>
      )}

      {canEdit && me && (
        <div className="flex flex-wrap items-center gap-2">
          {RSVP_ANSWERS.map((answer) => (
            // same look as the mode pills: the picked one lights up, picking it again takes it back
            <button
              key={answer}
              type="button"
              aria-pressed={myAnswer === answer}
              onClick={() => onRsvp(myAnswer === answer ? null : answer)}
              className={`rounded-full px-4 py-1 ${
                myAnswer === answer
                  ? "bg-accent-500 text-primary-900"
                  : "bg-primary-900 hover:bg-accent-500 hover:text-primary-900 text-white"
              }`}
            >
              {RSVP_LABELS[answer]}
            </button>
          ))}
        </div>
      )}

      {answered.length > 0 && (
        <div className="flex flex-col gap-2">
          {answered.map(({ answer, who }) => (
            <div key={answer} className="flex flex-wrap items-center gap-2">
              <span className="w-[9ch] shrink-0 text-sm">{RSVP_LABELS[answer]}</span>
              {who.map((p) => (
                <span
                  key={p.id}
                  className="rounded-full px-3 py-0.5 text-sm"
                  style={{ background: p.color, color: textColorOn(p.color) }}
                >
                  {p.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <>
          <hr className="text-neutral-200" />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onEdit}>
              <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">edit</Pill>
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete "${plan.title}"?`)) onDelete();
              }}
            >
              <Pill classes="bg-primary-900 hover:bg-red-700">delete plan</Pill>
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};
