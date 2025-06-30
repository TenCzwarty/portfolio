"use client";

import React from "react";

import { Box, Boxes } from "~/app/_components/box";
import { SVGArt } from "~/app/_components/box/middle";

export default function HomePage() {
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
            <SVGArt variant="cloud" />
          </Box>
          <Boxes
            positions={["mid-left", "top-right", "top-center", "top-left"]}
          />
        </div>
      </div>
    </main>
  );
}
