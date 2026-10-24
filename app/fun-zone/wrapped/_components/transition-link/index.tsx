"use client";

import Link from "next/link";

import { useWrappedContext } from "~wrapped/_context";

type TTransitionLink = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/** a link that lets the page fade out before navigating; new tabs and windows open as usual */
export const TransitionLink = ({ href, onClick, ...props }: TTransitionLink) => {
  const { navigate } = useWrappedContext();

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.defaultPrevented || isModified || event.button !== 0) return;

    event.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={onLinkClick} {...props} />;
};
