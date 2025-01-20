type DebouncedFunctionType = (...args: Array<any>) => void;

type DebounceType<T> = {
  (debounceTimeout: number): (debouncedFunction: T) => T;
};

const DEFAULT_DEBOUNCE_TIMEOUT = 500;

const debounceBy: DebounceType<DebouncedFunctionType> =
  (debounceTimeout) => (debouncedFunction) => {
    let timeoutId: NodeJS.Timeout;

    return (...args) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => debouncedFunction(...args), debounceTimeout);
    };
  };

export const debounce = debounceBy(DEFAULT_DEBOUNCE_TIMEOUT);
