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

import myWorkData from "@/data/work.json";
import myWritingData from "@/data/articles.json";

export default function Home() {
  return (
    <main>
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
          <Box position="mid-center" classes="bg-slate-800">
            <BoxMiddle />
          </Box>
          <Boxes
            positions={["mid-left", "top-right", "top-center", "top-left"]}
          />
        </div>
      </div>

      <section id="my-work" className="bg-slate-800 py-8 text-white">
        <div className="mx-auto max-w-[calc(200dvw/3)]">
          <TitleWithTooltip
            id="my-work-title"
            tooltip={
              <span className="inline">
                Given the size of these projects, it would be dishonest to claim
                all the credit. These were truly collaborative efforts — big
                shoutout to the amazing team I had the chance to work with at{" "}
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

      <section id="articles" className="p-8">
        <div className="mx-auto max-w-[calc(200dvw/3)]">
          <TitleWithTooltip
            id="my-writing"
            tooltip={
              <>
                I think it's worth mentioning that these articles were created
                before AI was a thing.
              </>
            }
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

      <section id="contact" className="bg-slate-900 p-8 text-white">
        <div className="mx-auto max-w-[calc(200dvw/3)]">
          <h2 className="mb-4 pl-4 text-3xl font-bold">contact</h2>
          <div className="space-x-4">
            <a id="email" href="">
              <Pill>send me an email</Pill>
            </a>
            <a id="cv" href="">
              <Pill>
                download my cv <Download size={16} className="mb-1 inline" />
              </Pill>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
