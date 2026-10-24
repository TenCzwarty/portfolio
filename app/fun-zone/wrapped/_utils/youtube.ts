/** the few bits of the YouTube IFrame API the background video uses */
export type TYouTubePlayer = {
  loadVideoById: (options: { videoId: string; startSeconds?: number; endSeconds?: number }) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
};

type TYouTubePlayerOptions = {
  host?: string;
  width?: string;
  height?: string;
  playerVars?: Record<string, number>;
  events?: {
    onReady?: (event: { target: TYouTubePlayer }) => void;
    onStateChange?: (event: { target: TYouTubePlayer; data: number }) => void;
  };
};

type TYouTubeApi = {
  Player: new (element: HTMLElement, options: TYouTubePlayerOptions) => TYouTubePlayer;
};

declare global {
  interface Window {
    YT?: TYouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const YOUTUBE_STATE_ENDED = 0;
export const YOUTUBE_STATE_PLAYING = 1;

let apiPromise: Promise<TYouTubeApi> | null = null;

export const loadYouTubeApi = () =>
  (apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  }));
