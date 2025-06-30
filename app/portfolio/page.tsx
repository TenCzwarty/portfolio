"use client";

import React from "react";
import { DownloadIcon } from "lucide-react";

import { Box, Boxes } from "~/app/_components/box";
import { SVGArt } from "~/app/_components/box/middle";
import { myWritingMapper } from "~/app/_components/box-article";
import { BoxMiniWebsites } from "~/app/_components/box-mini-website";
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

export default function PortfolioPage() {
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
          <Box position="mid-center">
            <SVGArt variant="eye" />
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
                  <BoxMiniWebsites />
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
