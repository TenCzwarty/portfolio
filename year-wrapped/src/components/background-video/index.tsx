'use client'

import React from 'react'
import dynamic from 'next/dynamic'

import { useBackgroundVideoContext } from '@/src/components/background-video/background-video-context';
import { useIsMounted } from '@/src/utils/use-is-mounted';
import { useOnWindowResize } from '@/src/utils/use-on-window-resize'

import * as styles from "./styles.module.css"

const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false })

const useResponsiveVideoDimensions = () => {
  const [videoDimensions, setVideoDimensions] = React.useState({ width: 0, height: 0 });

  const updateVideoDimensions = () => {
    const largerDimension = Math.max(window.innerHeight, window.innerWidth)

    setVideoDimensions({
      height: largerDimension,
      width: largerDimension * 16 / 9
    })
  };

  useOnWindowResize({ onWindowResize: updateVideoDimensions });

  return { height: videoDimensions.height, width: videoDimensions.width };
}

const DELAY_SOUND_FADE_OUT = 1000;
const DELAY_SOUND_FADE_IN = 1000;

const useVideoURL = ({ videoUrl }: { videoUrl: string }) => {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    setTimeout(() => {
      setUrl(videoUrl)
    }, DELAY_SOUND_FADE_OUT);
  }, [videoUrl])

  return { url };
}

const OverlayScreen = ({ isLoading }: { isLoading: boolean }) => {
  return <div className={styles['overlay-screen']} style={{ opacity: isLoading ? 1 : 0 }}></div>
}

export const BackgroundVideo = ({ volume = 0, mute, unmute }: { volume: number, mute: () => void, unmute: () => void }) => {
  const { isMounted } = useIsMounted();

  const { videoUrl, videoOptions } = useBackgroundVideoContext();
  const { height, width } = useResponsiveVideoDimensions();
  
  const [isLoading, setIsLoading] = React.useState(true);

  // delay the video url change to allow the sound to fade out
  const { url } = useVideoURL({ videoUrl });

  React.useEffect(() => {
    setIsLoading(true)
    mute()
  }, [videoUrl])


  const onStart = () => {
    setIsLoading(false)
    unmute()
    
    videoOptions?.onStart?.();

    setTimeout(() => {
    }, DELAY_SOUND_FADE_IN);
  }

  const onUnstarted = () => {
    console.log("onUnstarted")
  }


  if (!isMounted) {
    return null
  }

  const config = videoOptions ? { youtube: { playerVars: { start: videoOptions.start, end: videoOptions.end } } } : undefined;

  return (
    <div className={styles['background-video-wrapper']} >
      <ReactPlayer
        url={url}
        width={width}
        height={height}

        playing={true}
        loop={true}
        muted={false}
        volume={volume}
        config={config}

        onStart={onStart}
        onUnstarted={onUnstarted}

        className={styles.video}
      />
      <div className={styles.overlay}></div>
      <OverlayScreen isLoading={isLoading} />
    </div>
  )
}