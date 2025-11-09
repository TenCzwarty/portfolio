"use client";
import React from "react";

import { Section } from "~/components/section";

import "~amasia/styles.css";

import { GoldenDateInputs } from "~amasia/_components/date-golden";
import { DateIronInput } from "~amasia/_components/date-iron";
import { SandDateInputs } from "~amasia/_components/date-sand";
import { SilverDateInputs } from "~amasia/_components/date-silver";
import { SimpleDateInputs } from "~amasia/_components/date-simple";
import { getMoonPhaseIcon } from "~amasia/_components/moon-phases";
import AMASIA_LG_RESETS from "~amasia/_const/amasia-lg-resets.json";
import AMASIA_MD_RESETS from "~amasia/_const/amasia-md-resets.json";
import AMASIA_SM_RESETS from "~amasia/_const/amasia-sm-resets.json";
import { useAmasiaCalendarConverterContext } from "~amasia/_context";

export default function FunZoneAmasiaCalendarConverterPage() {
  const { day, onChangeDay } = useAmasiaCalendarConverterContext();

  const getSMPhase = () => getMoonPhaseIcon(AMASIA_SM_RESETS, day);
  const getMDPhase = () => getMoonPhaseIcon(AMASIA_MD_RESETS, day);
  const getLGPhase = () => getMoonPhaseIcon(AMASIA_LG_RESETS, day);

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mt-16 mb-8 ml-4">
          <h1 className="text-xl font-semibold sm:text-3xl">
            Amasia Calendar Converter
          </h1>
          <p>quickly convert dates in Amasia</p>
        </div>

        <div className="space-y-4">
          <div className="flex w-full flex-col space-y-4 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h3>day number</h3>
              <div className="flex">
                <input
                  type="number"
                  min={1}
                  placeholder="day number"
                  value={day}
                  onChange={onChangeDay}
                  style={{
                    width: `calc(16px + ${String(day).length + "ch"})`,
                  }}
                  className="[appearance:textfield] rounded-md bg-white p-2 text-center focus:outline-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="font-kaleagnetta grid grid-cols-3 gap-4 rounded-xl border border-neutral-200 p-4 text-4xl lg:w-[50%]">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-full">{getSMPhase()}</div>
                <h3>Vire</h3>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-full">{getMDPhase()}</div>
                <h3>Emers</h3>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-full">{getLGPhase()}</div>
                <h3>Pelosse</h3>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-4">
            <div>
              <div className="flex items-center justify-between">
                <h3>iron calendar</h3>
                <div className="rounded-md bg-white">
                  <DateIronInput />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h3>simple calendar</h3>
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊚</span>
                <SimpleDateInputs.sm />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊖</span>
                <SimpleDateInputs.md />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊗</span>
                <SimpleDateInputs.lg />
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h3>light silver calendar</h3>
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊚</span>
                <SilverDateInputs.light.sm />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊖</span>
                <SilverDateInputs.light.md />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊗</span>
                <SilverDateInputs.light.lg />
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h3>dark silver calendar</h3>
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊚</span>
                <SilverDateInputs.dark.sm />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊖</span>
                <SilverDateInputs.dark.md />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊗</span>
                <SilverDateInputs.dark.lg />
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h3>golden calendar</h3>
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊚</span>
                <GoldenDateInputs.sm />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊖</span>
                <GoldenDateInputs.md />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊗</span>
                <GoldenDateInputs.lg />
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h3>sand calendar</h3>
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊚</span>
                <SandDateInputs.sm />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊖</span>
                <SandDateInputs.md />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-md bg-white">
                <span className="inline-block pl-2 text-xl">⊗</span>
                <SandDateInputs.lg />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
