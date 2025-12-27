import React from "react";

import { TAudioPlayer } from "./types";

export const AudioPlayer = ({ src, confetti }: TAudioPlayer) => {
  const refAudio = React.useRef<HTMLAudioElement>(null);
  const refTriggeredHiglights = React.useRef<Set<number>>(new Set());

  React.useEffect(() => {
    refTriggeredHiglights.current.clear();
  }, [src]);

  const onPlay = () => {
    if (confetti.isEnabled) {
      confetti.trigger();
    }
  };

  const onTimeUpdate = () => {
    if (!confetti.isEnabled || !refAudio.current || !confetti.highlightTimestamps) {
      return;
    }

    const currentMs = refAudio.current.currentTime * 1000;

    for (const targetMs of confetti.highlightTimestamps) {
      if (
        currentMs >= targetMs &&
        currentMs < targetMs + 250 &&
        !refTriggeredHiglights.current.has(targetMs)
      ) {
        refTriggeredHiglights.current.add(targetMs);
        confetti.trigger();
      }
    }
  };

  return (
    <audio
      ref={refAudio}
      key={src}
      onPlay={onPlay}
      onTimeUpdate={onTimeUpdate}
      controls
      className="mx-auto rounded-xl sm:mx-0"
    >
      <source src={src} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
};
