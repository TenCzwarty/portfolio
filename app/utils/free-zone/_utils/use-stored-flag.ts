import React from "react";

/** On/off switch remembered in this browser only - per-viewer preferences, not shared data. */
export const useStoredFlag = (storageKey: string) => {
  const [value, setValue] = React.useState(false);

  // read after mount: the page is prerendered, so localStorage isn't there on the first render
  React.useEffect(() => {
    try {
      setValue(window.localStorage.getItem(storageKey) === "1");
    } catch {}
  }, [storageKey]);

  const toggle = () =>
    setValue((current) => {
      try {
        window.localStorage.setItem(storageKey, current ? "0" : "1");
      } catch {}
      return !current;
    });

  return [value, toggle] as const;
};
