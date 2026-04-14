"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { init } from "./init";
import type { TSpinWheelContext } from "./types";

const SpinWheelContext = React.createContext<TSpinWheelContext>(init);

const parseElementsFromUrl = (searchParams: URLSearchParams): string[] => {
  const raw = searchParams.get("elements");

  if (!raw) return [""];

  const parsed = raw
    .split(",")
    .map((n) => decodeURIComponent(n.trim()))
    .filter(Boolean);

  return parsed.length > 0 ? parsed : [""];
};

export const SpinWheelContextProvider = ({ children }: TChildren) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [elements, setElements] = React.useState<string[]>(() =>
    parseElementsFromUrl(searchParams),
  );

  const [isSpinning, setIsSpinning] = React.useState(false);
  const [winner, setWinner] = React.useState<string | null>(null);

  const validElements = React.useMemo(
    () => elements.filter(Boolean),
    [elements],
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const newUrl =
        validElements.length > 0
          ? `${pathname}?elements=${validElements.map(encodeURIComponent).join(",")}`
          : pathname;
      router.replace(newUrl);
    }, 300);

    return () => clearTimeout(timer);
  }, [validElements, pathname]);

  const addElement = () => setElements((prev) => [...prev, ""]);

  const removeElement = (index: number) =>
    setElements((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [""] : next;
    });

  const updateElement = (index: number, value: string) =>
    setElements((prev) => prev.map((el, i) => (i === index ? value : el)));

  const spin = () => {
    if (isSpinning || validElements.length === 0) {
      return;
    }

    setWinner(null);
    setIsSpinning(true);
  };

  const value = {
    elements,
    validElements,
    addElement,
    removeElement,
    updateElement,
    isSpinning,
    setIsSpinning,
    winner,
    setWinner,
    spin,
  };

  return (
    <SpinWheelContext.Provider value={value}>
      {children}
    </SpinWheelContext.Provider>
  );
};

export const useSpinWheelContext = () => React.useContext(SpinWheelContext);
