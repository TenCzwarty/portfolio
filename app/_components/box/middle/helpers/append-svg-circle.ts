import type { TCoordinates } from "../types";

import { findCircle } from "./find-circle";

const EXTRA_RADIUS = 0.3;

export const appendSvgCircle = (
  svgElementId: string,
  position: TCoordinates,
) => {
  const circle = findCircle(position);

  if (!circle) return;

  const svgElement = document.getElementById(svgElementId);

  if (!svgElement) return;

  const newCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  newCircle.setAttribute("cx", String(circle.x));
  newCircle.setAttribute("cy", String(circle.y));
  newCircle.setAttribute("r", String(circle.r + EXTRA_RADIUS));

  svgElement.appendChild(newCircle);
};
