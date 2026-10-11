import React from "react";

import type { TPerson } from "../../_types";
import { newId, PALETTE } from "../../_utils/identity";
import { LIMITS } from "../../_utils/validate";

type TIdentityForm = {
  me: TPerson | null;
  takenColors: Array<string>;
  onSave: (person: TPerson) => void;
  onCancel?: () => void;
};

export const IdentityForm = ({ me, takenColors, onSave, onCancel }: TIdentityForm) => {
  const [name, setName] = React.useState(me?.name ?? "");
  const [color, setColor] = React.useState(
    me?.color ?? PALETTE.find((c) => !takenColors.includes(c)) ?? PALETTE[0]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ id: me?.id ?? newId(), name: name.trim(), color: color.toLowerCase() });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4"
    >
      <div>
        <h3 className="text-lg font-semibold">{me ? "zmień siebie" : "kim jesteś?"}</h3>
        <p className="text-sm">bez logowania — imię i kolor zostają tylko w tej przeglądarce</p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        imię
        <input
          autoFocus
          required
          maxLength={LIMITS.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md bg-white p-2 text-base focus:outline-2"
          style={{ outlineColor: color }}
        />
      </label>

      <div className="flex flex-col gap-1 text-sm">
        kolor
        <div className="flex flex-wrap items-center gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`kolor ${c}`}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className={`relative size-8 rounded-full border-2 ${color === c ? "border-primary-900" : "border-transparent"}`}
              style={{ background: c }}
            >
              {takenColors.includes(c) && color !== c && (
                <span className="absolute inset-0 m-auto size-2 rounded-full bg-white/80" />
              )}
            </button>
          ))}
          <input
            type="color"
            aria-label="własny kolor"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="size-8 cursor-pointer rounded-full bg-transparent"
          />
        </div>
        <span className="text-xs opacity-70">kropka = kolor już zajęty przez kogoś</span>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 rounded-full px-4 py-1 text-white"
        >
          zapisz
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-1 hover:bg-neutral-200"
          >
            anuluj
          </button>
        )}
      </div>
    </form>
  );
};
