import React from "react";

import { Tooltip } from "~/components/tooltip";

import type { TButtonWithTooltip } from "./types";

export const ButtonWithTooltip = ({
  id,
  title,
  children,
  onClick,
}: TButtonWithTooltip) => (
  <>
    <Tooltip id={id}>{title || id}</Tooltip>

    <button
      data-tooltip-id={id}
      onClick={onClick}
    >
      {children}
    </button>
  </>
);

