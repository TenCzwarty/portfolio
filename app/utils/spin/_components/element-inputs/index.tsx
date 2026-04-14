"use client";

import { PlusIcon, XIcon } from "lucide-react";

import { Pill } from "~/components/pill";

import { useSpinWheelContext } from "~spin/_context";

export const ElementInputs = () => {
  const { elements, addElement, removeElement, updateElement } =
    useSpinWheelContext();

  return (
    <div className="w-full space-y-2 rounded-xl border border-neutral-200 p-4">
      {elements.map((element, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={element}
            onChange={(e) => updateElement(index, e.target.value)}
            placeholder={`element ${index + 1}`}
            className="w-full rounded-md bg-white p-3 text-sm"
          />
          <button
            onClick={() => removeElement(index)}
            className="rounded-md p-2 hover:bg-neutral-200"
            aria-label="Remove element"
          >
            <XIcon size={16} />
          </button>
        </div>
      ))}

      <div className="pt-1">
        <button onClick={addElement}>
          <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
            add element <PlusIcon size={14} className="inline" />
          </Pill>
        </button>
      </div>
    </div>
  );
};
