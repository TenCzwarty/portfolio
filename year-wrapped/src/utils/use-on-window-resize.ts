import { useEventListener } from '@/src/utils/use-event-listener';

export const useOnWindowResize = ({ onWindowResize }: { onWindowResize: () => void }) =>
    useEventListener({ type: 'resize', listener: onWindowResize });
