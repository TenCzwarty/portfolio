import { layoutLinks } from "./links";
import type { THeaderLinks } from "./types";

export const headerLinks: THeaderLinks = {
  "/": layoutLinks.LINK_HREF_MY_WORK,
  "/fun-zone": layoutLinks.LINK_PAGE_HOME,
  "/utils": layoutLinks.LINK_PAGE_HOME,
  "/utils/qr": layoutLinks.LINK_PAGE_HOME,
};
