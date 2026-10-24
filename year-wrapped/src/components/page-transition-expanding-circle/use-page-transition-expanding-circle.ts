import React from "react";

import { createExpandingCircleOnAllLinksClick } from "./create-expanding-circle-on-all-links-click";

export const usePageTransitionExpandingCircle = () => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        createExpandingCircleOnAllLinksClick(ref);
    }, []);

    return ref;
}
