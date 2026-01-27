"use client";

import React from "react";

import { updateCSSProperty } from "../../utils/update-css-property";

import type { TRange } from "./types";

import "./styles.css";

export const Range = ({ name, value, classes }: TRange) => {
  const [controlledValue, setControlledValue] = React.useState(value);

  React.useEffect(() => {
    setControlledValue(value);
  }, [value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);

    setControlledValue(newValue);
    updateCSSProperty(name, newValue);
  };

  return (
    <input
      type="range"
      onChange={onChange}
      min="0"
      max="360"
      value={controlledValue}
      className={classes}
      tabIndex={-1}
    />
  );
};
