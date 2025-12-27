const COLOR_VARS = [
  "--color-primary-800",
  "--color-primary-900",
  "--color-accent-500",
  "--color-accent-900",
];

export const getThemeColors = () => {
  const temporaryElement = document.createElement("div");

  document.body.appendChild(temporaryElement);

  const colors = COLOR_VARS.map((varName) => {
    temporaryElement.style.color = `var(${varName})`;

    return getComputedStyle(temporaryElement).color;
  }).filter(Boolean);

  document.body.removeChild(temporaryElement);

  return colors.length > 0 ? colors : undefined;
};
