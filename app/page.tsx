"use client";

import React from "react";
import { Download } from "lucide-react";

import { myWorkWrapper } from "@/components/box-my-work";
import { Box, Boxes } from "@/components/box";
import { myWritingMapper } from "@/components/box-article";
import { TitleWithTooltip } from "@/components/title-with-tooltip";
import { Accordion } from "@/components/accordion";
import { BoxMiddle } from "@/components/box/middle";
import { LinkExternal } from "@/components/link-external";
import { Pill } from "@/components/pill";
import { Range } from "@/components/range";

import myWorkData from "@/data/work.json";
import myWritingData from "@/data/articles.json";

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
      <div className="absolute right-0 top-0 z-10 m-4 flex flex-col gap-2 opacity-0 duration-500 hover:opacity-100">
        <Range name="--primary" classes="text-primary-800" defaultValue={157} />
        <Range name="--accent" classes="text-accent-500" defaultValue={348} />
      </div>

      <div id="top" className="relative z-0 h-dvh w-full overflow-hidden">
        <div className="absolute left-1/2 top-1/2 grid aspect-square h-[200dvh] w-[200dvw] -translate-x-1/2 -translate-y-1/2 grid-cols-3 grid-rows-3">
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

      <section id="my-work" className="bg-primary-900 py-8 text-white">
        <div className="mx-auto px-4 sm:max-w-[calc(200dvw/3)] sm:px-0">
          <TitleWithTooltip
            id="my-work-title"
            tooltip={
              <span className="inline">
                It would be dishonest to claim all the credit for these
                projects. It was truly a collaborative effort — big shoutout to
                the amazing team I had the chance to work with at{" "}
                <LinkExternal href="https://bejamas.com/" label="Bejamas" />
              </span>
            }
          >
            my work
          </TitleWithTooltip>
          <div className="mb-8 space-y-4">
            {myWorkData.list.map(myWorkWrapper)}
          </div>

          <div className="space-y-4">
            <Accordion title="older projects">
              {myWorkData.more.map(myWorkWrapper)}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="articles" className="py-8">
        <div className="mx-auto px-4 sm:max-w-[calc(200dvw/3)] sm:px-0">
          <TitleWithTooltip
            id="my-writing"
            tooltip={<>These articles were created before AI was a thing.</>}
          >
            my writing
          </TitleWithTooltip>

          <div className="mb-8 space-y-4">
            {myWritingData.articles.map(myWritingMapper)}
          </div>

          <div className="space-y-4">
            <Accordion title="more">
              {myWritingData["more"].map(myWritingMapper)}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-primary-800 py-8 text-white">
        <div className="mx-auto px-4 sm:max-w-[calc(200dvw/3)] sm:px-0">
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
                download my cv <Download size={16} className="mb-1 inline" />
              </Pill>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
