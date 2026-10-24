import type { TWrappedContext } from "./types";

export const init = {
  video: null,
  setVideo: () => {},
  isMuted: true,
  toggleIsMuted: () => {},
} satisfies TWrappedContext;
