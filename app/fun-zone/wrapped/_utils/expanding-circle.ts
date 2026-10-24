const DURATION_ANIMATION_CIRCLE = 2500;
const DURATION_ANIMATION_OPACITY = 1500;

type TParameters = { x: number; y: number; size: number };

/** lives on `body`, so it keeps covering the screen while the next page loads */
export const createExpandingCircle = ({ x, y, size }: TParameters) => {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapped-circle-wrapper";
  wrapper.style.setProperty("--animation-duration-circle", `${DURATION_ANIMATION_CIRCLE}ms`);
  wrapper.style.setProperty("--animation-duration-opacity", `${DURATION_ANIMATION_OPACITY}ms`);

  const circle = document.createElement("div");
  circle.className = "wrapped-circle";
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;

  wrapper.appendChild(circle);
  document.body.appendChild(wrapper);

  setTimeout(() => {
    circle.style.opacity = "0";
  }, DURATION_ANIMATION_CIRCLE - DURATION_ANIMATION_OPACITY);

  setTimeout(() => wrapper.remove(), DURATION_ANIMATION_CIRCLE);
};
