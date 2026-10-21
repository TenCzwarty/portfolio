import React from "react";

import { Tooltip } from "~/components/tooltip";
import { useNToggle } from "~/utils/use-toggle";

import type { TIconToggle } from "./types";

export const IconToggle = ({
  id,
  numberOfStates = 2,
  initialState = 1,
  state,
  title,
  children,
  toggleFunction,
}: TIconToggle) => {
  const [ownIndex, next] = useNToggle(numberOfStates, initialState);
  const index = state ?? ownIndex;

  const onClick = () => {
    next();
    toggleFunction();
  };

  return (
    <>
      <Tooltip id={id}>{title || id}</Tooltip>

      <button
        data-tooltip-id={id}
        onClick={onClick}
        aria-pressed={numberOfStates === 2 ? index === 1 : undefined}
        className={["text-neutral-500", "text-accent-900", "text-black"][index]}
      >
        {children}
      </button>
    </>
  );
};
