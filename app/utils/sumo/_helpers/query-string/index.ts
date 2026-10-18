"use client";

import { useQueryString } from "~/utils/use-query-string";

import { decode, encode, PARAM } from "./codec";

import { getAllSets } from "~sumo/_const";
import { useSumoContext } from "~sumo/_context";

/** Keeps the collection in the URL (?c=…), like the hanayama tracker:
 *  opening a link with a collection replaces the locally stored one. */
export const useSumoQueryString = () => {
  const { ownedFinishes, setOwnedFinishes } = useSumoContext();

  const onPageOpened = (queryString: string) => {
    const value = new URLSearchParams(queryString).get(PARAM);
    if (!value) return;

    setOwnedFinishes(decode(getAllSets(), value));
  };

  const getSearchParamsOnValuesChange = () => {
    const code = encode(getAllSets(), ownedFinishes);
    return code ? `${PARAM}=${code}` : "";
  };

  useQueryString({
    onPageOpened,
    getSearchParamsOnValuesChange,
    values: [ownedFinishes],
  });
};
