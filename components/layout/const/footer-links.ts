import { layoutLinks as ll } from "./links";

import { FooterLinksType } from "./types";

export const footerLinks: FooterLinksType = {
  "/": {
    left: [
      ll.LINK_HREF_BACK_TO_TOP,
      ll.LINK_HREF_MY_WORK,
      ll.LINK_HREF_MY_WRITING,
      ll.LINK_PAGE_FUN_ZONE,
    ],
    right: [ll.LINK_EXTERNAL_CODEPEN],
  },
  "/fun-zone": { left: [ll.LINK_PAGE_HOME], right: [ll.LINK_EXTERNAL_CODEPEN] },
};
