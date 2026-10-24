"use client";

import React from "react";

import { useWrappedContext } from "~wrapped/_context";
import type { TBackgroundVideo } from "~wrapped/_context/types";
import { useVolumeFade } from "~wrapped/_helpers/use-volume-fade";
import {
  loadYouTubeApi,
  type TYouTubePlayer,
  YOUTUBE_STATE_ENDED,
  YOUTUBE_STATE_PLAYING,
} from "~wrapped/_utils/youtube";

/** lets the sound fade out before the next page's video takes over */
const DELAY_VIDEO_CHANGE = 1000;

export const BackgroundVideo = () => {
  const { video, isMuted } = useWrappedContext();

  const refHost = React.useRef<HTMLDivElement>(null);
  const refPlayer = React.useRef<TYouTubePlayer | null>(null);
  const refVideo = React.useRef(video);
  const refLoaded = React.useRef<{ video: TBackgroundVideo; isStarted: boolean } | null>(null);

  const [isReady, setIsReady] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const volume = useVolumeFade(isPlaying && !isMuted ? 1 : 0);

  refVideo.current = video;

  // the player replaces the element it's given, so it gets one React doesn't own
  React.useEffect(() => {
    const host = refHost.current;
    let isCancelled = false;

    loadYouTubeApi().then((YT) => {
      if (isCancelled || !host) return;

      const element = document.createElement("div");
      host.appendChild(element);

      refPlayer.current = new YT.Player(element, {
        host: "https://www.youtube-nocookie.com",
        width: "100%",
        height: "100%",
        // starts muted, so autoplay is allowed; the volume fade unmutes it
        playerVars: {
          controls: 0,
          disablekb: 1,
          iv_load_policy: 3,
          mute: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: ({ target, data }) => {
            const loaded = refLoaded.current;
            if (!loaded) return;

            if (data === YOUTUBE_STATE_ENDED) {
              target.seekTo(loaded.video.start ?? 0, true);
              target.playVideo();
            }

            if (data === YOUTUBE_STATE_PLAYING && !loaded.isStarted) {
              loaded.isStarted = true;
              setIsPlaying(true);
              loaded.video.onStart?.();
            }
          },
        },
      });
    });

    return () => {
      isCancelled = true;
      refPlayer.current?.destroy();
      refPlayer.current = null;
      host?.replaceChildren();
    };
  }, []);

  React.useEffect(() => {
    if (!isReady || !video) return;

    setIsPlaying(false);

    const timeout = setTimeout(() => {
      const next = refVideo.current;
      if (!next || !refPlayer.current) return;

      refLoaded.current = { video: next, isStarted: false };
      refPlayer.current.loadVideoById({
        videoId: next.videoId,
        startSeconds: next.start,
        endSeconds: next.end,
      });
    }, DELAY_VIDEO_CHANGE);

    return () => clearTimeout(timeout);
  }, [isReady, video]);

  React.useEffect(() => {
    const player = refPlayer.current;
    if (!isReady || !player) return;

    player.setVolume(Math.round(volume * 100));

    if (volume > 0) player.unMute();
    else player.mute();
  }, [isReady, volume]);

  return (
    <div className="wrapped-video" aria-hidden>
      <div ref={refHost} className="wrapped-video__player" />
      <div className="wrapped-video__overlay" />
      <div className="wrapped-video__curtain" style={{ opacity: isPlaying ? 0 : 1 }} />
    </div>
  );
};
