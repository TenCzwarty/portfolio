import { LAYOUT_LINKS as ll } from "~/app/_const/links";

import type { TFooterLinks } from "./types";

export const footerLinks: TFooterLinks = {
  "/": {
    left: [ll.LINK_PAGE_PORTFOLIO, ll.LINK_PAGE_FUN_ZONE, ll.LINK_PAGE_UTILS],
    right: [ll.LINK_EXTERNAL_GITHUB, ll.LINK_EXTERNAL_CODEPEN],
  },
  "/portfolio": {
    left: [
      ll.LINK_HREF_BACK_TO_TOP,
      ll.LINK_HREF_MY_WORK,
      ll.LINK_HREF_MY_WRITING,
      ll.LINK_PAGE_FUN_ZONE,
      ll.LINK_PAGE_UTILS,
    ],
    right: [ll.LINK_EXTERNAL_GITHUB, ll.LINK_EXTERNAL_CODEPEN],
  },
  "/fun-zone": {
    left: [ll.LINK_PAGE_HOME, ll.LINK_PAGE_UTILS],
    right: [ll.LINK_EXTERNAL_GITHUB, ll.LINK_EXTERNAL_CODEPEN],
  },
  "/utils": {
    left: [ll.LINK_PAGE_HOME, ll.LINK_PAGE_FUN_ZONE],
    right: [ll.LINK_EXTERNAL_GITHUB, ll.LINK_EXTERNAL_CODEPEN],
  },
  "/utils/qr": {
    left: [ll.LINK_PAGE_HOME, ll.LINK_PAGE_FUN_ZONE, ll.LINK_PAGE_UTILS],
    right: [ll.LINK_EXTERNAL_GITHUB, ll.LINK_EXTERNAL_CODEPEN],
  },
};
