"use client";

import React from "react";

import { Range } from "~/components/range";

import { Logo } from "./components/logo";
import { useDynamicHeaderLinks } from "./helpers/use-dynamic-header-links";
import { useRandomWebsiteColors } from "./helpers/use-random-website-colors";

export const Header = () => {
  const link = useDynamicHeaderLinks();

  const { primaryHue, accentHue } = useRandomWebsiteColors();

  if (!link) return;

  return (
    <>
      <div className="absolute top-0 right-0 z-10 m-4 flex flex-col gap-2 opacity-0 duration-500 hover:opacity-100">
        <Range
          name="--primary"
          classes="text-primary-800"
          defaultValue={primaryHue}
        />
        <Range
          name="--accent"
          classes="text-accent-500"
          defaultValue={accentHue}
        />
      </div>

      <header className="absolute z-10 m-4">
        <a href={link.href} className="scale-[25%]" aria-label={link.ariaLabel}>
          <Logo />
        </a>
      </header>
    </>
  );
};
