export const updateCSSProperty = (name: string, value: string | number) => {
  if (typeof window === "undefined") return;

  document.documentElement.style.setProperty(name, value.toString());
};
