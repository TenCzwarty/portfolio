import React from "react";

import type { TPerson } from "../../_types";
import { findByName, newId, PALETTE } from "../../_utils/identity";
import { LIMITS } from "../../_utils/validate";

type TIdentityForm = {
  me: TPerson | null;
  people: Array<TPerson>;
  onSave: (person: TPerson) => void;
  onCancel?: () => void;
};

export const IdentityForm = ({ me, people, onSave, onCancel }: TIdentityForm) => {
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: namesake?.id ?? me?.id ?? newId(),
      name: namesake?.name ?? name.trim(),
      color: color.toLowerCase(),
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4"
    >
      <div>
        <h3 className="text-lg font-semibold sm:text-xl">
          {me ? "change name or color" : "who are you?"}
        </h3>
        <p className="text-sm">
          no login — your name and color are remembered in this browser only
        </p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        name
        <input
          autoFocus
          required
          maxLength={LIMITS.name}
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          className="rounded-md bg-white p-2 text-base focus:outline-2"
          style={{ outlineColor: color }}
        />
        {namesake && (
          <span className="opacity-70">
            you&apos;ll join the existing &quot;{namesake.name}&quot; — with their days and plans
          </span>
        )}
      </label>

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

      <div className="flex flex-col gap-1 text-sm">
        color
        <div className="flex flex-wrap items-center gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`color ${c}`}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className={`relative size-8 rounded-full border-2 ${color === c ? "border-primary-900" : "border-transparent"}`}
              style={{ background: c }}
            >
              {takenColors.includes(c) && color !== c && namesake?.color !== c && (
                <span className="absolute inset-0 m-auto size-2 rounded-full bg-white/80" />
              )}
            </button>
          ))}
          <input
            type="color"
            aria-label="custom color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="size-8 cursor-pointer rounded-full bg-transparent"
          />
        </div>
        <span className="opacity-70">dot = color already taken</span>
      </div>

      <div className="flex gap-2">
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
      </div>
    </form>
  );
};
