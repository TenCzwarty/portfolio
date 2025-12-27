export type TAudioPlayer = {
  src: string;
  confetti: {
    isEnabled: boolean;
    trigger: () => void;
    highlightTimestamps: Array<number>;
  };
};
