"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { init } from "./init";
import type { TSpinElement, TSpinWheelContext } from "./types";

const SpinWheelContext = React.createContext<TSpinWheelContext>(init);

const parseElementsFromUrl = (searchParams: URLSearchParams): TSpinElement[] => {
  const raw = searchParams.get("elements");

  if (!raw) return [{ label: "" }];

  const parsed = raw
    .split(",")
    .map((s) => {
      const decoded = decodeURIComponent(s.trim());
      const colonIdx = decoded.lastIndexOf(":");
      if (colonIdx === -1) return { label: decoded };
      const label = decoded.slice(0, colonIdx);
      const weight = parseFloat(decoded.slice(colonIdx + 1));
      if (!label || isNaN(weight) || weight <= 0) return { label: decoded };
      return { label, weight };
    })
    .filter((e) => e.label);

  return parsed.length > 0 ? parsed : [{ label: "" }];
};

const serializeElement = (el: TSpinElement): string => {
  const encoded = encodeURIComponent(el.label);
  return el.weight !== undefined ? `${encoded}:${el.weight}` : encoded;
};

export const SpinWheelContextProvider = ({ children }: TChildren) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [elements, setElements] = React.useState<TSpinElement[]>(() =>
    parseElementsFromUrl(searchParams),
  );

  const [isSpinning, setIsSpinning] = React.useState(false);
  const [winner, setWinner] = React.useState<string | null>(null);

  const validElements = React.useMemo(
    () => elements.filter((e) => e.label),
    [elements],
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const newUrl =
        validElements.length > 0
          ? `${pathname}?elements=${validElements.map(serializeElement).join(",")}`
          : pathname;
      router.replace(newUrl);
    }, 300);

    return () => clearTimeout(timer);
  }, [validElements, pathname]);

  const addElement = () => setElements((prev) => [...prev, { label: "" }]);

  const removeElement = (index: number) =>
    setElements((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [{ label: "" }] : next;
    });

  const updateElement = (index: number, element: TSpinElement) =>
    setElements((prev) => prev.map((el, i) => (i === index ? element : el)));

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
