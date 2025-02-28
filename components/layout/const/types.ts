import { JSX } from "react";

export type TPathname = "/" | "/fun-zone" | "/utils" | "/utils/qr";

type TLayoutLink = {
  href: string;
  ariaLabel: string;
  label?: string;
  icon?: JSX.Element;
  target?: "_blank";
};

type TLayoutFooterLinks = {
  left: Array<TLayoutLink>;
  right: Array<TLayoutLink>;
};

export type TLayoutLinks = Record<string, TLayoutLink>;
export type THeaderLinks = Record<TPathname, TLayoutLink>;
export type TFooterLinks = Record<TPathname, TLayoutFooterLinks>;

export type TReturnHeaderLinks = TLayoutLink | null;
export type TReturnFooterLinks = TLayoutFooterLinks | null;

export type TReturnDynamicLinks = TReturnHeaderLinks | TReturnFooterLinks;
