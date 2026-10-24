import { createExpandingCircle } from './create-expanding-circle';

export const createExpandingCircleOnMouseClick = ({ event }: { event: MouseEvent }) => {
    const x = event.clientX || 0;
    const y = event.clientY || 0;

    const size = Math.max(window.innerWidth, window.innerHeight) * 2;

    createExpandingCircle({ x, y, size });
}
