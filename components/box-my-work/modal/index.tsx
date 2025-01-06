import { LinkExternal } from "@/components/link-external";
import { Pill } from "@/components/pill";

import type { ModalType } from "./types";

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
}: ModalType) => {
  const renderBrief = () =>
    brief?.map?.((item, index) => <li key={index}>{item}</li>);

  const renderTechStackPills = () =>
    techStack
      ?.split(", ")
      ?.map?.((item, index) => <Pill key={index}>{item}</Pill>);

  return (
    <div className="fixed right-0 top-0 z-10 !mt-0 h-full w-full p-4">
      <div
        className="absolute right-0 top-0 z-0 h-full w-full bg-black bg-opacity-50"
        onClick={closeModal}
      />
      <div className="relative mx-auto h-full w-[calc(200dvw/3)] overflow-auto rounded-xl border border-slate-800 bg-slate-100 p-4 text-slate-900">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={closeModal}>close</button>
        </div>

        <div className="space-y-4">
          <div>{year}</div>
          <div>{long}</div>

          {brief?.length ? (
            <>
              <hr />
              <div className="font-semibold">brief</div>
              <ul className="list-inside list-disc">{renderBrief()}</ul>
              <div className="flex gap-8">
                <LinkExternal href={linkWebsite} label="website" />
                <LinkExternal href={linkMore} label="read more" />
                <LinkExternal href={linkCaseStudy} label="read case study" />
              </div>
            </>
          ) : (
            <LinkExternal href={linkWebsite} label="website" />
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
