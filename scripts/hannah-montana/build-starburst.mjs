#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Builds app/utils/hannah-montana/starburst.css: the holo print on the Hannah
// Montana sparkle cards, as measured on the scans (~6 mm lattice, ~9.6 circles
// across a card) and sketched by the owner. The foil is split into
// "reflections", each a sunburst of 10 arms around its own center:
//
//   - circles touching in a square grid,
//   - in every gap between four circles, an eight-point star with equal arms
//     (the axial arms reach where the circles touch, the diagonal ones cut as
//     far into the circles), split into four quarters by a cross,
//   - so the reflections are each circle (minus the star's arms) and each
//     quarter of the star; the outlines are the borders between them.
//
// One lattice tile, circle centers on its corners and the star in its middle,
// drawn twice: A with the sunbursts' arms, B with the gaps between them.
// Tilting fades between the two, so the reflections shimmer like the foil.
//
// Usage: node scripts/hannah-montana/build-starburst.mjs
// -----------------------------------------------------------------------------

import { writeFile } from "node:fs/promises";

const OUT = "app/utils/hannah-montana/starburst.css";
const P = 100; // tile size (one circle spacing)
const R = 50; // circles touch
const C = P / 2; // the star sits in the middle of the tile
const QUARTER_CENTER = 12; // offset of each quarter's sunburst center
const ARMS = 10; // arms per reflection

const f = (n) => Number(n.toFixed(2));
const polar = (cx, cy, r, a) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`;

// The star: its inner corners sit on the circles' arcs. The four axial arms
// are the gap's natural points (sides along the arcs, tips where the circles
// touch); the four diagonal arms are straight points cutting into the circles,
// as long as the axial ones (inner corner to tip).
const point = (r, a) => [C + Math.cos(a) * r, C + Math.sin(a) * r];
const toCircle = (a, [kx, ky]) => {
  // nearest point of circle (kx, ky) along the ray from the star's center
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const b = ux * (kx - C) + uy * (ky - C);
  const c = (kx - C) ** 2 + (ky - C) ** 2 - R * R;
  return b - Math.sqrt(b * b - c);
};
const circleAt = (a) => [
  C + Math.sign(Math.round(Math.cos(a) * 1e6)) * C,
  C + Math.sign(Math.round(Math.sin(a) * 1e6)) * C,
];
const dist = ([ax, ay], [bx, by]) => Math.hypot(ax - bx, ay - by);
const fmt = ([x, y]) => `${f(x)} ${f(y)}`;

const starPath = (() => {
  let d = "";
  for (let k = 0; k < 4; k++) {
    const axial = -Math.PI / 2 + (k * Math.PI) / 2; // top, right, bottom, left
    const diag = axial + Math.PI / 4;
    const circle = circleAt(diag);
    const tip = point(R, axial);
    const v1 = point(toCircle(axial + Math.PI / 8, circle), axial + Math.PI / 8);
    const v2 = point(toCircle(diag + Math.PI / 8, circle), diag + Math.PI / 8);
    const armLength = dist(tip, v1);
    // diagonal tip distance so that it sits armLength from its inner corners
    let lo = dist([C, C], v1);
    let hi = 2 * R;
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      if (dist(point(mid, diag), v1) < armLength) lo = mid;
      else hi = mid;
    }
    const diagTip = point(lo, diag);
    const nextTip = point(R, axial + Math.PI / 2);
    // arcs on the circle between: tip -> v1 and v2 -> next tip
    d += `${k ? "L" : "M"}${fmt(tip)}A${R} ${R} 0 0 0 ${fmt(v1)}L${fmt(diagTip)}L${fmt(v2)}A${R} ${R} 0 0 0 ${fmt(nextTip)}`;
  }
  return d + "Z";
})();

// Sunburst: ARMS * 2 sectors around a center; parity 0 = the arms, 1 = the
// gaps between them. Sectors run long and get clipped to their reflection.
const sunburst = (cx, cy, parity, turn = 0) => {
  const step = Math.PI / ARMS;
  let d = "";
  for (let i = parity; i < ARMS * 2; i += 2) {
    const a = turn + i * step;
    d += `M${cx} ${cy}L${polar(cx, cy, 80, a)}L${polar(cx, cy, 80, a + step)}Z`;
  }
  return d;
};

const corners = [
  [0, 0],
  [P, 0],
  [0, P],
  [P, P],
];
const quarters = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

const tile = (parity) => {
  const defs =
    // everything but the star
    `<clipPath id='o'><path clip-rule='evenodd' d='M-1 -1H${P + 1}V${P + 1}H-1Z${starPath}'/></clipPath>` +
    `<clipPath id='s'><path d='${starPath}'/></clipPath>` +
    corners
      .map(([x, y], i) => `<clipPath id='c${i}'><circle cx='${x}' cy='${y}' r='${R}'/></clipPath>`)
      .join("") +
    quarters
      .map(
        ([sx, sy], i) =>
          `<clipPath id='q${i}'><rect x='${sx < 0 ? 0 : C}' y='${sy < 0 ? 0 : C}' width='${C}' height='${C}'/></clipPath>`
      )
      .join("");

  const circles = corners
    .map(([x, y], i) => `<path clip-path='url(#c${i})' d='${sunburst(x, y, parity, i * 0.4)}'/>`)
    .join("");
  const starQuarters = quarters
    .map(
      ([sx, sy], i) =>
        `<path clip-path='url(#q${i})' d='${sunburst(C + sx * QUARTER_CENTER, C + sy * QUARTER_CENTER, parity, i * 0.3)}'/>`
    )
    .join("");

  // The borders between reflections
  const rims = corners
    .map(([x, y]) => `M${x - R} ${y}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0`)
    .join("");

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${P} ${P}'>` +
    `<defs>${defs}</defs>` +
    `<g fill='black' fill-opacity='.4'>` +
    `<g clip-path='url(#o)'>${circles}</g>` +
    `<g clip-path='url(#s)'>${starQuarters}</g>` +
    `</g>` +
    `<g stroke='black' stroke-width='1.1' fill='none'>` +
    `<path clip-path='url(#o)' d='${rims}'/>` +
    `<path d='${starPath}'/>` +
    `<path clip-path='url(#s)' d='M${C} 0V${P}M0 ${C}H${P}'/>` +
    `</g>` +
    `</svg>`;
  return `url("data:image/svg+xml,${svg.replace(/</g, "%3C").replace(/>/g, "%3E").replace(/#/g, "%23")}")`;
};

const css = `/* Generated by scripts/hannah-montana/build-starburst.mjs; don't edit by hand. */

/* Hannah Montana sparkle: a holo lattice of touching circles with a quartered
   eight-point star in every gap; each circle and each quarter is a reflection,
   a 10-arm sunburst. A rainbow slides with the tilt behind it; the arms (A)
   and the gaps between them (B) fade in turn. The lattice offset differs per
   card (--holo-x / --holo-y, set by the card), because the foil was laid on
   the sheet before the cards were cut. */

.sumo-foil[data-effect="starburst"] {
  --holo-a: ${tile(0)};
  --holo-b: ${tile(1)};
  /* one circle spacing = 1/9.6 of the card width, as on the scans */
  --holo-size: 10.4%;
}

.sumo-foil[data-effect="starburst"] .sumo-foil__shine {
  mix-blend-mode: normal;
}

.sumo-foil[data-effect="starburst"] .sumo-foil__shine::before,
.sumo-foil[data-effect="starburst"] .sumo-foil__shine::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    var(--holo-angle),
    hsl(0 100% 62%) 0%,
    hsl(45 100% 58%) 2.5%,
    hsl(110 100% 55%) 5%,
    hsl(185 100% 58%) 7.5%,
    hsl(240 100% 66%) 10%,
    hsl(300 100% 64%) 12.5%,
    hsl(0 100% 62%) 15%
  );
  background-size: 200% 200%;
  /* the lattice, intersected with the light spot: the foil only lights up
     where the light catches it, like on the real cards */
  mask-size:
    var(--holo-size) auto,
    100% 100%;
  mask-repeat: repeat, no-repeat;
  mask-position:
    var(--holo-x, 0%) var(--holo-y, 0%),
    0 0;
  mask-composite: intersect;
  filter: saturate(1.3) brightness(1.1);
}

.sumo-foil[data-effect="starburst"] .sumo-foil__shine::before {
  --holo-angle: 125deg;
  background-position: var(--mx) var(--my);
  mask-image:
    var(--holo-a),
    radial-gradient(farthest-corner circle at var(--mx) var(--my), black 0%, transparent 75%);
  opacity: clamp(0.12, calc(0.4 + var(--tx) * 1.2), 0.65);
}

.sumo-foil[data-effect="starburst"] .sumo-foil__shine::after {
  --holo-angle: 55deg;
  background-position: calc(100% - var(--mx)) var(--my);
  mask-image:
    var(--holo-b),
    radial-gradient(farthest-corner circle at var(--mx) var(--my), black 0%, transparent 75%);
  opacity: clamp(0.12, calc(0.4 - var(--tx) * 1.2), 0.65);
}
`;

await writeFile(OUT, css);
console.log(`wrote ${OUT} (${css.length} chars)`);
