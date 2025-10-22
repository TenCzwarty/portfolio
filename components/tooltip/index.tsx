import { Tooltip as ReactTooltip } from "react-tooltip";

import { TTooltip } from "./types";

export const Tooltip = ({ id, children, ...rest }: TTooltip) => (
  <ReactTooltip
    id={id}
    border="1px solid #ccc"
    opacity="1"
    style={{
      maxWidth: "50%",
      backgroundColor: "#fff",
      borderRadius: "0.75rem",
      color: "#000",
    }}
    role="tooltip"
    {...rest}
  >
    {children}
  </ReactTooltip>
);
