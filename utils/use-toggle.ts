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
