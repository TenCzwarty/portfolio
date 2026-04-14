"use client";

import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/components/accordion";
import { Section } from "~/components/section";
import { ElementInputs } from "~/app/utils/spin/_components/element-inputs";
import { SpinResult } from "~spin/_components/result";
import { SpinWheel } from "~spin/_components/wheel";
import { useSpinWheelContext } from "~spin/_context";

export default function UtilsSpinWheelPage() {
  const { validElements } = useSpinWheelContext();

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <AccordionController>
          {(accordionProps) => (
            <>
              <div className="mt-16 mb-8 ml-4">
                <h1 className="text-xl font-semibold sm:text-3xl">
                  Spin The Wheel
                </h1>

                <div className="flex gap-2">
                  <p>pick a random element from a list</p>
                  <AccordionExtraSettingsToggle {...accordionProps} />
                </div>

                <Accordion {...accordionProps}>
                  <div className="mt-4 -ml-4">
                    <ElementInputs />
                  </div>
                </Accordion>
              </div>

              {validElements.length > 0 && (
                <div className="flex flex-col items-center gap-6">
                  <SpinWheel />
                  <SpinResult />
                </div>
              )}
            </>
          )}
        </AccordionController>
      </Section>
    </main>
  );
}
