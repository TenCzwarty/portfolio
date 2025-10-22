import React from "react";

import { Tooltip } from "~/components/tooltip";
import { useNToggle } from "~/utils/use-toggle";

import type { TIconToggle } from "./types";

export const IconToggle = ({
  id,
  numberOfStates = 2,
  initialState = 1,
  title,
  children,
  toggleFunction,
}: TIconToggle) => {
  const [index, next] = useNToggle(numberOfStates, initialState);

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
        className={["text-neutral-500", "text-accent-900", "text-black"][index]}
      >
        {children}
      </button>
    </>
  );
};
