import { Tooltip } from "react-tooltip";
import { AsteriskIcon } from "lucide-react";

import type { TTitleWithTooltip } from "./types";

export const TitleWithTooltip = ({ id, children, tooltip }: TTitleWithTooltip) => {
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

      <h2 className="mb-4 flex items-center pl-4 text-xl font-semibold sm:text-3xl">
        {children}
        {/* only the icon spins: a rotating anchor changes its box, and the tooltip would chase it */}
        <button
          id={id}
          className="ml-1 cursor-pointer self-start"
          aria-label="Show more information"
        >
          <AsteriskIcon className="spin size-[0.6em]" aria-hidden="true" />
        </button>
      </h2>
    </>
  );
};
