import { Pill } from "~/components/pill";

import type { TPerson, TPlan } from "../../_types";
import { formatRange } from "../../_utils/dates";
import { Modal } from "../modal";

type TPlanDetails = {
  plan: TPlan;
  people: Array<TPerson>;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export const PlanDetails = ({ plan, people, canEdit, onEdit, onDelete, onClose }: TPlanDetails) => {
  const author = people.find((p) => p.id === plan.createdBy);

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

      {canEdit && (
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
      )}
    </Modal>
  );
};
