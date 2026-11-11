// The holo print on the Hannah Montana sparkle cards, sketched by the owner:
// circles touching in a square grid; in every gap an eight-point star with
// equal arms (inner corners on the circles' arcs: axial arms run along the arcs
// to the touch points, diagonal ones cut straight into the circles), split into
// four quarters by a cross. Each circle and each quarter is one "reflection":
// a sunburst of 10 arms around its own center, with no outlines between them.
//
// One lattice tile in T units: circle centers on its corners, the star in its
// middle.

export const T = 100; // tile size in its own units (one circle spacing)
const R = T / 2; // circles touch
const C = T / 2;
const QUARTER_CENTER = 12; // offset of each star quarter's sunburst center
export const ARMS = 10;
const ARM_WIDTH = (Math.PI / ARMS) * 0.22; // thin arms (each owns 36°), softened by a blur

const f = (n: number) => Number(n.toFixed(2));
type TPoint = [number, number];
const point = (r: number, a: number): TPoint => [C + Math.cos(a) * r, C + Math.sin(a) * r];
const fmt = ([x, y]: TPoint) => `${f(x)} ${f(y)}`;
const dist = ([ax, ay]: TPoint, [bx, by]: TPoint) => Math.hypot(ax - bx, ay - by);

// Nearest point of a circle along a ray from the star's center
const toCircle = (a: number, [kx, ky]: TPoint) => {
  const b = Math.cos(a) * (kx - C) + Math.sin(a) * (ky - C);
  const c = (kx - C) ** 2 + (ky - C) ** 2 - R * R;
  return b - Math.sqrt(b * b - c);
};

const corner = (a: number): TPoint => [
  C + Math.sign(Math.round(Math.cos(a) * 1e6)) * C,
  C + Math.sign(Math.round(Math.sin(a) * 1e6)) * C,
];

export const STAR_PATH = (() => {
  let d = "";
  for (let k = 0; k < 4; k++) {
    const axial = -Math.PI / 2 + (k * Math.PI) / 2;
    const diag = axial + Math.PI / 4;
    const circle = corner(diag);
    const tip = point(R, axial);
    const v1 = point(toCircle(axial + Math.PI / 8, circle), axial + Math.PI / 8);
    const v2 = point(toCircle(diag + Math.PI / 8, circle), diag + Math.PI / 8);
    // the diagonal arm as long as the axial one (inner corner to tip)
    const armLength = dist(tip, v1);
    let lo = dist([C, C], v1);
    let hi = 2 * R;
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      if (dist(point(mid, diag), v1) < armLength) lo = mid;
      else hi = mid;
    }
    const nextTip = point(R, axial + Math.PI / 2);
    d += `${k ? "L" : "M"}${fmt(tip)}A${R} ${R} 0 0 0 ${fmt(v1)}L${fmt(point(lo, diag))}L${fmt(v2)}A${R} ${R} 0 0 0 ${fmt(nextTip)}`;
  }
  return `${d}Z`;
})();

/** Everything in the tile but the star (for clipping the circles) */
export const OUTSIDE_STAR_PATH = `M-1 -1H${T + 1}V${T + 1}H-1Z${STAR_PATH}`;

/** One arm of a sunburst centered on 0,0 pointing right; rotate for the others */
export const ARM_PATH = (() => {
  const r = T; // long enough for any reflection, then clipped
  const a = ARM_WIDTH / 2;
  return `M0 0L${f(Math.cos(-a) * r)} ${f(Math.sin(-a) * r)}L${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}Z`;
})();

export type TReflection = {
  id: string;
  cx: number;
  cy: number;
  /** clip to this circle, or to this quarter of the star */
  clip: { circle: TPoint } | { quarter: TPoint };
  /** spin phase, so neighbours don't turn in lockstep */
  phase: number;
};

export const REFLECTIONS: Array<TReflection> = [
  ...(
    [
      [0, 0],
      [T, 0],
      [0, T],
      [T, T],
    ] as Array<TPoint>
  ).map(([cx, cy], i) => ({
    id: `c${i}`,
    cx,
    cy,
    clip: { circle: [cx, cy] as TPoint },
    phase: i * 23,
  })),
  ...(
    [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ] as Array<TPoint>
  ).map(([sx, sy], i) => ({
    id: `q${i}`,
    cx: C + sx * QUARTER_CENTER,
    cy: C + sy * QUARTER_CENTER,
    clip: { quarter: [sx, sy] as TPoint },
    phase: 11 + i * 17,
  })),
];

export const HALF = C;
