import type { TNote } from "../../_types";
import { LIMITS } from "../../_utils/validate";

export const NOTE_WIDTH = 144;
export const NOTE_HEIGHT = 112;

export const clampPosition = (value: number) =>
  Math.max(-LIMITS.notePosition, Math.min(LIMITS.notePosition, Math.round(value)));

/** the same small tilt on every screen and after every refresh */
export const rotationOf = (id: string) => {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return ((hash % 31) - 15) / 10;
};

/** people pick strong colors: mixed with white they make a paper dark text always reads on */
export const paperOf = (color?: string) =>
  color ? `color-mix(in srgb, ${color} 35%, white)` : "var(--color-neutral-100)";

/** the more people want it, the more it stands out */
export const scaleOf = (votes: number) => 1 + Math.min(Math.max(votes - 1, 0), 3) * 0.05;

export const boundsOf = (notes: Array<TNote>) => {
  if (!notes.length) return null;
  const xs = notes.map((n) => n.x);
  const ys = notes.map((n) => n.y);
  const [x, y] = [Math.min(...xs), Math.min(...ys)];
  return {
    x,
    y,
    width: Math.max(...xs) + NOTE_WIDTH - x,
    height: Math.max(...ys) + NOTE_HEIGHT - y,
  };
};

/** for notes added from the list: under everything already there, so nothing gets covered */
export const freeSpotFor = (notes: Array<TNote>) => {
  const bounds = boundsOf(notes);
  if (!bounds) return { x: 0, y: 0 };
  return {
    x: clampPosition(bounds.x + Math.random() * 480),
    y: clampPosition(bounds.y + bounds.height + 24),
  };
};
