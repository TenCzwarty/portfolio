"use client";

import Link from "next/link";

import { useDynamicFooterLinks } from "./helpers/use-dynamic-footer-links";

export const Footer = () => {
  const links = useDynamicFooterLinks();

  if (!links) return;

  return (
    <footer className="bg-primary-900 text-white">
      <div className="mx-auto flex justify-between px-8 py-4 sm:max-w-[calc(200dvw/3)] sm:px-4">
        <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:gap-6">
          {links.left?.map(({ href, ariaLabel, label }) => (
            <Link key={href} href={href} aria-label={ariaLabel}>
              {label}
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          {links.right?.map(({ href, ariaLabel, icon, target }) => (
            <Link key={href} href={href} aria-label={ariaLabel} target={target}>
              {icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
