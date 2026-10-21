import React from "react";

import type { TPerson } from "../../_types";
import { findByName, newId, PALETTE } from "../../_utils/identity";
import { LIMITS } from "../../_utils/validate";

type TIdentityForm = {
  me: TPerson | null;
  people: Array<TPerson>;
  onSave: (person: TPerson) => void;
  onCancel?: () => void;
  /** inside the settings box: no frame or heading of its own */
  embedded?: boolean;
  /** extra buttons in the save / cancel row */
  extraActions?: React.ReactNode;
};

export const IdentityForm = ({
  me,
  people,
  onSave,
  onCancel,
  embedded = false,
  extraActions,
}: TIdentityForm) => {
  const others = people.filter((p) => p.id !== me?.id);
  const takenColors = others.map((p) => p.color);

  const [name, setName] = React.useState(me?.name ?? "");
  const [color, setColor] = React.useState(
    me?.color ?? PALETTE.find((c) => !takenColors.includes(c)) ?? PALETTE[0]
  );

  // typing an existing name means "that's me" - take over that entry instead of duplicating it
  const namesake = findByName(others, name);

  const onChangeName = (value: string) => {
    setName(value);
    const match = findByName(others, value);
    if (match) setColor(match.color);
  };

  // one color per person, so dots and bars stay readable - joining a namesake takes theirs over
  const isTaken = (c: string) =>
    takenColors.includes(c.toLowerCase()) && namesake?.color !== c.toLowerCase();
  const isCustom = !PALETTE.includes(color);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isTaken(color)) return;
    onSave({
      id: namesake?.id ?? me?.id ?? newId(),
      name: namesake?.name ?? name.trim(),
      color: color.toLowerCase(),
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-4 ${embedded ? "" : "rounded-xl border border-neutral-200 p-4"}`}
    >
      {!embedded && <h3 className="text-lg font-semibold sm:text-xl">who are you?</h3>}

      {!me && others.length > 0 && (
        <div className="flex flex-col gap-1 text-sm">
          already here? pick yourself
          <div className="flex flex-wrap gap-2">
            {others.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChangeName(p.name)}
                aria-pressed={namesake?.id === p.id}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${namesake?.id === p.id ? "border-primary-900" : "border-neutral-200 hover:bg-neutral-200"}`}
              >
                <span className="size-3 rounded-full" style={{ background: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* name and colors side by side once there's room */}
      <div className="grid gap-4 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-1 text-sm">
          <input
            autoFocus
            required
            type="text"
            placeholder="name"
            aria-label="name"
            maxLength={LIMITS.name}
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full rounded-md bg-white p-4 text-base focus:outline-2"
            style={{ outlineColor: color }}
          />
          {namesake && (
            <span className="opacity-70">
              you&apos;ll join the existing &quot;{namesake.name}&quot; — with their days and plans
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`color ${c}${isTaken(c) ? ", taken" : ""}`}
              aria-pressed={color === c}
              disabled={isTaken(c)}
              onClick={() => setColor(c)}
              className={`size-8 rounded-full border-2 ${color === c ? "border-primary-900" : "border-transparent"} disabled:cursor-not-allowed disabled:opacity-20`}
              style={{ background: c }}
            />
          ))}
          {/* the native picker hides behind a pill, so it doesn't pass for one more swatch */}
          <label
            className={`flex cursor-pointer items-center gap-2 rounded-full border-2 px-3 py-1 text-sm ${isCustom ? "border-primary-900" : "border-neutral-300 hover:bg-neutral-200"}`}
          >
            {isCustom && <span className="size-3 rounded-full" style={{ background: color }} />}
            custom
            <input
              type="color"
              value={color}
              onChange={(e) => !isTaken(e.target.value) && setColor(e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 rounded-full px-4 py-1 text-white"
        >
          save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-1 hover:bg-neutral-200"
          >
            cancel
          </button>
        )}
        {extraActions}
      </div>
    </form>
  );
};
