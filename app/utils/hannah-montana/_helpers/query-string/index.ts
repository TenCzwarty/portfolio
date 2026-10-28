"use client";

import { useQueryString } from "~/utils/use-query-string";

import { HANNAH_SET } from "~hannah-montana/_const";
import { useHannahContext } from "~hannah-montana/_context";
import { decode, encode, PARAM } from "~sumo/_helpers/query-string/codec";

/** Same ?c=… collection link as the sumo tracker, with the one Hannah set */
export const useHannahQueryString = () => {
  const { ownedFinishes, setOwnedFinishes } = useHannahContext();

  const onPageOpened = (queryString: string) => {
    const value = new URLSearchParams(queryString).get(PARAM);
    if (!value) return;

    setOwnedFinishes(decode([HANNAH_SET], value));
  };

  const getSearchParamsOnValuesChange = () => {
    const code = encode([HANNAH_SET], ownedFinishes);
    return code ? `${PARAM}=${code}` : "";
  };

  useQueryString({
    onPageOpened,
    getSearchParamsOnValuesChange,
    values: [ownedFinishes],
  });
};
