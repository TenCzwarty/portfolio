import { usePathname } from "next/navigation";

import { footerLinks } from "../const/footer-links";
import { headerLinks } from "../const/header-links";
import {
  DynamicLinksReturnType,
  FooterLinksReturnType,
  HeaderLinksReturnType,
  PathnameType,
} from "../const/types";

type LinksKeyType = "header" | "footer";

const getLinks = (type: LinksKeyType) =>
  ({
    header: headerLinks,
    footer: footerLinks,
  })[type];

const doLinksExist = (
  links: ReturnType<typeof getLinks>,
  pathname: string,
): pathname is PathnameType => Object.keys(links).includes(pathname);

export function useDynamicLayoutLinks(type: "header"): HeaderLinksReturnType;
export function useDynamicLayoutLinks(type: "footer"): FooterLinksReturnType;

export function useDynamicLayoutLinks(
  type: LinksKeyType,
): DynamicLinksReturnType {
  const pathname = usePathname();

  const links = getLinks(type);

  return doLinksExist(links, pathname) ? links[pathname] : null;
}
