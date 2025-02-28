import { usePathname } from "next/navigation";

import { footerLinks } from "../const/footer-links";
import { headerLinks } from "../const/header-links";
import type {
  TReturnDynamicLinks,
  TReturnFooterLinks,
  TReturnHeaderLinks,
  TPathname,
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
): pathname is TPathname => Object.keys(links).includes(pathname);

export function useDynamicLayoutLinks(type: "header"): TReturnHeaderLinks;
export function useDynamicLayoutLinks(type: "footer"): TReturnFooterLinks;

export function useDynamicLayoutLinks(type: LinksKeyType): TReturnDynamicLinks {
  const pathname = usePathname();

  const links = getLinks(type);

  return doLinksExist(links, pathname) ? links[pathname] : null;
}
