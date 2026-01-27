import React from "react";

import { random } from "~/utils/random";
import { useLocalStorage } from "~/utils/use-local-storage";

import type { TWebsiteColors } from "../types";
import { updateCSSProperty } from "../utils/update-css-property";

const STORAGE_KEY_WEBSITE_COLORS = "website-colors";

export const useRandomWebsiteColors = () => {
  const [storedColors, storeColors] = useLocalStorage<TWebsiteColors>(
    STORAGE_KEY_WEBSITE_COLORS,
    null,
  );

  const [primaryHue, setPrimaryHue] = React.useState(0);
  const [accentHue, setAccentHue] = React.useState(0);

  React.useEffect(() => {
    const primary = storedColors?.primaryHue ?? random(0, 360);
    const accent = storedColors?.accentHue ?? random(0, 360);

    setPrimaryHue(primary);
    setAccentHue(accent);

    updateCSSProperty("--transparency", "1");
    updateCSSProperty("--s", "100%");
    updateCSSProperty("--primary", primary);
    updateCSSProperty("--accent", accent);
  }, []);

  const randomizeColors = () => {
    const primary = random(0, 360);
    const accent = random(0, 360);

    setPrimaryHue(primary);
    setAccentHue(accent);

    updateCSSProperty("--primary", primary);
    updateCSSProperty("--accent", accent);
  };

  const saveWebsiteColorsToLocalStorage = () =>
    storeColors({ primaryHue, accentHue });

  const removeWebsiteColorsFromLocalStorage = () =>
    storeColors(null);

  const resetToStoredPrimaryColor = () => {
    if (!storedColors) return;

    setPrimaryHue(storedColors.primaryHue);
    updateCSSProperty("--primary", storedColors.primaryHue);
  };

  const resetToStoredAccentColor = () => {
    if (!storedColors) return;

    setAccentHue(storedColors.accentHue);
    updateCSSProperty("--accent", storedColors.accentHue);
  };

  return {
    primaryHue,
    accentHue,
    randomizeColors,

    storedColors,
    saveWebsiteColorsToLocalStorage,
    removeWebsiteColorsFromLocalStorage,
    resetToStoredPrimaryColor,
    resetToStoredAccentColor,
  };
};
