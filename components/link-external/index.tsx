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
      className={`inline-flex w-fit items-center gap-2 font-semibold text-accent-900 underline hover:text-accent-500 ${classes}`}
    >
      {label}
      <ExternalLink size="1em" className="inline" aria-hidden="true" />
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
};
