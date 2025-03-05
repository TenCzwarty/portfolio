"use client";

import React from "react";

import { turnBracketsIntoSpans } from "./utils/turn-brackets-into-spans";
import { Modal } from "./modal";
import type { TBoxMyWork } from "./types";

const BoxMyWork = ({ title, year, short, results, ...rest }: TBoxMyWork) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <>
      {isModalVisible && (
        <Modal
          closeModal={closeModal}
          {...{ title, year, short, results, ...rest }}
        />
      )}

      <button
        className="group border-primary-800 hover:bg-accent-500 hover:text-primary-900 flex w-full gap-4 rounded-xl border border-2 p-4 text-start"
        onClick={openModal}
        aria-haspopup="dialog"
        aria-expanded={isModalVisible}
      >
        <div className="flex w-full flex-col items-start">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="text-lg font-semibold sm:text-xl">{title}</div>
            <div className="hidden sm:block">{year}</div>
          </div>
          <p className="text-xs sm:text-sm">{short}</p>
          {results && (
            <div
              className="results *:text-accent-500 *:group-hover:text-accent-900 mt-4 text-xs sm:text-base"
              dangerouslySetInnerHTML={{
                __html: turnBracketsIntoSpans(results),
              }}
            />
          )}
        </div>
      </button>
    </>
  );
};

export const myWorkWrapper = (props: TBoxMyWork, index: number) => (
  <BoxMyWork key={index} {...props} />
);
