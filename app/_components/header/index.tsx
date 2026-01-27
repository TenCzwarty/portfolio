"use client";

import React from "react";

import { Logo } from "~/components/logo";

import { WebsiteColorsControl } from "./components/website-colors-control";
import { useDynamicHeaderLinks } from "./helpers/use-dynamic-header-links";

export const Header = () => {
  const link = useDynamicHeaderLinks();

  if (!link) return;

  return (
    <>
      <WebsiteColorsControl />
      <header className="absolute z-10 m-4">
        <a href={link.href} className="scale-[25%]" aria-label={link.ariaLabel}>
          <Logo className="spin" />
        </a>
      </header>
    </>
  );
};
