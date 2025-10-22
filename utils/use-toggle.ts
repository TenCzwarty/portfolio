import React from "react";

type TFunctionToggleIsActive = (
  value?: boolean | ((previousState: boolean) => boolean) | unknown,
) => void;

export const useToggle = (
  initialState: boolean = false,
): [boolean, TFunctionToggleIsActive] => {
  const [isActive, setIsActive] = React.useState<boolean>(initialState);

  const toggleIsActive: TFunctionToggleIsActive = React.useCallback((value) => {
    if (typeof value === "boolean") {
      setIsActive(value);
    } else {
      setIsActive((previousState) => !previousState);
    }
  }, []);

  return [isActive, toggleIsActive];
};

export const useNToggle = (n: number = 2, initial = 0) => {
  const [index, setIndex] = React.useState(initial);

  const next = () => setIndex((i) => (i + 1) % n);

  return [index, next] as const;
};
