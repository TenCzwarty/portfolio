import { ChevronDownIcon, SettingsIcon } from "lucide-react";

import { useToggle } from "~/utils/use-toggle";

import type {
  TAccordionController,
  TAccordion,
  TAccordionToggleExtraSettings,
  TAccordionToggleMoreInfo,
} from "./types";

export const AccordionController = ({ children }: TAccordionController) => {
  const [isOpened, toggleIsOpened] = useToggle(false);

  return children({ isOpened, toggleIsOpened });
};

export const Accordion = ({ children, isOpened }: TAccordion) => (
  <div className={isOpened ? "" : "hidden"} aria-expanded={isOpened}>
    {children}
  </div>
);

export const AccordionExtraSettingsToggle = ({
  isOpened,
  toggleIsOpened,
}: TAccordionToggleExtraSettings) => (
  <button
    onClick={toggleIsOpened}
    className="spin"
    aria-label={`${isOpened ? "Hide" : "Show"} extra settings`}
  >
    <SettingsIcon />
  </button>
);

export const AccordionToggleMoreInfo = ({
  name,
  isOpened,
  toggleIsOpened,
}: TAccordionToggleMoreInfo) => (
  <button
    onClick={toggleIsOpened}
    className="flex gap-2"
    aria-label={`${isOpened ? "Hide" : "Show"} extra settings`}
  >
    {name}
    <ChevronDownIcon
      className={isOpened ? "rotate-180" : "rotate-0"}
      aria-hidden="true"
    />
  </button>
);
