import { Tooltip } from "react-tooltip";

import type { TitleWithTooltipType } from "./types";

export const TitleWithTooltip = ({
  id,
  children,
  tooltip,
}: TitleWithTooltipType) => {
  return (
    <>
      <Tooltip
        anchorSelect={`#${id}`}
        clickable
        border="1px solid #000"
        opacity="1"
        style={{
          maxWidth: "50%",
          backgroundColor: "#fff",
          borderRadius: "0.75rem",
          color: "#000",
        }}
        role="tooltip"
      >
        {tooltip}
      </Tooltip>

      <h2 className="mb-4 flex items-center pl-4 text-3xl font-bold">
        {children}
        <button
          id={id}
          className="ml-2 cursor-pointer"
          aria-label="Show more information"
        >
          *
        </button>
      </h2>
    </>
  );
};
