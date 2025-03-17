"use client";

import React from "react";
import { DownloadIcon } from "lucide-react";

import { Box, Boxes } from "~/app/_components/box";
import { BoxMiddle } from "~/app/_components/box/middle";
import { myWritingMapper } from "~/app/_components/box-article";
import { myWorkWrapper } from "~/app/_components/box-my-work";
import { TitleWithTooltip } from "~/app/_components/title-with-tooltip";
import myWritingData from "~/app/_const/my-articles.json";
import myWorkData from "~/app/_const/my-work.json";
import {
  Accordion,
  AccordionController,
  AccordionToggleMoreInfo,
} from "~/components/accordion";
import { LinkExternal } from "~/components/link-external";
import { Pill } from "~/components/pill";
import { Section } from "~/components/section";

export default function Home() {
  React.useEffect(() => {
    document
      .getElementById("email")
      ?.setAttribute(
        "href",
        "mailto:".concat(atob(process.env.NEXT_PUBLIC_EMAIL)),
      );
  }, []);

  return (
    <main>
      <div id="top" className="relative z-0 h-dvh w-full overflow-hidden">
        <div className="absolute top-1/2 left-1/2 grid aspect-square h-[200dvh] w-[200dvw] -translate-x-1/2 -translate-y-1/2 grid-cols-3 grid-rows-3">
          <Boxes
            positions={[
              "bottom-right",
              "bottom-center",
              "bottom-left",
              "mid-right",
            ]}
          />
          <Box position="mid-center" classes="bg-primary-800">
            <BoxMiddle />
          </Box>
          <Boxes
            positions={["mid-left", "top-right", "top-center", "top-left"]}
          />
        </div>
      </div>

      <Section id="my-work" classes="bg-primary-900 py-8 text-white">
        <TitleWithTooltip
          id="my-work-title"
          tooltip={
            <span className="inline">
              It would be dishonest to claim all the credit for these projects.
              It was truly a collaborative effort — big shoutout to the amazing
              team I had the chance to work with at{" "}
              <LinkExternal href="https://bejamas.com/" label="Bejamas" />
            </span>
          }
        >
          my work
        </TitleWithTooltip>

        <div className="space-y-4">{myWorkData.list.map(myWorkWrapper)}</div>

        <AccordionController>
          {(accordionProps) => (
            <div className="mt-8">
              <AccordionToggleMoreInfo
                name={
                  <h3 className="pl-4 text-lg font-semibold sm:text-xl">
                    older projects
                  </h3>
                }
                {...accordionProps}
              />

              <Accordion {...accordionProps}>
                <div className="mt-4 space-y-4">
                  {myWorkData.more.map(myWorkWrapper)}
                </div>
              </Accordion>
            </div>
          )}
        </AccordionController>

        <AccordionController>
          {(accordionProps) => (
            <div className="mt-8">
              <AccordionToggleMoreInfo
                name={
                  <h3 className="pl-4 text-lg font-semibold sm:text-xl">
                    mini websites
                  </h3>
                }
                {...accordionProps}
              />

              <Accordion {...accordionProps}>
                <div className="mt-4 space-y-4">
                  <a
                    href="https://www.linge.love/"
                    target="_blank"
                    className="group border-primary-800 hover:bg-accent-500 hover:text-primary-900 flex w-full gap-4 rounded-xl border border-2 p-4 text-start text-lg font-semibold sm:text-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="114.97 15.87 88.33 88.15"
                      width="24"
                      className="group-hover:animate-[heartbeat_2s_ease-in-out_infinite]"
                    >
                      <path
                        d="M144.447 15.876a29.613 29.613 0 00-14.492 3.88c-6.638 3.778-11.451 9.938-13.542 17.024l10.603 10.603.015-2.842c.032-5.963 3.284-11.494 8.656-14.552a17.77 17.77 0 018.686-2.322 17.511 17.511 0 018.667 2.233c5.345 3.006 8.543 8.511 8.512 14.473l-.039 7.372a5.927 5.858-48.002 005.852 5.856l7.387-.039c6.001-.03 11.532 3.174 14.539 8.495a17.342 17.342 0 012.23 8.62 17.588 17.588 0 01-2.318 8.636 5.927 5.858-48.002 00-.002.001c-3.06 5.348-8.615 8.608-14.616 8.64l-2.982.014 10.65 10.65c7.132-2.066 13.343-6.875 17.152-13.533h-.002a29.485 29.485 0 003.896-14.483 29.04 29.04 0 00-3.742-14.441c-5.043-8.924-14.48-14.444-24.728-14.39a5.927 5.858-48.002 00-.003 0l-1.506.008.009-1.48c.053-10.247-5.495-19.673-14.431-24.697a29.163 29.163 0 00-14.449-3.727 5.927 5.858-48.002 00-.001 0zM115.214 52.34l-.24 45.826a5.927 5.858-48.002 005.85 5.858l45.834-.24-11.73-11.73-28.146.146.147-28.144z"
                        strokeWidth="1.114"
                        fill="currentColor"
                      />
                    </svg>
                    linge.love
                  </a>
                </div>
              </Accordion>
            </div>
          )}
        </AccordionController>
      </Section>

      <Section id="articles" classes="py-8">
        <TitleWithTooltip
          id="my-writing"
          tooltip={<>These articles were created before AI was a thing.</>}
        >
          my writing
        </TitleWithTooltip>

        <div className="mb-8 space-y-4">
          {myWritingData.articles.map(myWritingMapper)}
        </div>

        <AccordionController>
          {(accordionProps) => (
            <>
              <AccordionToggleMoreInfo
                name={
                  <h3 className="pl-4 text-lg font-semibold sm:text-xl">
                    more
                  </h3>
                }
                {...accordionProps}
              />

              <Accordion {...accordionProps}>
                <div className="mt-4 space-y-4">
                  {myWritingData["more"].map(myWritingMapper)}
                </div>
              </Accordion>
            </>
          )}
        </AccordionController>
      </Section>

      <Section id="contact" classes="bg-primary-800 py-8 text-white">
        <h2 className="pl-4 text-xl font-semibold sm:text-3xl">contact</h2>
        <div className="mb-4 pl-4 text-xs sm:text-sm">
          for a tailored cv or more information, feel free to contact me
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a id="email" href="" className="w-fit">
            <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
              send me an email
            </Pill>
          </a>
          <a
            id="cv"
            href="/files/woloszyn-daniel-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit"
          >
            <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
              download my cv <DownloadIcon size={16} className="mb-1 inline" />
            </Pill>
          </a>
        </div>
      </Section>
    </main>
  );
}
