type TDebouncedFunction<T extends Array<unknown>> = (...args: T) => void;

const DEFAULT_DEBOUNCE_TIMEOUT = 500;

const debounceBy =
  (debounceTimeout: number) =>
  <T extends Array<unknown>>(debouncedFunction: TDebouncedFunction<T>) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: T) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => debouncedFunction(...args), debounceTimeout);
    };
  };

export const debounce = debounceBy(DEFAULT_DEBOUNCE_TIMEOUT);
