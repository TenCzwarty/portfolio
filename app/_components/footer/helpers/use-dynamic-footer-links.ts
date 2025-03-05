import { usePathname } from "next/navigation";

import { footerLinks } from "~/app/_components/footer/links";
import { TReturnFooterLinks } from "../types";

export function useDynamicFooterLinks(): TReturnFooterLinks {
  const pathname = usePathname();

  return Object.keys(footerLinks).includes(pathname)
    ? footerLinks[pathname]
    : null;
}
