"use client";

import { Logo } from "~/components/logo";
import { Range } from "~/components/range";

import { useDynamicLayoutLinks } from "../../helpers/use-dynamic-layout-links";

export const Header = () => {
  const link = useDynamicLayoutLinks("header");

  if (!link) return;

  return (
    <>
      <div className="absolute right-0 top-0 z-10 m-4 flex flex-col gap-2 opacity-0 duration-500 hover:opacity-100">
        <Range name="--primary" classes="text-primary-800" defaultValue={157} />
        <Range name="--accent" classes="text-accent-500" defaultValue={348} />
      </div>

      <header className="absolute z-10 m-4">
        <a href={link.href} className="scale-[25%]" aria-label={link.ariaLabel}>
          <Logo />
        </a>
      </header>
    </>
  );
};
