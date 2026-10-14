import React from "react";

import type { TDay } from "../../_types";
import { formatRange } from "../../_utils/dates";
import { LIMITS } from "../../_utils/validate";

type TPlanForm = {
  start: TDay;
  end: TDay;
  /** filled in when editing an existing plan */
  initial?: { title: string; description?: string };
  onSave: (values: { title: string; description: string }) => void;
  onCancel: () => void;
};

export const PlanForm = ({ start, end, initial, onSave, onCancel }: TPlanForm) => {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4"
    >
      <h3 className="text-lg font-semibold sm:text-xl">
        {initial ? "edit plan" : "new plan"}: {formatRange(start, end)}
      </h3>
      <input
        autoFocus
        required
        maxLength={LIMITS.title}
        placeholder="e.g. trip to the mountains"
        aria-label="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md bg-white p-2 focus:outline-2"
      />
      <textarea
        rows={3}
        maxLength={LIMITS.description}
        placeholder="description (optional) — where, what to bring, links…"
        aria-label="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="resize-y rounded-md bg-white p-2 text-sm focus:outline-2"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 rounded-full px-4 py-1 text-white"
        >
          {initial ? "save" : "add"}
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
