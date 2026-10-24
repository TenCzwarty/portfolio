import React from "react";

import { useBackgroundVideoContext } from "./background-video-context";

export const useBackgroundVideo = (videoUrl: string, options?: { start?: number, end?: number, onStart?: () => void }) => {
    const { setVideoUrl, setVideoOptions } = useBackgroundVideoContext();

    React.useEffect(() => {
        setVideoUrl(videoUrl);
        setVideoOptions(options || {});
    }, [videoUrl]);
}
