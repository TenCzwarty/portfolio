import { LAYOUT_LINKS as ll } from "~/app/_const/links";

import type { THeaderLinks } from "./types";

export const headerLinks: THeaderLinks = {
  "/": ll.LINK_PAGE_PORTFOLIO,
  "/portfolio": ll.LINK_HREF_MY_WORK,
  "/fun-zone": ll.LINK_PAGE_HOME,
  "/fun-zone/amasia-calendar-converter": ll.LINK_PAGE_FUN_ZONE,
  "/utils": ll.LINK_PAGE_HOME,
  "/utils/qr": ll.LINK_PAGE_UTILS,
  "/utils/hanayama": ll.LINK_PAGE_UTILS,
  "/utils/meeple-circus": ll.LINK_PAGE_UTILS,
};
