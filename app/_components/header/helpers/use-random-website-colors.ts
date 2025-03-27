import React from "react";

export const useRandomWebsiteColors = () => {
  const [primaryHue, setPrimaryHue] = React.useState(0);
  const [accentHue, setAccentHue] = React.useState(0);

  React.useEffect(() => {
    const primary = Math.random() * 360;
    const accent = Math.random() * 360;

    setPrimaryHue(primary);
    setAccentHue(accent);

    document.documentElement.style.setProperty("--transparency", "1");
    document.documentElement.style.setProperty("--s", "100%");
    document.documentElement.style.setProperty("--primary", primary.toString());
    document.documentElement.style.setProperty("--accent", accent.toString());
  }, []);

  return { primaryHue, accentHue };
};
