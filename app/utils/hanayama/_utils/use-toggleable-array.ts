import React from "react";

type TParameters = {
  array: Array<string>;
  value: string;
};

const toggleValueIn2StateArray = ({ array, value }: TParameters) => {
  let newArray = array;

  if (array.includes(value)) {
    newArray = array.filter((v) => v !== value);
  } else {
    newArray = [...array, value];
  }

  return newArray;
};

const toggleValueIn3StateArray = ({ array, value }: TParameters) => {
  let newArray = array;

  if (array.includes(value)) {
    newArray = [...array.filter((v) => v !== value), `-${value}`];
  } else if (array.includes(`-${value}`)) {
    newArray = [...array.filter((v) => v !== `-${value}`)];
  } else if (!array.includes(value)) {
    newArray = [...array, value];
  }

  return newArray;
};

export const toggleValueInNStateArray = {
  2: toggleValueIn2StateArray,
  3: toggleValueIn3StateArray,
};

export const useToggleableArray = (
  initialArray: Array<string> = [],
  numberOfStates: 2 | 3 = 2,
) => {
  const [array, setArray] = React.useState<Array<string>>(initialArray);

  const toggleValueInArray = (value: string) => () => {
    if (!Array.isArray(array)) {
      return;
    }

    setArray(toggleValueInNStateArray[numberOfStates]({ array, value }));
  };

  const is = (x: string) => array.includes(x);

  return { array, toggleValueInArray, is };
};
