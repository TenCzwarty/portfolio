"use client";

import React from "react";
import NextImage from "next/image";

import { Pill } from "~/components/pill";

import type { TSumoCardProps } from "./types";

export const SumoCard = (props: TSumoCardProps) => {
  const { title, number, finishes, tcdbImageUrl } = props;
  const [imgError, setImgError] = React.useState(false);

  const displayName =
    title.length > 24 ? title.split(" ").slice(0, 2).join(" ") : title;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="group relative rounded-xl border border-neutral-200 bg-white p-2">
        <div className="relative h-[160px] w-[112px] overflow-hidden rounded-lg bg-neutral-100">
          {tcdbImageUrl && !imgError ? (
            <NextImage
              src={tcdbImageUrl}
              fill
              sizes="112px"
              className="object-cover"
              alt={title}
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-center text-neutral-400">
              <span className="text-2xl font-bold">#{number}</span>
              <span className="mt-1 px-1 text-xs leading-tight">
                {displayName}
              </span>
            </div>
          )}
        </div>

        {finishes.length > 1 && (
          <div className="absolute top-1 right-1 flex gap-0.5">
            {finishes.slice(1).map((finish) => (
              <Pill key={finish.id} classes="!px-1.5 !py-0 text-[10px]">
                {finish.name}
              </Pill>
            ))}
          </div>
        )}
      </div>

      <h4 className="max-w-[120px] truncate text-center text-xs">
        {displayName}
      </h4>
    </div>
  );
};
