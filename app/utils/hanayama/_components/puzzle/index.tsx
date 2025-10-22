import React from "react";
import NextImage from "next/image";

import { toast } from "~/components/toast";
import { Tooltip } from "~/components/tooltip";

import type { TPuzzleProps } from "./types";

import { getSeriesIcon,Icon } from "~hanayama/_components/icon";
import { useHanayamaTrackerContext } from "~hanayama/_context";

export const Puzzle = ({ isSettingsOpened, ...props }: TPuzzleProps) => {
  const { toggleCollected, isCollected, toggleCompleted, isCompleted } =
    useHanayamaTrackerContext();

  const { id, name, src } = props;

  const collect = () => {
    if (!isSettingsOpened) return;

    toggleCollected(id);

    toast(
      isCollected(id)
        ? `removed ${name} from your collection`
        : `added ${name} to your collection`,
    );
  };

  const complete = () => {
    if (!isSettingsOpened) return;

    toggleCompleted(id);

    toast(
      isCompleted(id)
        ? `marked ${name} as not completed`
        : `marked ${name} as completed`,
    );
  };

  return (
    <>
      {isSettingsOpened && (
        <Tooltip id={id} clickable>
          <div className="space-y-4 text-center">
            <div>
              <div className="font-bold">
                {name}
                {props["alt-names"] && ` / ${props["alt-names"]}`}
              </div>

              {(props.author || props.year) && (
                <div className="flex space-x-2">
                  {props.author && <span>{props.author}</span>}
                  {props.year && <span>({props.year})</span>}
                </div>
              )}

              {props.notes && (
                <div className="text-neutral-500">{props.notes}</div>
              )}
            </div>

            {(props.rare || props.tags) && (
              <div className="flex w-full justify-end space-x-2">
                {props.rare && (
                  <span className="text-accent-900">
                    <Icon.rarity.rare />
                  </span>
                )}

                {props.tags?.map((tag) => (
                  <span key={tag} className="text-accent-900">
                    {getSeriesIcon(tag)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Tooltip>
      )}

      <div data-tooltip-id={id} className="flex flex-col items-center gap-1">
        <div
          className={`group relative rounded-xl border border-neutral-200 bg-white p-2 ${isSettingsOpened ? "hover:cursor-pointer" : ""}`}
        >
          <div className="glint">
            <NextImage
              src={`/images/utils/hanayama/${src}`}
              width={128}
              height={128}
              alt={name}
              onClick={collect}
            />
          </div>

          {isSettingsOpened && (
            <>
              {isCollected(id) && (
                <div className="bg-accent-900 pointer-events-none absolute right-0 bottom-0 block rounded-md p-2 text-white">
                  <Icon.status.collected />
                </div>
              )}

              {isCompleted(id) && (
                <div className="bg-accent-900 pointer-events-none absolute top-0 right-0 block rounded-md p-2 text-white">
                  <Icon.status.completed />
                </div>
              )}

              <button
                onClick={complete}
                className="bg-accent-900 absolute top-0 right-0 block hidden rounded-md p-2 text-white opacity-50 group-hover:block hover:opacity-75"
              >
                <Icon.status.completed />
              </button>
            </>
          )}
        </div>

        <h4>{name}</h4>
      </div>
    </>
  );
};
