"use client";

import { ChevronDown } from "lucide-react";
import React from "react";

import type { AccordionType } from "./types";

export const Accordion = ({ children, title }: AccordionType) => {
  const [isOpened, setIsOpened] = React.useState(false);

  const classNameRotate = isOpened ? "rotate-180" : "rotate-0";

  return (
    <div className="border-neutral-200">
      <button
        className="flex w-full items-center gap-2 text-left"
        onClick={() => setIsOpened(!isOpened)}
        aria-expanded={isOpened}
        aria-controls={`accordion-${title}`}
      >
        <h3 className="pl-4 text-lg font-semibold sm:text-xl">{title}</h3>

        <ChevronDown className={`${classNameRotate}`} aria-hidden="true" />
      </button>

      {isOpened && (
        <div id={`accordion-${title}`} className="space-y-4 pt-4">
          {children}
        </div>
      )}
    </div>
  );
};
