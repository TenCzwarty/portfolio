import React from "react";

export const useLocalStorage = <T>(STORAGE_KEY: string, initialState: T) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    if (typeof window === "undefined") {
      return initialState;
    }

    try {
      const item = window.localStorage.getItem(STORAGE_KEY);

      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error(error);
      return initialState;
    }
  });

  const storeValue = (value: T) => {
    try {
      setStoredValue(value);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, storeValue];
};
