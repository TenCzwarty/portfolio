"use client";

import React from "react";

import { getAllSets } from "~/app/utils/sumo/_const";
import { Section } from "~/components/section";

import "./styles.css";

import { SumoCardSet } from "~sumo/_components/card-set";

export default function UtilsSumoTrackerPage() {
  const allSets = getAllSets();

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mt-16 mb-8 ml-4">
          <h1 className="text-xl font-semibold sm:text-3xl">
            Sumo Card Tracker
          </h1>
          <p>BBM sumo trading card catalog — Reiwa era (2020–present)</p>
        </div>

        <div className="flex gap-4">
          <div className="w-full space-y-4">
            {allSets.map((sumoSet) => (
              <SumoCardSet key={sumoSet.code} sumoSet={sumoSet} />
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
