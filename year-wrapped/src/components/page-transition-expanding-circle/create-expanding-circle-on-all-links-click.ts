import { createExpandingCircleOnMouseClick } from "./create-expanding-circle-on-mouse-click";

export const createExpandingCircleOnAllLinksClick = (ref: React.RefObject<HTMLDivElement>) =>
    ref.current?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (event) => createExpandingCircleOnMouseClick({ event }));
    });
