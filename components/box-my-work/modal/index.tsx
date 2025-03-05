"use client";

import { LinkExternal } from "~/components/link-external";
import { Pill } from "~/components/pill";

import type { TModal } from "./types";

export const Modal = ({
  title,
  linkWebsite,
  linkMore,
  linkCaseStudy,
  year,
  long,
  brief,
  myPart,
  techStack,
  closeModal,
}: TModal) => {
  const renderBrief = () =>
    brief?.map?.((item, index) => <li key={index}>{item}</li>);

  const renderTechStackPills = () =>
    techStack
      ?.split(", ")
      ?.map?.((item, index) => <Pill key={index}>{item}</Pill>);

  return (
    <div
      className="fixed top-0 right-0 z-10 mt-0! h-full w-full p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-opacity-50 absolute top-0 right-0 z-0 h-full w-full bg-black"
        onClick={closeModal}
      />
      <div className="border-primary-800 text-primary-900 relative mx-auto h-full w-full overflow-auto rounded-xl border bg-neutral-100 p-4 md:w-[calc(200dvw/3)]">
        <div className="flex justify-between">
          <h3 id="modal-title" className="text-lg font-semibold sm:text-xl">
            {title}
          </h3>
          <button onClick={closeModal} aria-label="Close modal" className="p-2">
            close
          </button>
        </div>

        <div className="space-y-4 text-sm sm:text-base">
          <div>{year}</div>
          <div>{long}</div>

          {brief?.length ? (
            <>
              <hr />
              <div className="font-semibold">brief</div>
              <ul className="list-inside list-disc">{renderBrief()}</ul>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <LinkExternal href={linkWebsite} label="website" />
                <LinkExternal href={linkMore} label="read more" />
                <LinkExternal href={linkCaseStudy} label="read case study" />
              </div>
            </>
          ) : (
            <div className="flex gap-8">
              <LinkExternal href={linkWebsite} label="website" />
            </div>
          )}
          <hr />

          <div className="font-semibold">my part</div>
          <div>{myPart}</div>
          <hr />

          <div className="font-semibold">tech stack</div>
          <div className="flex flex-wrap gap-2">{renderTechStackPills()}</div>
        </div>
      </div>
    </div>
  );
};
