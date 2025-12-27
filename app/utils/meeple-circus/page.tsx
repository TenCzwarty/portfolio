"use client";

import React from "react";
import {
  ListMusicIcon,
  MusicIcon,
  PartyPopperIcon,
  ShuffleIcon,
} from "lucide-react";

import { useConfetti } from "~/app/utils/meeple-circus/_utils/use-confetti";
import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/components/accordion";
import { IconToggle } from "~/components/icon-toggle";
import { Section } from "~/components/section";
import { random } from "~/utils/random";
import { useToggle } from "~/utils/use-toggle";

import { AudioPlayer } from "./_components/audio-player";
import { ButtonWithTooltip } from "./_components/button-with-tooltip";
import {
  findSongBySrc,
  getAllSongs,
  getFirstCategoryTitle,
  getFirstSongForCategory,
  getRandomSong,
  getSongsForCategory,
} from "./_const";

export default function UtilsMeepleCircusPage() {
  const SONGS = getAllSongs();

  const [category, setCategory] = React.useState(getFirstCategoryTitle());
  const [song, setSong] = React.useState(getFirstSongForCategory(category));

  const [isConfettiEnabled, toggleIsConfettiEnabled] = useToggle(true);

  const triggerConfetti = useConfetti();

  const toggleAndTriggerConfetti = () => {
    // trigger confetti when we toggle the button to 'active'
    if (!isConfettiEnabled) {
      triggerConfetti({ angle: random(180, 360) });
    }

    toggleIsConfettiEnabled();
  };

  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;

    setCategory(newCategory);
    setSong(getFirstSongForCategory(newCategory));
  };

  const onChangeSong = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSong = findSongBySrc(category, e.target.value);

    if (selectedSong) {
      setSong(selectedSong);
    }
  };

  const onClickGetRandomSong = () => {
    const categorySongs = getSongsForCategory(category);

    if (categorySongs.length <= 1) {
      return;
    }

    const randomSong = getRandomSong(categorySongs, song?.src);

    if (randomSong) {
      setSong(randomSong);
    }
  };

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <AccordionController>
          {(accordionProps) => (
            <>
              <div className="mt-16 mb-8 ml-4">
                <h1 className="text-xl font-semibold sm:text-3xl">
                  Meeple Circus
                </h1>

                <div className="flex gap-2">
                  <p>music timer for a forgotten board game</p>

                  <div className="flex gap-4 ">
                    <AccordionExtraSettingsToggle {...accordionProps} />

                    <Accordion {...accordionProps}>
                      <div className="flex items-center gap-2">
                        <ButtonWithTooltip id="random" onClick={onClickGetRandomSong}>
                          <ShuffleIcon />
                        </ButtonWithTooltip>

                        <IconToggle
                          id="confetti"
                          toggleFunction={toggleAndTriggerConfetti}
                        >
                          <PartyPopperIcon />
                        </IconToggle>
                      </div>
                    </Accordion>
                  </div>
                </div>
              </div>
            </>
          )}
        </AccordionController>

        <div className="ml-4 w-[300px] space-y-4">
          <div className="flex items-center gap-2">
            <ListMusicIcon className="z-10" />

            <select
              value={category}
              onChange={onChangeCategory}
              className="-ml-10 h-[40px] w-[316px] appearance-none rounded-xl pl-4 pl-10 hover:cursor-pointer hover:bg-neutral-200"
            >
              {SONGS.map(({ title }) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MusicIcon className="z-10" />

            <select
              value={song?.src}
              onChange={onChangeSong}
              className="-ml-10 h-[40px] w-[316px] appearance-none rounded-xl pl-4 pl-10 hover:cursor-pointer hover:bg-neutral-200"
            >
              {getSongsForCategory(category).map(({ title, src }) => (
                <option key={title} value={src}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <AudioPlayer
            src={`/files/utils/meeple-circus/${song?.src}`}
            confetti={{
              trigger: () => triggerConfetti({ angle: random(0, 360) }),
              isEnabled: isConfettiEnabled,
              highlightTimestamps: song?.highlightTimestamps ?? [],
            }}
          />
        </div>
      </Section>
    </main>
  );
}
