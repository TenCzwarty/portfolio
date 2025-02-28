type TDebouncedFunction = (...args: Array<any>) => void;

type TDebounce<T> = {
  (debounceTimeout: number): (debouncedFunction: T) => T;
};

const DEFAULT_DEBOUNCE_TIMEOUT = 500;

const debounceBy: TDebounce<TDebouncedFunction> =
  (debounceTimeout) => (debouncedFunction) => {
    let timeoutId: NodeJS.Timeout;

    return (...args) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => debouncedFunction(...args), debounceTimeout);
    };
  };

export const debounce = debounceBy(DEFAULT_DEBOUNCE_TIMEOUT);
