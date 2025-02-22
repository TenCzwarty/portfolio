import { JSX } from "react";

export type PathnameType = "/" | "/fun-zone" | "/utils" | "/utils/qr";

export type LayoutLinkType = {
  href: string;
  ariaLabel: string;
  label?: string;
  icon?: JSX.Element;
  target?: "_blank";
};

type LayoutFooterLinksType = {
  left: Array<LayoutLinkType>;
  right: Array<LayoutLinkType>;
};

export type LayoutLinksType = Record<string, LayoutLinkType>;
export type HeaderLinksType = Record<PathnameType, LayoutLinkType>;
export type FooterLinksType = Record<PathnameType, LayoutFooterLinksType>;

export type HeaderLinksReturnType = LayoutLinkType | null;
export type FooterLinksReturnType = LayoutFooterLinksType | null;

export type DynamicLinksReturnType =
  | HeaderLinksReturnType
  | FooterLinksReturnType;
