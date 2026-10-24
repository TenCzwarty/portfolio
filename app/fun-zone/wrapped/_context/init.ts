import type { TWrappedContext } from "./types";

export const init = {
  video: null,
  setVideo: () => {},
  isMuted: true,
  toggleIsMuted: () => {},
  isLeaving: false,
  navigate: () => {},
} satisfies TWrappedContext;
