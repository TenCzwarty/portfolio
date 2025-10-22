"use client";

import { useQueryString } from "~/utils/use-query-string";

import { decode } from "./decode";
import { encode } from "./encode";

import { useHanayamaTrackerContext } from "~hanayama/_context";

const REGEX_DECODE_QUERY_STRING =
  /l?((?:\.|\d|s)+)?m?((?:\.|\d|s)+)?b?((?:\.|\d|s)+)?/g; // example: "l.123m.123b.123"

export const useHanayamaQueryString = () => {
  const {
    collectedPuzzles,
    completedPuzzles,
    setCollectedPuzzles,
    setCompletedPuzzles,
  } = useHanayamaTrackerContext();

  const onPageOpened = (queryString: string) => {
    const array = REGEX_DECODE_QUERY_STRING.exec(queryString);

    if (!array) return;

    const [, l, m, b] = array;

    if (!l && !m && !b) return;

    const { collectedIds, completedIds } = decode({ l, m, b });

    setCollectedPuzzles(collectedIds);
    setCompletedPuzzles(completedIds);
  };

  const getSearchParamsOnValuesChange = () => {
    const { l, m, b } = encode({ collectedPuzzles, completedPuzzles });

    return (
      (l.length ? "l" + l.join("") : "") +
      (m.length ? "m" + m.join("") : "") +
      (b.length ? "b" + b.join("") : "")
    );
  };

  useQueryString({
    onPageOpened,
    getSearchParamsOnValuesChange,
    values: [collectedPuzzles, completedPuzzles],
  });
};
