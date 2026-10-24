"use client";

import React from "react";

import { useBackgroundVideo } from "@/src/components/background-video/use-background-video";
import { usePageTransitionExpandingCircle } from "@/src/components/page-transition-expanding-circle/use-page-transition-expanding-circle";

import styles from "./styles.module.css";

export default function Wrapped() {
  const ref = usePageTransitionExpandingCircle();

  const [visibleComponents, setVisibleComponents] = React.useState([
    <l-bouncy size="25" speed="1" color="#ffd600"></l-bouncy>,
  ]);

  const componentsSchedule = [
    {
      component: <h1 className="text-8xl">2022</h1>,
      delay: (193 - 186) * 1000,
    },
    {
      component: <p className="text-5xl">to rok</p>,
      delay: 14 * 1000,
    },
    {
      component: <p className={`text-8xl ${styles["font-fix"]}`}>dosko(naly)</p>,
      delay: 21 * 1000,
    },
    {
      component: <p className="text-5xl">94 spotkan</p>,
      delay: 28 * 1000,
    },
    {
      component: <p className="text-5xl">87 gier</p>,
      delay: 35 * 1000,
    },
    {
      component: <p className="text-5xl">xxx </p>,
      delay: 42 * 1000,
    },
  ];

  const onStart = () => {
    setVisibleComponents([]);

    componentsSchedule.forEach(({ component, delay }) => {
      setTimeout(() => {
        setVisibleComponents((prev) => [...prev, component]);
      }, delay);
    });
  };

  useBackgroundVideo("https://www.youtube.com/watch?v=Ug0KpL08OX0", {
    start: 186,
    end: 359,
    onStart,
  });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] transition-circle"
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className={`text-center ${styles["doskozzza-beat"]}`}>
        {visibleComponents}
        </div>
        <p className="text-5xl"> => </p>
      </div>
    </div>
  );
}
