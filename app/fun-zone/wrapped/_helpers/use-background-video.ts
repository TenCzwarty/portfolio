import React from "react";

import { useWrappedContext } from "~wrapped/_context";
import type { TBackgroundVideo } from "~wrapped/_context/types";

/** sets the page's background video; `onStart` can change between renders without a reload */
export const useBackgroundVideo = ({ videoId, start, end, onStart }: TBackgroundVideo) => {
  const { setVideo } = useWrappedContext();

  const refOnStart = React.useRef(onStart);
  refOnStart.current = onStart;

  React.useEffect(() => {
    setVideo({ videoId, start, end, onStart: () => refOnStart.current?.() });
  }, [setVideo, videoId, start, end]);
};
