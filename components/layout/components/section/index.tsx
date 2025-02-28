import type { TSection } from "./types";

export const Section = ({ id, children, classes }: TSection) => (
  <section id={id} className={`py-8 ${classes}`}>
    <div className="mx-auto px-4 sm:max-w-[calc(200dvw/3)] sm:px-0">
      {children}
    </div>
  </section>
);
