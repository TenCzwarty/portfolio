import { ExternalLink } from "lucide-react";

import type { LinkExternalType } from "./types";

export const LinkExternal = ({ href, label, classes }: LinkExternalType) => {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`items-center font-semibold text-lime-700 underline hover:text-lime-500 ${classes}`}
    >
      {label}
      <ExternalLink size="1rem" className="mb-1 ml-1 inline" />
    </a>
  );
};
