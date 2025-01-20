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
      className={`text-accent-900 hover:text-accent-500 items-center font-semibold underline ${classes}`}
    >
      {label}
      <ExternalLink
        size="1rem"
        className="mb-1 ml-1 inline"
        aria-hidden="true"
      />
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
};
