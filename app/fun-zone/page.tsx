"use client";

import { DownloadIcon } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionController,
  AccordionToggleMoreInfo,
} from "~/components/accordion";
import { LinkExternal } from "~/components/link-external";
import { Pill } from "~/components/pill";
import { Section } from "~/components/section";

import "./_styles/styles.css";

export default function FunZonePage() {
  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mt-16 mb-8 ml-4">
          <h1 className="text-xl font-semibold sm:text-3xl">
            The Fun Zone<sup className="-top-[2.5em] text-[25%]">NTM</sup>
          </h1>
          <p>
            welcome to the place for some other, not-so-serious side-projects or
            fun things I&apos;ve found on the web
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
            <div className="flex flex-col gap-2 overflow-hidden sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  Listen to AI gushing about me
                </h3>

                <div className="text-sm">
                  created using{" "}
                  <LinkExternal
                    href="https://notebooklm.google/"
                    label="NotebookLM"
                  />
                </div>
              </div>

              <audio controls className="mx-auto sm:mx-0 rounded-xl">
                <source src="/files/fun-zone/cv.wav" type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  See my CV as a DND 5e Monster Stat Block
                </h3>
                <div className="text-sm">
                  created using{" "}
                  <LinkExternal
                    href="https://homebrewery.naturalcrit.com/"
                    label="Homebrewery"
                  />{" "}
                  and{" "}
                  <LinkExternal
                    href="https://deepai.org/machine-learning-model/fantasy-world-generator/"
                    label="DeepAI"
                  />
                </div>
              </div>
              <div>
                <a
                  id="cv"
                  href="/files/fun-zone/the-archivist.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 mx-auto sm:mx-0">
                    download <DownloadIcon size={16} className="inline" />
                  </Pill>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
            <AccordionController>
              {(accordionProps) => (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      {/* <a href="https://amasia.fourth.one/" target="_blank"> */}
                      <h3 className="heading-fantasy">Amasia</h3>
                      {/* </a> */}
                      <div className="text-sm">my worldbuilding wiki</div>
                    </div>
                    <AccordionToggleMoreInfo {...accordionProps} />
                  </div>

                  <Accordion {...accordionProps}>
                    <Link href="/fun-zone/amasia-calendar-converter">
                      <div className="mt-4 flex flex-col rounded-xl border border-neutral-200 p-4 hover:bg-neutral-200">
                        <h3 className="text-lg font-semibold sm:text-xl">
                          Amasia Calendar Converter
                        </h3>
                        <div className="text-sm">in progress...</div>
                      </div>
                    </Link>
                    <div className="mt-4 flex cursor-not-allowed flex-col rounded-xl border border-neutral-200 p-4">
                      <h3 className="text-lg font-semibold sm:text-xl">
                        Fantasy Calendar Generator
                      </h3>
                      <div className="text-sm">in progress...</div>
                    </div>
                  </Accordion>
                </>
              )}
            </AccordionController>
          </div>

          <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
            <h3 className="heading-varporwave">SANTORWAVE</h3>
            <div className="text-sm">in progress...</div>
          </div>

          <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
            <h3 className="text-lg font-semibold sm:text-xl">?</h3>
            <div className="text-sm">in progress...</div>
          </div>

          <div className="relative h-[80px] bg-linear-to-b from-transparent to-neutral-100">
            <div className="absolute -z-10 h-[80px] w-[100%] rounded-xl border border-neutral-200 p-4"></div>
          </div>
        </div>
      </Section>
    </main>
  );
}
