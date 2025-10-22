import { useLocalStorage } from "~/utils/use-local-storage";

import { toggleValueInNStateArray } from "~hanayama/_utils/use-toggleable-array";

export const useLocallyStoredToggleableArray = <T>(STORAGE_KEY: string) => {
  const [storedValue, setStoredValue] = useLocalStorage<Array<T>>(
    STORAGE_KEY,
    [],
  );

  const toggleAndSave = (value: string) =>
    setStoredValue(toggleValueInNStateArray[2]({ array: storedValue, value }));

  const is = (value: string) => storedValue.includes(value);

  return [storedValue, toggleAndSave, is, setStoredValue];
};
