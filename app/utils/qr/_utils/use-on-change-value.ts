import React from "react";

type TReturn = [string, (e: React.ChangeEvent<HTMLInputElement>) => void];

export const useOnChangeValue = (initial?: string): TReturn => {
  const [value, setValue] = React.useState(initial ?? "");

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  return [value, onChangeValue];
};
