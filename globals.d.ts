import { JSX } from "react";

import { PATHNAMES } from "~/app/_const/paths";

declare global {
  type TChildren = Readonly<{ children: React.ReactNode }>;
  type TFCWithChildren = React.FC<TChildren>;

  type TPathname = (typeof PATHNAMES)[string];

  type TLayoutLink = {
    href: string;
    ariaLabel: string;
    label?: string;
    icon?: JSX.Element;
    target?: "_blank";
  };
}

export {};
