import React from "react";

import { init } from "./init";
import type { TAmasiaCalendarConverterContext } from "./types";

const AmasiaCalendarConverterContext =
  React.createContext<TAmasiaCalendarConverterContext>(init);

export const AmasiaCalendarConverterContextProvider = ({
  children,
}: TChildren) => {
  const [day, setDay] = React.useState<number>(1);

  const onChangeDay = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDay(parseInt(event.target.value));

  const value = { day, setDay, onChangeDay };

  return (
    <AmasiaCalendarConverterContext.Provider value={value}>
      {children}
    </AmasiaCalendarConverterContext.Provider>
  );
};

export const useAmasiaCalendarConverterContext = () =>
  React.useContext(AmasiaCalendarConverterContext);
