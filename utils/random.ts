export const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const coinToss = () => Math.random() > 0.5;
