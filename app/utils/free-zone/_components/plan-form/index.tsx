import React from "react";

import { Pill } from "~/components/pill";

import type { TDay } from "../../_types";
import { formatRange } from "../../_utils/dates";
import { LIMITS } from "../../_utils/validate";

type TPlanForm = {
  start: TDay;
  end: TDay;
  /** filled in when editing an existing plan */
  initial?: { title: string; description?: string };
  /** inside a modal: no frame of its own, the modal carries the title */
  embedded?: boolean;
  onSave: (values: { title: string; description: string }) => void;
  onCancel: () => void;
};

export const PlanForm = ({
  start,
  end,
  initial,
  embedded = false,
  onSave,
  onCancel,
}: TPlanForm) => {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-4 ${embedded ? "" : "rounded-xl border border-neutral-200 p-4"}`}
    >
      {embedded ? (
        <div>{formatRange(start, end)}</div>
      ) : (
        <h3 className="text-lg font-semibold sm:text-xl">
          {initial ? "edit plan" : "new plan"}: {formatRange(start, end)}
        </h3>
      )}
      {/* same field size as the inputs on /qr */}
      <input
        autoFocus
        required
        type="text"
        maxLength={LIMITS.title}
        placeholder="e.g. trip to the mountains"
        aria-label="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md bg-white p-4 focus:outline-2"
      />
      <textarea
        rows={3}
        maxLength={LIMITS.description}
        placeholder="description (optional) — where, what to bring, links…"
        aria-label="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full resize-y rounded-md bg-white p-4 focus:outline-2"
      />
      <div className="flex gap-2">
        <button type="submit">
          <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
            {initial ? "save" : "add"}
          </Pill>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-1 hover:bg-neutral-200"
        >
          cancel
        </button>
      </div>
    </form>
  );
};
