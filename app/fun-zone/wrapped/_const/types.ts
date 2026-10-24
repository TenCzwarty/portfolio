export type TWrappedVideo = {
  videoId: string;
  /** seconds into the video, the part between start and end loops */
  start?: number;
  end?: number;
};

export type TWrappedYear = TWrappedVideo & {
  year: string;
};
