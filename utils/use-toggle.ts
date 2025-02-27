import React from "react";

type FunctionToggleIsActive = (
  value?: boolean | ((previousState: boolean) => boolean) | unknown,
) => void;

export const useToggle = (
  initialState: boolean = false,
): [boolean, FunctionToggleIsActive] => {
  const [isActive, setIsActive] = React.useState<boolean>(initialState);

  const toggleIsActive: FunctionToggleIsActive = React.useCallback((value) => {
    if (typeof value === "boolean") {
      setIsActive(value);
    } else {
      setIsActive((previousState) => !previousState);
    }
  }, []);

  return [isActive, toggleIsActive];
};
