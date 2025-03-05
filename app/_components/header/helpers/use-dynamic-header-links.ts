import { usePathname } from "next/navigation";

import { headerLinks } from "~/app/_components/header/links";

import type { TReturnHeaderLinks } from "../types";

export function useDynamicHeaderLinks(): TReturnHeaderLinks {
  const pathname = usePathname();

  return Object.keys(headerLinks).includes(pathname)
    ? headerLinks[pathname]
    : null;
}
