import React from "react";
import Lottie from "lottie-react";

import animationData from './mute.json';

export const ButtonMute = ({ isMuted, toggleIsMuted }: { isMuted: boolean, toggleIsMuted: () => void }) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (ref.current) {
            if (isMuted) {
                ref.current.playSegments([25, 0], true);
            } else {
                ref.current.playSegments([0, 25], true);
            }
        }
    }, [isMuted]);

    return (
        <button
            onClick={toggleIsMuted}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
            <Lottie
                lottieRef={ref}
                animationData={animationData}
                loop={false}
                autoplay={false}
                style={{ width: 24, height: 24 }}
            />
        </button>
    );
}
