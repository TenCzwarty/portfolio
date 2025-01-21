import { debounce } from "@/utils/debounce";

import { RangeType } from "./types";

import "./styles.css";

export const Range = ({ name, defaultValue, classes }: RangeType) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    document.documentElement.style.setProperty(name, e.target.value);
  };

  const onInput = debounce(onChange);

  return (
    <input
      type="range"
      onInput={onInput}
      max="360"
      defaultValue={defaultValue}
      className={classes}
      aria-disabled
      tabIndex={-1}
    />
  );
};
