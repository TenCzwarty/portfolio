import type { TWrappedVideo } from "~wrapped/_const/types";

export type TBackgroundVideo = TWrappedVideo & {
  /** fires once the video actually plays, so slides can follow the music */
  onStart?: () => void;
};

export type TWrappedContext = {
  video: TBackgroundVideo | null;
  setVideo: React.Dispatch<React.SetStateAction<TBackgroundVideo | null>>;
  isMuted: boolean;
  toggleIsMuted: (value?: unknown) => void;
};
